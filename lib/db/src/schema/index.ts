import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const jobStatusEnum = pgEnum("job_status", [
  "DRAFT",
  "RECEIVED",
  "IN_DESIGN",
  "SAMPLE_PENDING",
  "SAMPLE_APPROVAL",
  "IN_PRODUCTION",
  "QC",
  "READY",
  "DELIVERED",
  "CANCELLED",
]);
export const jobPriorityEnum = pgEnum("job_priority", ["LOW", "NORMAL", "HIGH", "URGENT"]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["UNPAID", "PARTIAL", "PAID", "OVERDUE", "CANCELLED"]);
export const paymentMethodEnum = pgEnum("payment_method", ["CASH", "BANK", "BKASH", "NAGAD", "OTHER"]);
export const ledgerTypeEnum = pgEnum("ledger_type", ["INCOME", "EXPENSE"]);

const auditColumns = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
};

export const departmentsTable = pgTable("departments", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  active: boolean("active").notNull().default(true),
  ...auditColumns,
});

export const printingSectionsTable = pgTable("printing_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  active: boolean("active").notNull().default(true),
  ...auditColumns,
});

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").unique(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  employeeId: text("employee_id").unique(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  department: text("department").notNull(),
  role: text("role").notNull(),
  active: boolean("active").notNull().default(true),
  permissions: text("permissions").array().notNull().default([]),
  passwordHash: text("password_hash"),
  status: text("status").notNull().default("ACTIVE"),
  mustChangePassword: boolean("must_change_password").notNull().default(false),
  failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  isMaster: boolean("is_master").notNull().default(false),
  lastLogin: timestamp("last_login", { withTimezone: true }),
  ...auditColumns,
}, (table) => [index("users_email_idx").on(table.email)]);

export const sessionsTable = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  tokenHash: text("token_hash").notNull().unique(),
  userId: uuid("user_id").notNull().references(() => usersTable.id),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("sessions_user_idx").on(table.userId),
  index("sessions_expiry_idx").on(table.expiresAt),
]);

export const loginActivityTable = pgTable("login_activity", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id),
  identifier: text("identifier").notNull(),
  success: boolean("success").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("login_activity_user_idx").on(table.userId, table.createdAt),
  index("login_activity_created_idx").on(table.createdAt),
]);

export const companiesTable = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address"),
  notes: text("notes"),
  status: text("status").notNull().default("ACTIVE"),
  ...auditColumns,
}, (table) => [index("companies_name_idx").on(table.name)]);

export const jobsTable = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobNumber: text("job_number").notNull().unique(),
  companyId: uuid("company_id").notNull().references(() => companiesTable.id),
  contactPerson: text("contact_person").notNull(),
  jobType: text("job_type").notNull(),
  printingSection: text("printing_section").notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  receivedQuantity: integer("received_quantity").notNull(),
  completedQuantity: integer("completed_quantity").notNull().default(0),
  damagedQuantity: integer("damaged_quantity").notNull().default(0),
  expectedDeliveryDate: date("expected_delivery_date", { mode: "string" }).notNull(),
  priority: jobPriorityEnum("priority").notNull().default("NORMAL"),
  status: jobStatusEnum("status").notNull().default("RECEIVED"),
  sampleRequired: boolean("sample_required").notNull().default(false),
  notes: text("notes"),
  ...auditColumns,
}, (table) => [
  index("jobs_company_idx").on(table.companyId),
  index("jobs_status_idx").on(table.status),
  index("jobs_created_idx").on(table.createdAt),
]);

export const jobStatusHistoryTable = pgTable("job_status_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobId: uuid("job_id").notNull().references(() => jobsTable.id),
  oldStatus: jobStatusEnum("old_status"),
  newStatus: jobStatusEnum("new_status").notNull(),
  actorName: text("actor_name").notNull(),
  note: text("note"),
  ...auditColumns,
}, (table) => [index("job_history_job_idx").on(table.jobId, table.createdAt)]);

export const invoicesTable = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  companyId: uuid("company_id").notNull().references(() => companiesTable.id),
  issueDate: date("issue_date", { mode: "string" }).notNull(),
  dueDate: date("due_date", { mode: "string" }).notNull(),
  subtotal: numeric("subtotal", { precision: 14, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 14, scale: 2 }).notNull().default("0"),
  tax: numeric("tax", { precision: 14, scale: 2 }).notNull().default("0"),
  grandTotal: numeric("grand_total", { precision: 14, scale: 2 }).notNull(),
  paid: numeric("paid", { precision: 14, scale: 2 }).notNull().default("0"),
  status: invoiceStatusEnum("status").notNull().default("UNPAID"),
  ...auditColumns,
}, (table) => [
  index("invoices_company_idx").on(table.companyId),
  index("invoices_due_date_idx").on(table.dueDate),
]);

export const invoiceItemsTable = pgTable("invoice_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceId: uuid("invoice_id").notNull().references(() => invoicesTable.id),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 14, scale: 2 }).notNull(),
  lineTotal: numeric("line_total", { precision: 14, scale: 2 }).notNull(),
});

export const paymentsTable = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceId: uuid("invoice_id").notNull().references(() => invoicesTable.id),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  method: paymentMethodEnum("method").notNull(),
  referenceNumber: text("reference_number"),
  date: date("date", { mode: "string" }).notNull(),
  receivedBy: text("received_by").notNull(),
  notes: text("notes"),
  ...auditColumns,
}, (table) => [index("payments_invoice_idx").on(table.invoiceId, table.createdAt)]);

export const ledgerEntriesTable = pgTable("ledger_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: date("date", { mode: "string" }).notNull(),
  type: ledgerTypeEnum("type").notNull(),
  category: text("category").notNull(),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  description: text("description").notNull(),
  reference: text("reference"),
  createdBy: text("created_by").notNull(),
  ...auditColumns,
}, (table) => [index("ledger_date_idx").on(table.date)]);

export const notificationsTable = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  recipientId: uuid("recipient_id").references(() => usersTable.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  read: boolean("read").notNull().default(false),
  link: text("link"),
  ...auditColumns,
});

export const auditLogsTable = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id),
  userName: text("user_name").notNull(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id").notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  ...auditColumns,
}, (table) => [index("audit_created_idx").on(table.createdAt)]);

export const insertCompanySchema = createInsertSchema(companiesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertJobSchema = createInsertSchema(jobsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertInvoiceSchema = createInsertSchema(invoicesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPaymentSchema = createInsertSchema(paymentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLedgerEntrySchema = createInsertSchema(ledgerEntriesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertLedgerEntry = z.infer<typeof insertLedgerEntrySchema>;
export type Company = typeof companiesTable.$inferSelect;
export type Job = typeof jobsTable.$inferSelect;
export type Invoice = typeof invoicesTable.$inferSelect;
export type Payment = typeof paymentsTable.$inferSelect;
export type LedgerEntry = typeof ledgerEntriesTable.$inferSelect;