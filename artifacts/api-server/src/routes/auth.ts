import { Router, type IRouter } from "express";
import cookieParser from "cookie-parser";
import { changePassword, clearSession, ensureMasterAccount, getAuthenticatedUser, login, publicUser, requireAuth, SESSION_COOKIE } from "../middlewares/auth";

const router: IRouter = Router();
router.use(cookieParser());

router.get("/auth/status", async (_req, res): Promise<void> => {
  await ensureMasterAccount();
  res.json({
    setupRequired: !(process.env.INITIAL_MD_USERNAME && process.env.INITIAL_MD_PASSWORD),
    loginAvailable: Boolean(process.env.INITIAL_MD_USERNAME && process.env.INITIAL_MD_PASSWORD),
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const identifier = typeof req.body?.identifier === "string" ? req.body.identifier : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!identifier.trim() || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }
  try {
    const result = await login(identifier, password, req);
    if (!result.ok) {
      res.status(401).json({ error: "Invalid username or password." });
      return;
    }
    res.cookie(SESSION_COOKIE, result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 8 * 60 * 60 * 1000,
      path: "/",
    });
    res.json({
      user: result.user,
      mustChangePassword: result.mustChangePassword,
      redirectTo: result.mustChangePassword ? "/change-password" : "/md",
    });
  } catch (error) {
    req.log?.error?.({ error }, "Login failed");
    res.status(503).json({ error: "Authentication is not ready. Configure the initial Master MD account." });
  }
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  await clearSession(req);
  res.clearCookie(SESSION_COOKIE, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
  res.status(204).end();
});

router.get("/auth/session", async (req, res): Promise<void> => {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  res.json({ user: publicUser(user), mustChangePassword: user.mustChangePassword });
});

router.post("/auth/change-password", requireAuth, async (req, res): Promise<void> => {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  const currentPassword = typeof req.body?.currentPassword === "string" ? req.body.currentPassword : "";
  const newPassword = typeof req.body?.newPassword === "string" ? req.body.newPassword : "";
  if (newPassword.length < 10) {
    res.status(400).json({ error: "New password must be at least 10 characters." });
    return;
  }
  if (!(await changePassword(user.id, currentPassword, newPassword))) {
    res.status(400).json({ error: "Current password is incorrect." });
    return;
  }
  res.json({ user: publicUser({ ...user, mustChangePassword: false, passwordHash: null }), mustChangePassword: false, redirectTo: "/md" });
});

export default router;