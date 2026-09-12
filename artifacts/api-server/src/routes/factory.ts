import { Router, type IRouter } from "express";
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import {
  db,
  auditLogsTable,
  companiesTable,
  departmentsTable,
  invoiceItemsTable,
  invoicesTable,
  jobStatusHistoryTable,
  jobsTable,
  ledgerEntriesTable,
  notificationsTable,
  paymentsTable,
  printingSectionsTable,
  usersTable,
} from "@workspace/db";
import {
  CreateCompanyBody,
  CreateInvoiceBody,
  CreateJobBody,
  CreateLedgerEntryBody,
  CreateUserBody,
  GetCompanyParams,
  GetJobParams,
  ListActivityQueryParams,
  ListAuditLogsQueryParams,
  ListCompaniesQueryParams,
  ListInvoicesQueryParams,
  ListJobsQueryParams,
  ListLedgerEntriesQueryParams,
  ListPaymentsQueryParams,
  ListUsersQueryParams,
  UpdateCompanyBody,
  UpdateCompanyParams,
  UpdateJobBody,
  UpdateJobParams,
  UpdateJobStatusBody,
  UpdateJobStatusParams,
  ReceivePaymentBody,
  MarkNotificationReadParams,
  GetCurrentUserResponse,
  GetDashboardSummaryResponse,
  ListActivityResponse,
  ListJobsResponse,
  CreateJobResponse,
  GetJobResponse,
  UpdateJobResponse,
  UpdateJobStatusResponse,
  ListCompaniesResponse,
  CreateCompanyResponse,
  GetCompanyResponse,
  UpdateCompanyResponse,
  GetBillingSummaryResponse,
  ListInvoicesResponse,
  CreateInvoiceResponse,
  ListPaymentsResponse,
  ReceivePaymentResponse,
  GetAccountingSummaryResponse,
  ListLedgerEntriesResponse,
  CreateLedgerEntryResponse,
  ListUsersResponse,
  CreateUserResponse,
  ListNotificationsResponse,
  MarkNotificationReadResponse,
  ListAuditLogsResponse,
  GetSettingsCatalogsResponse,
} from "@workspace/api-zod";
import { getAuthenticatedUser, hashPassword, requireAuth, requireMaster } from "../middlewares/auth";

const router: IRouter = Router();
router.use(requireAuth);
router.use("/users", requireMaster);
router.use("/audit-logs", requireMaster);

const today = () => new Date().toISOString().slice(0, 10);
const calendarDate = (value: Date | string) => value instanceof Date ? value.toISOString().slice(0, 10) : value;
const money = (value: string | number | null | undefined) => Number(value ?? 0);
const dateTime = (value: Date | null | undefined) => (value ?? new Date()).toISOString();
const pageData = (page: number, pageSize: number, total: number) => ({
  page,
  pageSize,
  total,
  totalPages: Math.max(1, Math.ceil(total / pageSize)),
});

async function getActor(req: Parameters<typeof requireAuth>[0]): Promise<{ id: string; name: string }> {
  const user = await getAuthenticatedUser(req);
  if (!user) throw new Error("Authentication required");
  return { id: user.id, name: user.name };
}

async function companyName(companyId: string): Promise<string> {
  const [company] = await db.select({ name: companiesTable.name }).from(companiesTable).where(eq(companiesTable.id, companyId)).limit(1);
  return company?.name ?? "Unknown company";
}

async function jobView(job: typeof jobsTable.$inferSelect) {
  const [company] = await db.select({ name: companiesTable.name }).from(companiesTable).where(eq(companiesTable.id, job.companyId)).limit(1);
  const current = new Date();
  const deadline = new Date(`${job.expectedDeliveryDate}T23:59:59`);
  return {
    id: job.id,
    jobNumber: job.jobNumber,
    companyId: job.companyId,
    companyName: company?.name ?? "Unknown company",
    contactPerson: job.contactPerson,
    jobType: job.jobType,
    printingSection: job.printingSection,
    description: job.description,
    quantity: job.quantity,
    receivedQuantity: job.receivedQuantity,
    completedQuantity: job.completedQuantity,
    damagedQuantity: job.damagedQuantity,
    priority: job.priority,
    status: job.status,
    expectedDeliveryDate: job.expectedDeliveryDate,
    sampleRequired: job.sampleRequired,
    overdue: deadline < current && !["DELIVERED", "CANCELLED"].includes(job.status),
    createdAt: dateTime(job.createdAt),
    updatedAt: dateTime(job.updatedAt),
  };
}

router.get("/me", async (req, res): Promise<void> => {
  const actor = await getActor(req);
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, actor.id)).limit(1);
  if (!user) {
    res.status(401).json({ error: "User profile unavailable" });
    return;
  }
  res.json(GetCurrentUserResponse.parse({
    id: user.id,
    name: user.name,
    employeeId: user.employeeId,
    email: user.email,
    phone: user.phone,
    department: user.department,
    role: user.role,
    active: user.active,
    permissions: user.permissions,
    lastLogin: user.lastLogin?.toISOString() ?? null,
    createdAt: dateTime(user.createdAt),
  }));
});

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const jobs = await db.select().from(jobsTable);
  const invoices = await db.select().from(invoicesTable);
  const ledger = await db.select().from(ledgerEntriesTable);
  const activeJobs = jobs.filter((job) => !["DELIVERED", "CANCELLED"].includes(job.status));
  const monthlyRevenue = invoices.reduce((total, invoice) => total + money(invoice.grandTotal), 0);
  const monthlyExpense = ledger.filter((entry) => entry.type === "EXPENSE").reduce((total, entry) => total + money(entry.amount), 0);
  const pipeline = ["RECEIVED", "IN_PRODUCTION", "QC", "READY", "DELIVERED"].map((label) => ({
    label,
    value: jobs.filter((job) => job.status === label).length,
  }));
  const workload = ["Reception", "Design", "Production", "QC", "Delivery"].map((department) => ({
    department,
    value: activeJobs.filter((job) => department === "Production" ? job.status === "IN_PRODUCTION" : department === "QC" ? job.status === "QC" : 0).length,
  }));
  const result = {
    kpis: {
      todayJobs: jobs.filter((job) => dateTime(job.createdAt).slice(0, 10) === today()).length,
      activeJobs: activeJobs.length,
      productionJobs: jobs.filter((job) => job.status === "IN_PRODUCTION").length,
      qcJobs: jobs.filter((job) => job.status === "QC").length,
      readyJobs: jobs.filter((job) => job.status === "READY").length,
      todayDeliveries: jobs.filter((job) => job.status === "DELIVERED" && dateTime(job.updatedAt).slice(0, 10) === today()).length,
      receivable: invoices.reduce((total, invoice) => total + money(invoice.grandTotal) - money(invoice.paid), 0),
      monthlyRevenue,
      monthlyExpense,
      estimatedProfit: monthlyRevenue - monthlyExpense,
    },
    pipeline,
    workload,
    revenueTrend: [{ label: "This month", revenue: monthlyRevenue, expense: monthlyExpense }],
    attention: [
      { label: "Overdue jobs", count: jobs.filter((job) => new Date(`${job.expectedDeliveryDate}T23:59:59`) < new Date() && !["DELIVERED", "CANCELLED"].includes(job.status)).length, tone: "danger" },
      { label: "Unpaid invoices", count: invoices.filter((invoice) => invoice.status !== "PAID" && invoice.status !== "CANCELLED").length, tone: "warning" },
      { label: "Urgent jobs", count: jobs.filter((job) => job.priority === "URGENT" && !["DELIVERED", "CANCELLED"].includes(job.status)).length, tone: "info" },
      { label: "QC checks", count: jobs.filter((job) => job.status === "QC").length, tone: "success" },
    ],
  };
  res.json(GetDashboardSummaryResponse.parse(result));
});

router.get("/activity", async (req, res): Promise<void> => {
  const params = ListActivityQueryParams.safeParse(req.query);
  const limit = params.success ? params.data.limit : 10;
  const logs = await db.select().from(auditLogsTable).orderBy(desc(auditLogsTable.createdAt)).limit(limit);
  res.json(ListActivityResponse.parse(logs.map((log) => ({
    id: log.id,
    type: log.entity,
    title: log.action.replaceAll("_", " "),
    description: `${log.entity} ${log.entityId}`,
    actor: log.userName,
    createdAt: dateTime(log.createdAt),
    href: log.entity === "JOB" ? `/reception/jobs/${log.entityId}` : null,
  }))));
});

router.get("/jobs", async (req, res): Promise<void> => {
  const params = ListJobsQueryParams.safeParse(req.query);
  const page = params.success ? params.data.page : 1;
  const pageSize = params.success ? params.data.pageSize : 20;
  const search = params.success ? params.data.search : undefined;
  const status = params.success ? params.data.status : undefined;
  const priority = params.success ? params.data.priority : undefined;
  const filters = [
    search ? or(ilike(jobsTable.jobNumber, `%${search}%`), ilike(jobsTable.description, `%${search}%`)) : undefined,
    status ? eq(jobsTable.status, status) : undefined,
    priority ? eq(jobsTable.priority, priority) : undefined,
  ].filter(Boolean);
  const rows = await db.select().from(jobsTable).where(filters.length ? and(...filters) : undefined).orderBy(desc(jobsTable.createdAt)).limit(pageSize).offset((page - 1) * pageSize);
  const totalResult = await db.select({ value: count() }).from(jobsTable).where(filters.length ? and(...filters) : undefined);
  res.json(ListJobsResponse.parse({ items: await Promise.all(rows.map(jobView)), pagination: pageData(page, pageSize, Number(totalResult[0]?.value ?? 0)) }));
});

router.post("/jobs", async (req, res): Promise<void> => {
  const parsed = CreateJobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const actor = await getActor(req);
  const dateKey = today().replaceAll("-", "").slice(2);
  const existing = await db.select({ value: count() }).from(jobsTable).where(ilike(jobsTable.jobNumber, `JOB-${dateKey}-%`));
  const sequence = Number(existing[0]?.value ?? 0) + 1;
  const [job] = await db.insert(jobsTable).values({
    ...parsed.data,
    expectedDeliveryDate: calendarDate(parsed.data.expectedDeliveryDate),
    jobNumber: `JOB-${dateKey}-${String(sequence).padStart(4, "0")}`,
  }).returning();
  await db.insert(jobStatusHistoryTable).values({ jobId: job.id, newStatus: job.status, actorName: actor.name, note: "Job received" });
  await db.insert(auditLogsTable).values({ userId: actor.id, userName: actor.name, action: "JOB_CREATED", entity: "JOB", entityId: job.id, newValue: job.jobNumber });
  res.status(201).json(CreateJobResponse.parse(await jobView(job)));
});

router.get("/jobs/:id", async (req, res): Promise<void> => {
  const params = GetJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, params.data.id)).limit(1);
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  const history = await db.select().from(jobStatusHistoryTable).where(eq(jobStatusHistoryTable.jobId, job.id)).orderBy(asc(jobStatusHistoryTable.createdAt));
  res.json(GetJobResponse.parse({
    ...(await jobView(job)),
    timeline: history.map((entry) => ({
      id: entry.id,
      action: "STATUS_CHANGED",
      description: entry.note ?? `${entry.oldStatus ?? "NEW"} → ${entry.newStatus}`,
      actorName: entry.actorName,
      createdAt: dateTime(entry.createdAt),
    })),
    remainingQuantity: Math.max(0, job.quantity - job.completedQuantity - job.damagedQuantity),
    daysInFactory: Math.max(0, Math.floor((Date.now() - job.createdAt.getTime()) / 86_400_000)),
  }));
});

router.patch("/jobs/:id", async (req, res): Promise<void> => {
  const params = UpdateJobParams.safeParse(req.params);
  const parsed = UpdateJobBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [job] = await db.update(jobsTable).set({
    ...parsed.data,
    expectedDeliveryDate: parsed.data.expectedDeliveryDate ? calendarDate(parsed.data.expectedDeliveryDate) : undefined,
  }).where(eq(jobsTable.id, params.data.id)).returning();
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json(UpdateJobResponse.parse(await jobView(job)));
});

router.post("/jobs/:id/status", async (req, res): Promise<void> => {
  const params = UpdateJobStatusParams.safeParse(req.params);
  const parsed = UpdateJobStatusBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [current] = await db.select().from(jobsTable).where(eq(jobsTable.id, params.data.id)).limit(1);
  if (!current) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  const actor = await getActor(req);
  const [job] = await db.update(jobsTable).set({ status: parsed.data.status }).where(eq(jobsTable.id, current.id)).returning();
  await db.insert(jobStatusHistoryTable).values({ jobId: current.id, oldStatus: current.status, newStatus: parsed.data.status, actorName: actor.name, note: parsed.data.note });
  await db.insert(auditLogsTable).values({ userId: actor.id, userName: actor.name, action: "STATUS_CHANGED", entity: "JOB", entityId: current.id, oldValue: current.status, newValue: parsed.data.status });
  res.json(UpdateJobStatusResponse.parse(await jobView(job)));
});

router.get("/companies", async (req, res): Promise<void> => {
  const params = ListCompaniesQueryParams.safeParse(req.query);
  const page = params.success ? params.data.page : 1;
  const pageSize = params.success ? params.data.pageSize : 20;
  const search = params.success ? params.data.search : undefined;
  const filter = search ? or(ilike(companiesTable.name, `%${search}%`), ilike(companiesTable.contactPerson, `%${search}%`)) : undefined;
  const rows = await db.select().from(companiesTable).where(filter).orderBy(asc(companiesTable.name)).limit(pageSize).offset((page - 1) * pageSize);
  const totals = await db.select({ value: count() }).from(companiesTable).where(filter);
  res.json(ListCompaniesResponse.parse({ items: await Promise.all(rows.map(async (company) => ({
    id: company.id, name: company.name, contactPerson: company.contactPerson, phone: company.phone, email: company.email, address: company.address, notes: company.notes, status: company.status, outstanding: 0, createdAt: dateTime(company.createdAt),
  }))), pagination: pageData(page, pageSize, Number(totals[0]?.value ?? 0)) }));
});

router.post("/companies", async (req, res): Promise<void> => {
  const parsed = CreateCompanyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const actor = await getActor(req);
  const [company] = await db.insert(companiesTable).values(parsed.data).returning();
  await db.insert(auditLogsTable).values({ userId: actor.id, userName: actor.name, action: "COMPANY_CREATED", entity: "COMPANY", entityId: company.id, newValue: company.name });
  res.status(201).json(CreateCompanyResponse.parse({ ...company, outstanding: 0, createdAt: dateTime(company.createdAt) }));
});

router.get("/companies/:id", async (req, res): Promise<void> => {
  const params = GetCompanyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, params.data.id)).limit(1);
  if (!company) {
    res.status(404).json({ error: "Company not found" });
    return;
  }
  const jobs = await db.select().from(jobsTable).where(eq(jobsTable.companyId, company.id)).orderBy(desc(jobsTable.createdAt));
  const invoices = await db.select().from(invoicesTable).where(eq(invoicesTable.companyId, company.id)).orderBy(desc(invoicesTable.createdAt));
  const payments = await db.select({ payment: paymentsTable, invoiceNumber: invoicesTable.invoiceNumber }).from(paymentsTable).innerJoin(invoicesTable, eq(paymentsTable.invoiceId, invoicesTable.id)).where(eq(invoicesTable.companyId, company.id)).orderBy(desc(paymentsTable.createdAt));
  res.json(GetCompanyResponse.parse({
    id: company.id, name: company.name, contactPerson: company.contactPerson, phone: company.phone, email: company.email, address: company.address, notes: company.notes, status: company.status, outstanding: invoices.reduce((sum, invoice) => sum + money(invoice.grandTotal) - money(invoice.paid), 0), createdAt: dateTime(company.createdAt),
    jobs: await Promise.all(jobs.map(jobView)),
    invoices: invoices.map((invoice) => ({ id: invoice.id, invoiceNumber: invoice.invoiceNumber, companyId: invoice.companyId, companyName: company.name, issueDate: invoice.issueDate, dueDate: invoice.dueDate, subtotal: money(invoice.subtotal), discount: money(invoice.discount), tax: money(invoice.tax), grandTotal: money(invoice.grandTotal), paid: money(invoice.paid), due: money(invoice.grandTotal) - money(invoice.paid), status: invoice.status })),
    payments: payments.map(({ payment, invoiceNumber }) => ({ id: payment.id, invoiceId: payment.invoiceId, invoiceNumber, companyName: company.name, amount: money(payment.amount), method: payment.method, referenceNumber: payment.referenceNumber, date: payment.date, receivedBy: payment.receivedBy, notes: payment.notes, createdAt: dateTime(payment.createdAt) })),
  }));
});

router.patch("/companies/:id", async (req, res): Promise<void> => {
  const params = UpdateCompanyParams.safeParse(req.params);
  const parsed = UpdateCompanyBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [company] = await db.update(companiesTable).set(parsed.data).where(eq(companiesTable.id, params.data.id)).returning();
  if (!company) {
    res.status(404).json({ error: "Company not found" });
    return;
  }
  res.json(UpdateCompanyResponse.parse({ ...company, outstanding: 0, createdAt: dateTime(company.createdAt) }));
});

router.get("/billing/summary", async (_req, res): Promise<void> => {
  const invoices = await db.select().from(invoicesTable);
  const totalSales = invoices.reduce((sum, invoice) => sum + money(invoice.grandTotal), 0);
  const totalReceived = invoices.reduce((sum, invoice) => sum + money(invoice.paid), 0);
  const overdue = invoices.filter((invoice) => invoice.status === "OVERDUE");
  res.json(GetBillingSummaryResponse.parse({
    totalSales,
    totalReceived,
    totalReceivable: totalSales - totalReceived,
    overdueReceivable: overdue.reduce((sum, invoice) => sum + money(invoice.grandTotal) - money(invoice.paid), 0),
    currentMonthRevenue: totalSales,
    overdueInvoices: overdue.length,
  }));
});

router.get("/invoices", async (req, res): Promise<void> => {
  const params = ListInvoicesQueryParams.safeParse(req.query);
  const page = params.success ? params.data.page : 1;
  const pageSize = params.success ? params.data.pageSize : 20;
  const status = params.success ? params.data.status : undefined;
  const rows = await db.select({ invoice: invoicesTable, companyName: companiesTable.name }).from(invoicesTable).innerJoin(companiesTable, eq(invoicesTable.companyId, companiesTable.id)).where(status ? eq(invoicesTable.status, status) : undefined).orderBy(desc(invoicesTable.createdAt)).limit(pageSize).offset((page - 1) * pageSize);
  const total = await db.select({ value: count() }).from(invoicesTable).where(status ? eq(invoicesTable.status, status) : undefined);
  res.json(ListInvoicesResponse.parse({ items: rows.map(({ invoice, companyName }) => ({ id: invoice.id, invoiceNumber: invoice.invoiceNumber, companyId: invoice.companyId, companyName, issueDate: invoice.issueDate, dueDate: invoice.dueDate, subtotal: money(invoice.subtotal), discount: money(invoice.discount), tax: money(invoice.tax), grandTotal: money(invoice.grandTotal), paid: money(invoice.paid), due: money(invoice.grandTotal) - money(invoice.paid), status: invoice.status })), pagination: pageData(page, pageSize, Number(total[0]?.value ?? 0)) }));
});

router.post("/invoices", async (req, res): Promise<void> => {
  const parsed = CreateInvoiceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const company = await companyName(parsed.data.companyId);
  const [sequence] = await db.select({ value: count() }).from(invoicesTable);
  const subtotal = parsed.data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discount = parsed.data.discount ?? 0;
  const tax = parsed.data.tax ?? 0;
  const [invoice] = await db.insert(invoicesTable).values({ invoiceNumber: `INV-${today().replaceAll("-", "").slice(2)}-${String(Number(sequence.value) + 1).padStart(4, "0")}`, companyId: parsed.data.companyId, issueDate: today(), dueDate: calendarDate(parsed.data.dueDate), subtotal: subtotal.toFixed(2), discount: discount.toFixed(2), tax: tax.toFixed(2), grandTotal: (subtotal - discount + tax).toFixed(2) }).returning();
  await db.insert(invoiceItemsTable).values(parsed.data.items.map((item) => ({ invoiceId: invoice.id, description: item.description, quantity: item.quantity, unitPrice: item.unitPrice.toFixed(2), lineTotal: (item.quantity * item.unitPrice).toFixed(2) })));
  res.status(201).json(CreateInvoiceResponse.parse({ id: invoice.id, invoiceNumber: invoice.invoiceNumber, companyId: invoice.companyId, companyName: company, issueDate: invoice.issueDate, dueDate: invoice.dueDate, subtotal, discount, tax, grandTotal: subtotal - discount + tax, paid: 0, due: subtotal - discount + tax, status: invoice.status }));
});

router.get("/payments", async (req, res): Promise<void> => {
  const params = ListPaymentsQueryParams.safeParse(req.query);
  const page = params.success ? params.data.page : 1;
  const pageSize = params.success ? params.data.pageSize : 20;
  const rows = await db.select({ payment: paymentsTable, invoiceNumber: invoicesTable.invoiceNumber, companyName: companiesTable.name }).from(paymentsTable).innerJoin(invoicesTable, eq(paymentsTable.invoiceId, invoicesTable.id)).innerJoin(companiesTable, eq(invoicesTable.companyId, companiesTable.id)).orderBy(desc(paymentsTable.createdAt)).limit(pageSize).offset((page - 1) * pageSize);
  const total = await db.select({ value: count() }).from(paymentsTable);
  res.json(ListPaymentsResponse.parse({ items: rows.map(({ payment, invoiceNumber, companyName }) => ({ id: payment.id, invoiceId: payment.invoiceId, invoiceNumber, companyName, amount: money(payment.amount), method: payment.method, referenceNumber: payment.referenceNumber, date: payment.date, receivedBy: payment.receivedBy, notes: payment.notes, createdAt: dateTime(payment.createdAt) })), pagination: pageData(page, pageSize, Number(total[0]?.value ?? 0)) }));
});

router.post("/payments", async (req, res): Promise<void> => {
  const parsed = ReceivePaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const actor = await getActor(req);
  const [invoice] = await db.select().from(invoicesTable).where(eq(invoicesTable.id, parsed.data.invoiceId)).limit(1);
  if (!invoice) {
    res.status(400).json({ error: "Invoice not found" });
    return;
  }
  const amount = money(parsed.data.amount);
  const due = money(invoice.grandTotal) - money(invoice.paid);
  if (amount > due) {
    res.status(400).json({ error: "Payment cannot exceed outstanding balance" });
    return;
  }
  const [payment] = await db.transaction(async (tx) => {
    const [created] = await tx.insert(paymentsTable).values({ ...parsed.data, date: calendarDate(parsed.data.date), amount: amount.toFixed(2), receivedBy: actor.name }).returning();
    await tx.update(invoicesTable).set({ paid: (money(invoice.paid) + amount).toFixed(2), status: money(invoice.paid) + amount >= money(invoice.grandTotal) ? "PAID" : "PARTIAL" }).where(eq(invoicesTable.id, invoice.id));
    await tx.insert(auditLogsTable).values({ userId: actor.id, userName: actor.name, action: "PAYMENT_RECEIVED", entity: "PAYMENT", entityId: created.id, newValue: amount.toFixed(2) });
    return [created];
  });
  const company = await companyName(invoice.companyId);
  res.status(201).json(ReceivePaymentResponse.parse({ id: payment.id, invoiceId: payment.invoiceId, invoiceNumber: invoice.invoiceNumber, companyName: company, amount, method: payment.method, referenceNumber: payment.referenceNumber, date: payment.date, receivedBy: payment.receivedBy, notes: payment.notes, createdAt: dateTime(payment.createdAt) }));
});

router.get("/accounting/summary", async (_req, res): Promise<void> => {
  const entries = await db.select().from(ledgerEntriesTable);
  const income = entries.filter((entry) => entry.type === "INCOME").reduce((sum, entry) => sum + money(entry.amount), 0);
  const expense = entries.filter((entry) => entry.type === "EXPENSE").reduce((sum, entry) => sum + money(entry.amount), 0);
  res.json(GetAccountingSummaryResponse.parse({ cashBalance: income - expense, todaysIncome: 0, todaysExpense: 0, monthlyIncome: income, monthlyExpense: expense, netCashFlow: income - expense, pendingAdvances: 0, pendingVouchers: 0 }));
});

router.get("/ledger", async (req, res): Promise<void> => {
  const params = ListLedgerEntriesQueryParams.safeParse(req.query);
  const page = params.success ? params.data.page : 1;
  const pageSize = params.success ? params.data.pageSize : 20;
  const rows = await db.select().from(ledgerEntriesTable).orderBy(desc(ledgerEntriesTable.createdAt)).limit(pageSize).offset((page - 1) * pageSize);
  const total = await db.select({ value: count() }).from(ledgerEntriesTable);
  const all = await db.select().from(ledgerEntriesTable);
  const balance = all.reduce((sum, entry) => sum + (entry.type === "INCOME" ? money(entry.amount) : -money(entry.amount)), 0);
  res.json(ListLedgerEntriesResponse.parse({ items: rows.map((entry) => ({ ...entry, amount: money(entry.amount), createdAt: dateTime(entry.createdAt) })), pagination: pageData(page, pageSize, Number(total[0]?.value ?? 0)), balance }));
});

router.post("/ledger", async (req, res): Promise<void> => {
  const parsed = CreateLedgerEntryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const actor = await getActor(req);
  const [entry] = await db.insert(ledgerEntriesTable).values({ ...parsed.data, date: calendarDate(parsed.data.date), amount: parsed.data.amount.toFixed(2), createdBy: actor.name }).returning();
  await db.insert(auditLogsTable).values({ userId: actor.id, userName: actor.name, action: "LEDGER_CREATED", entity: "LEDGER", entityId: entry.id, newValue: entry.amount });
  res.status(201).json(CreateLedgerEntryResponse.parse({ ...entry, amount: money(entry.amount), createdAt: dateTime(entry.createdAt) }));
});

router.get("/users", async (req, res): Promise<void> => {
  const params = ListUsersQueryParams.safeParse(req.query);
  const page = params.success ? params.data.page : 1;
  const pageSize = params.success ? params.data.pageSize : 20;
  const search = params.success ? params.data.search : undefined;
  const filter = search ? or(ilike(usersTable.name, `%${search}%`), ilike(usersTable.email, `%${search}%`)) : undefined;
  const rows = await db.select().from(usersTable).where(filter).orderBy(asc(usersTable.name)).limit(pageSize).offset((page - 1) * pageSize);
  const total = await db.select({ value: count() }).from(usersTable).where(filter);
  res.json(ListUsersResponse.parse({ items: rows.map((user) => ({ id: user.id, name: user.name, employeeId: user.employeeId, email: user.email, phone: user.phone, department: user.department, role: user.role, active: user.active, permissions: user.permissions, lastLogin: user.lastLogin?.toISOString() ?? null, createdAt: dateTime(user.createdAt) })), pagination: pageData(page, pageSize, Number(total[0]?.value ?? 0)) }));
});

router.post("/users", async (req, res): Promise<void> => {
  const parsed = CreateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const actor = await getActor(req);
  const { temporaryPassword, ...userData } = parsed.data;
  const [user] = await db.insert(usersTable).values({
    ...userData,
    username: parsed.data.username.toLowerCase(),
    passwordHash: await hashPassword(temporaryPassword),
    mustChangePassword: true,
    role: parsed.data.role,
  }).returning();
  await db.insert(auditLogsTable).values({ userId: actor.id, userName: actor.name, action: "USER_CREATED", entity: "USER", entityId: user.id, newValue: user.email });
  res.status(201).json(CreateUserResponse.parse({ ...user, passwordHash: undefined, lastLogin: null, createdAt: dateTime(user.createdAt) }));
});

router.get("/notifications", async (req, res): Promise<void> => {
  const actor = await getActor(req);
  const rows = await db.select().from(notificationsTable).where(or(eq(notificationsTable.recipientId, actor.id), sql`${notificationsTable.recipientId} is null`)).orderBy(desc(notificationsTable.createdAt)).limit(25);
  res.json(ListNotificationsResponse.parse(rows.map((notification) => ({ ...notification, createdAt: dateTime(notification.createdAt) }))));
});

router.post("/notifications/:id/read", async (req, res): Promise<void> => {
  const params = MarkNotificationReadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [notification] = await db.update(notificationsTable).set({ read: true }).where(eq(notificationsTable.id, params.data.id)).returning();
  if (!notification) {
    res.status(404).json({ error: "Notification not found" });
    return;
  }
  res.json(MarkNotificationReadResponse.parse({ ...notification, createdAt: dateTime(notification.createdAt) }));
});

router.get("/audit-logs", async (req, res): Promise<void> => {
  const params = ListAuditLogsQueryParams.safeParse(req.query);
  const page = params.success ? params.data.page : 1;
  const pageSize = params.success ? params.data.pageSize : 20;
  const search = params.success ? params.data.search : undefined;
  const filter = search ? or(ilike(auditLogsTable.action, `%${search}%`), ilike(auditLogsTable.entity, `%${search}%`), ilike(auditLogsTable.userName, `%${search}%`)) : undefined;
  const rows = await db.select().from(auditLogsTable).where(filter).orderBy(desc(auditLogsTable.createdAt)).limit(pageSize).offset((page - 1) * pageSize);
  const total = await db.select({ value: count() }).from(auditLogsTable).where(filter);
  res.json(ListAuditLogsResponse.parse({ items: rows.map((log) => ({ ...log, createdAt: dateTime(log.createdAt) })), pagination: pageData(page, pageSize, Number(total[0]?.value ?? 0)) }));
});

router.get("/settings/catalogs", async (_req, res): Promise<void> => {
  const [departments, printingSections] = await Promise.all([
    db.select().from(departmentsTable).where(eq(departmentsTable.active, true)).orderBy(asc(departmentsTable.name)),
    db.select().from(printingSectionsTable).where(eq(printingSectionsTable.active, true)).orderBy(asc(printingSectionsTable.name)),
  ]);
  res.json(GetSettingsCatalogsResponse.parse({ departments, printingSections, jobStatuses: ["DRAFT", "RECEIVED", "IN_DESIGN", "SAMPLE_PENDING", "SAMPLE_APPROVAL", "IN_PRODUCTION", "QC", "READY", "DELIVERED", "CANCELLED"] }));
});

export default router;