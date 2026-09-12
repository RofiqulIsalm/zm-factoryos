import { createHash, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { NextFunction, Request, Response } from "express";
import { and, eq, gt, or, ilike } from "drizzle-orm";
import { db, auditLogsTable, loginActivityTable, sessionsTable, usersTable } from "@workspace/db";

const scrypt = promisify(nodeScrypt);
const SESSION_COOKIE = "factory_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export type SafeUser = Omit<typeof usersTable.$inferSelect, "passwordHash" | "failedLoginAttempts" | "lockedUntil" | "isMaster" | "clerkUserId">;

function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string | null): Promise<boolean> {
  if (!stored) return false;
  const [, salt, expectedHex] = stored.split("$");
  if (!salt || !expectedHex) return false;
  const actual = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(expectedHex, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function publicUser(user: typeof usersTable.$inferSelect): SafeUser {
  const {
    passwordHash: _passwordHash,
    failedLoginAttempts: _failedLoginAttempts,
    lockedUntil: _lockedUntil,
    isMaster: _isMaster,
    clerkUserId: _clerkUserId,
    ...safe
  } = user;
  return safe;
}

export async function getAuthenticatedUser(req: Request): Promise<typeof usersTable.$inferSelect | null> {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (!token) return null;
  const [session] = await db.select().from(sessionsTable)
    .where(and(eq(sessionsTable.tokenHash, tokenHash(token)), gt(sessionsTable.expiresAt, new Date())))
    .limit(1);
  if (!session) return null;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, session.userId)).limit(1);
  if (!user || !user.active || user.status !== "ACTIVE") return null;
  await db.update(sessionsTable).set({ lastSeenAt: new Date() }).where(eq(sessionsTable.id, session.id));
  return user;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    next();
  } catch (error) {
    req.log?.error?.({ error }, "Authentication lookup failed");
    res.status(401).json({ error: "Authentication required" });
  }
}

export async function requireMaster(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  if (!user.isMaster && user.role !== "ADMIN") {
    res.status(403).json({ error: "Master MD or authorized administrator access required" });
    return;
  }
  next();
}

export async function ensureMasterAccount(): Promise<void> {
  const username = process.env.INITIAL_MD_USERNAME?.trim();
  const password = process.env.INITIAL_MD_PASSWORD;
  if (!username || !password) return;
  const existingMaster = await db.select({ id: usersTable.id }).from(usersTable)
    .where(eq(usersTable.isMaster, true)).limit(1);
  if (existingMaster[0]) return;
  const [master] = await db.insert(usersTable).values({
    username: username.toLowerCase(),
    name: process.env.INITIAL_MD_NAME?.trim() || "Managing Director",
    employeeId: "MD-0001",
    email: process.env.INITIAL_MD_EMAIL?.trim().toLowerCase() || `${username.toLowerCase()}@factoryos.local`,
    department: "Management",
    role: "MASTER_MD",
    permissions: ["*"],
    passwordHash: await hashPassword(password),
    mustChangePassword: true,
    isMaster: true,
  }).returning();
  if (master) {
    await db.insert(auditLogsTable).values({
      userId: master.id,
      userName: master.name,
      action: "MASTER_ACCOUNT_INITIALIZED",
      entity: "USER",
      entityId: master.id,
      newValue: "MASTER_MD",
    });
  }
}

export async function login(identifier: string, password: string, req: Request): Promise<
  { ok: true; user: SafeUser; mustChangePassword: boolean; token: string } | { ok: false; locked: boolean }
> {
  await ensureMasterAccount();
  const normalized = identifier.trim().toLowerCase();
  const [user] = await db.select().from(usersTable)
    .where(or(ilike(usersTable.username, normalized), ilike(usersTable.email, normalized)))
    .limit(1);
  const now = new Date();
  const locked = Boolean(user?.lockedUntil && user.lockedUntil > now);
  const valid = Boolean(user && !locked && user.active && user.status === "ACTIVE" && await verifyPassword(password, user.passwordHash));
  await db.insert(loginActivityTable).values({
    userId: user?.id,
    identifier: normalized,
    success: valid,
    ipAddress: req.ip,
    userAgent: req.get("user-agent") ?? null,
  });
  if (!valid) {
    if (user && !locked) {
      const attempts = user.failedLoginAttempts + 1;
      await db.update(usersTable).set({
        failedLoginAttempts: attempts >= MAX_FAILED_LOGINS ? 0 : attempts,
        lockedUntil: attempts >= MAX_FAILED_LOGINS ? new Date(now.getTime() + LOCKOUT_MS) : null,
      }).where(eq(usersTable.id, user.id));
    }
    return { ok: false, locked };
  }
  const token = randomBytes(32).toString("base64url");
  await db.insert(sessionsTable).values({
    tokenHash: tokenHash(token),
    userId: user.id,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
  });
  await db.update(usersTable).set({ lastLogin: now, failedLoginAttempts: 0, lockedUntil: null }).where(eq(usersTable.id, user.id));
  return { ok: true, user: publicUser(user), mustChangePassword: user.mustChangePassword, token };
}

export async function clearSession(req: Request): Promise<void> {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (token) await db.delete(sessionsTable).where(eq(sessionsTable.tokenHash, tokenHash(token)));
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) return false;
  await db.update(usersTable).set({ passwordHash: await hashPassword(newPassword), mustChangePassword: false }).where(eq(usersTable.id, userId));
  await db.insert(auditLogsTable).values({
    userId: user.id,
    userName: user.name,
    action: "PASSWORD_CHANGED",
    entity: "USER",
    entityId: user.id,
    newValue: "password updated",
  });
  return true;
}

export { SESSION_COOKIE };