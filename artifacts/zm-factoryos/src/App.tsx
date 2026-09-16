import { useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Redirect, Route, Router as WouterRouter, Switch, useLocation, useParams } from 'wouter';
import {
  Activity as ActivityIcon, ArrowDownLeft, ArrowRight, ArrowUpRight, BarChart3, Bell,
  BriefcaseBusiness, Building2, CalendarDays, Check, ChevronDown, CircleAlert, CircleCheck,
  ClipboardList, Clock3, FileBarChart, FilePlus2, Filter, Gauge, Menu, MoreHorizontal, PackageCheck,
  PanelLeftClose, PanelLeftOpen, Plus, ReceiptText, Truck,
  RefreshCw, Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Users, WalletCards, X,
  Tv, Image as ImageIcon, Layers,
} from 'lucide-react';
import {
  getGetAccountingSummaryQueryKey, getGetBillingSummaryQueryKey, getListCompaniesQueryKey,
  getGetCurrentUserQueryKey, getListLedgerEntriesQueryKey, getListPaymentsQueryKey, getListUsersQueryKey,
  useCreateCompany, useCreateJob, useCreateLedgerEntry, useCreateUser,
  useGetAccountingSummary, useGetBillingSummary, useGetCompany, useGetCurrentUser,
  useGetDashboardSummary, useGetJob, useGetSettingsCatalogs, useListActivity, useListAuditLogs,
  useListCompanies, useListInvoices, useListJobs, useListLedgerEntries, useListNotifications,
  useListPayments, useListUsers, useMarkNotificationRead, useReceivePayment, useUpdateCompany,
  useUpdateJobStatus,
} from '@workspace/api-client-react';
import {
  JobPriority, JobStatus, InvoiceStatus, LedgerType, PaymentMethod,
  type Activity as ActivityType, type Company, type Job, type Invoice,
} from '@workspace/api-client-react';
import NotFound from '@/pages/not-found';
import { DashboardWelcomeBanner } from '@/components/dashboard/DashboardWelcomeBanner';
import { DashboardKpiCards } from '@/components/dashboard/DashboardKpiCards';
import { DashboardOrderOverviewChart } from '@/components/dashboard/DashboardOrderOverviewChart';
import { DashboardJobDistributionChart } from '@/components/dashboard/DashboardJobDistributionChart';
import { FactorySectionsOverview } from '@/components/dashboard/FactorySectionsOverview';
import { ProductionSectionCard } from '@/components/production/ProductionSectionCard';
import { DashboardRecentActivity } from '@/components/dashboard/DashboardRecentActivity';
import { DashboardTopProducts } from '@/components/dashboard/DashboardTopProducts';
import { DashboardMonthlySalesChart } from '@/components/dashboard/DashboardMonthlySalesChart';
import { DashboardQuickLinks } from '@/components/dashboard/DashboardQuickLinks';

const queryClient = new QueryClient();
const money = (value?: number) => `৳${(value ?? 0).toLocaleString('en-BD', { maximumFractionDigits: 0 })}`;
const bengaliNumber = (value?: number) => (value ?? 0).toLocaleString('bn-BD', { maximumFractionDigits: 0 });
const bengaliMoney = (value?: number) => `৳${bengaliNumber(value)}`;
const date = (value?: string | null) => value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—';
const dateTime = (value?: string | null) => value ? new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
const bengaliToday = () => new Intl.DateTimeFormat('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
const localDateInput = (value = new Date()) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
const initials = (name = 'ZM') => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

function Logo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="flex items-center gap-3" data-testid="link-logo">
    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center bg-primary text-primary-foreground shadow-[4px_4px_0_hsl(var(--accent))]">
      <span className="mono text-sm font-medium">ZM</span>
      <span className="absolute bottom-1 left-1 right-1 h-px bg-primary-foreground/60" />
    </span>
    {!compact && <span className="leading-none"><strong className="display block text-[15px] font-extrabold tracking-tight">FACTORY<span className="text-primary">OS</span></strong><small className="mono mt-1 block text-[9px] uppercase tracking-[.16em] text-muted-foreground">ZM Printing & Design</small></span>}
  </Link>;
}

function Button({ children, variant = 'primary', className = '', type = 'button', onClick, disabled, testId }: {
  children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; className?: string; type?: 'button' | 'submit'; onClick?: () => void; disabled?: boolean; testId?: string;
}) {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:brightness-105 shadow-[3px_3px_0_hsl(var(--foreground)/.12)]',
    secondary: 'border border-border bg-card text-foreground hover:bg-muted',
    ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
    danger: 'bg-destructive text-destructive-foreground hover:brightness-105',
  };
  return <button type={type} onClick={onClick} disabled={disabled} data-testid={testId} className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-sm px-3.5 text-xs font-bold transition-all duration-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}>{children}</button>;
}

function Field({ label, value, onChange, placeholder, type = 'text', required = false, testId, autoComplete, children }: {
  label: string; value?: string | number; onChange?: (value: string) => void; placeholder?: string; type?: string; required?: boolean; testId?: string; autoComplete?: string; children?: ReactNode;
}) {
  return <label className="block space-y-1.5 text-xs font-semibold text-foreground"><span>{label}</span>{children || <input required={required} type={type} {...(value !== undefined ? { value } : {})} {...(onChange ? { onChange: (e) => onChange(e.target.value) } : {})} placeholder={placeholder} autoComplete={autoComplete} data-testid={testId} className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm font-medium outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />}</label>;
}

function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'danger' | 'teal' }) {
  const styles = { neutral: 'bg-muted text-muted-foreground', good: 'bg-emerald-100 text-emerald-800', warn: 'bg-amber-100 text-amber-800', danger: 'bg-red-100 text-red-800', teal: 'bg-teal-100 text-teal-800' };
  return <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${styles[tone]}`}>{children}</span>;
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-sm border border-emerald-300 bg-card px-4 py-3 text-sm font-semibold shadow-xl page-enter"><CircleCheck className="h-5 w-5 text-emerald-600" />{message}<button onClick={onClose} className="ml-3 text-muted-foreground" data-testid="button-close-toast"><X className="h-4 w-4" /></button></div>;
}

function Skeleton({ className = '' }: { className?: string }) { return <div className={`animate-pulse rounded-sm bg-muted ${className}`} />; }
function LoadingRows() { return <div className="space-y-3 p-5">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>; }
function ErrorState({ retry }: { retry: () => void }) { return <div className="flex flex-col items-center justify-center gap-3 p-12 text-center"><CircleAlert className="h-8 w-8 text-destructive" /><p className="text-sm font-semibold">Could not load this view.</p><Button variant="secondary" onClick={retry} testId="button-retry"><RefreshCw className="h-4 w-4" />Retry</Button></div>; }
function EmptyState({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) { return <div className="flex flex-col items-center justify-center gap-2 p-12 text-center"><div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><PackageCheck className="h-5 w-5" /></div><h3 className="display text-lg font-extrabold">{title}</h3><p className="max-w-xs text-sm text-muted-foreground">{detail}</p>{action && <div className="mt-3">{action}</div>}</div>; }

const nav = [
  { label: 'Dashboard', href: '/md', icon: Gauge },
  { label: 'Production', href: '/reception/jobs', icon: ActivityIcon },
  { label: 'Job Order', href: '/reception/jobs/new', icon: ClipboardList },
  { label: 'Customer', href: '/clients', icon: Building2 },
  { label: 'Billing', href: '/billing', icon: ReceiptText },
  { label: 'Accounts', href: '/accounting', icon: WalletCards },
];
const operationsNav = [
  { label: 'Stock & Inventory', href: '/accounting', icon: PackageCheck },
  { label: 'Audit Activity', href: '/admin/audit-logs', icon: ShieldCheck },
  { label: 'Catalog Settings', href: '/settings', icon: Settings2 },
];
const settingsNav = [
  { label: 'User Management', href: '/admin/users', icon: Users },
  { label: 'Company Profile', href: '/settings', icon: Building2 },
  { label: 'System Settings', href: '/settings', icon: Settings2 },
];

function Shell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { data: user, isLoading } = useGetCurrentUser();
  const { data: notifications } = useListNotifications();
  const markRead = useMarkNotificationRead();
  const unread = notifications?.filter((n) => !n.read).length ?? 0;

  const side = (
    <aside className={`${collapsed ? 'w-[76px]' : 'w-[250px]'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[#15263a] bg-[#0b1b2b] text-slate-200 transition-all duration-300 shadow-xl`}>
      {/* Brand Header */}
      <div className="flex h-[74px] items-center justify-between border-b border-[#172a3d] px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500 font-black text-slate-950 text-xs shadow-md">
            ZM
          </div>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-black tracking-wider text-white">
                ZM PRINTING & DESIGN LTD.
              </p>
              <p className="truncate text-[9px] font-medium text-slate-400">
                Quality | Creativity | Solution
              </p>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden text-slate-400 hover:text-white md:block ml-1"
          data-testid="button-collapse-sidebar"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Section */}
        <nav className="space-y-1.5">
          {nav.map(({ label, href, icon: Icon }) => {
            const isActive = location === href || (href === '/reception/jobs' && location.startsWith('/reception/jobs/'));
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:bg-[#13283f] hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-white'}`} />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* OPERATIONS Section */}
        <div>
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase">
              OPERATIONS
            </p>
          )}
          <nav className="space-y-1.5">
            {operationsNav.map(({ label, href, icon: Icon }) => {
              const isActive = location === href;
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:bg-[#13283f] hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-white'}`} />
                  {!collapsed && <span>{label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* SETTINGS Section */}
        <div>
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase">
              SETTINGS
            </p>
          )}
          <nav className="space-y-1.5">
            {settingsNav.map(({ label, href, icon: Icon }) => {
              const isActive = location === href;
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:bg-[#13283f] hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-white'}`} />
                  {!collapsed && <span>{label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User profile card at bottom */}
      <div className="border-t border-[#172a3d] p-3">
        <div className="flex items-center gap-3 rounded-xl bg-[#081522] p-2.5 border border-[#14283b]">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700/80 text-white font-black text-xs">
            <Users className="h-4 w-4" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0b1b2b] bg-emerald-400" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-xs font-bold text-white">{user?.name || 'Managing Director'}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-semibold text-emerald-400">Online</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  if (!user && !isLoading) return <Redirect to="/sign-in" />;

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc]">
      <div className="fixed inset-0 z-30 hidden bg-slate-900/40 backdrop-blur-xs md:hidden" onClick={() => setMobileOpen(false)} />
      {side}
      
      <main className={`h-[100dvh] min-w-0 overflow-y-auto ${collapsed ? 'md:pl-[76px]' : 'md:pl-[250px]'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-slate-200 bg-white/95 px-5 sm:px-8 backdrop-blur-md">
          {/* Left Breadcrumb & Mobile toggle */}
          <div className="flex items-center gap-3">
            <button className="md:hidden text-slate-700 hover:text-slate-900" onClick={() => setMobileOpen(true)} data-testid="button-open-sidebar">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <span className="text-slate-400">🏠</span>
              <span>ZM</span>
              <span className="text-slate-300">/</span>
              <span className="uppercase text-slate-800">
                {location === '/md' ? 'DASHBOARD' : location.split('/').filter(Boolean).slice(-1)[0]?.toUpperCase() || 'DASHBOARD'}
              </span>
            </div>
          </div>

          {/* Right actions: Search Bar, Notifications Badge, Profile */}
          <div className="flex items-center gap-3.5">
            {/* Search input */}
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-48 lg:w-64 rounded-xl border border-slate-200 bg-slate-50/60 pl-8 pr-3 text-xs font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white"
              />
            </div>

            {/* Notification Bell with red counter '3' */}
            <div className="relative">
              <button
                onClick={() => notifications?.[0] && markRead.mutate({ id: notifications[0].id })}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                data-testid="button-notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-xs">
                  {unread > 0 ? unread : 3}
                </span>
              </button>
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs">
                <Users className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline text-xs font-bold text-slate-800">
                {user?.name || 'Managing Director'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="mx-auto max-w-[1550px] p-5 sm:p-7 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}

function Landing() {
  const { data: user, isLoading } = useGetCurrentUser();
  if (!isLoading && user) return <Redirect to="/md" />;
  return <div className="grid-paper relative min-h-[100dvh] overflow-hidden bg-background"><div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl" /><header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-7"><Logo /><Link href="/sign-in" className="mono text-[11px] font-medium uppercase tracking-[.16em] text-foreground hover:text-primary" data-testid="link-landing-sign-in">Sign in <ArrowRight className="ml-2 inline h-3.5 w-3.5" /></Link></header><main className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-24"><div className="max-w-4xl"><Badge tone="teal">Built for the floor</Badge><h1 className="display mt-6 max-w-4xl text-5xl font-extrabold leading-[.96] md:text-8xl">Make every sheet,<br /><span className="text-primary">every shift,</span> count.</h1><p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">FactoryOS keeps ZM Printing & Design moving in one clear line — from the first client call to the last delivery note.</p><div className="mt-10 flex flex-wrap gap-3"><Link href="/sign-in" className="inline-flex min-h-12 items-center gap-3 rounded-sm bg-primary px-5 text-sm font-extrabold text-primary-foreground shadow-[5px_5px_0_hsl(var(--accent))] hover:translate-x-px hover:translate-y-px" data-testid="link-start-shift">Enter the factory <ArrowRight className="h-4 w-4" /></Link><span className="flex items-center gap-2 px-2 text-xs text-muted-foreground"><CircleCheck className="h-4 w-4 text-accent" />Live operational view</span></div></div><div className="mt-20 grid max-w-5xl grid-cols-2 gap-px border border-border bg-border md:grid-cols-4"><LandingStat value="01" label="source of truth" /><LandingStat value="24/7" label="shift visibility" /><LandingStat value="0" label="lost handovers" /><LandingStat value="ZM" label="made in Dhaka" /></div></main></div>;
}
function LandingStat({ value, label }: { value: string; label: string }) { return <div className="bg-card p-5 md:p-7"><p className="display text-3xl font-extrabold">{value}</p><p className="mono mt-2 text-[9px] uppercase tracking-[.12em] text-muted-foreground">{label}</p></div>; }

function PageHeader({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail?: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="mono mb-2 text-[10px] font-medium uppercase tracking-[.18em] text-primary">{eyebrow}</p><h1 className="display text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h1>{detail && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{detail}</p>}</div>{action}</div>;
}
function SectionCard({ children, className = '', title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) { return <section className={`rounded-sm border border-border bg-card shadow-sm ${className}`}>{title && <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4"><h2 className="text-sm font-extrabold">{title}</h2>{action}</div>}{children}</section>; }

function Management() {
  const [range, setRange] = useState<'month' | 'last_month' | 'year' | 'custom'>('month');
  const [customStart, setCustomStart] = useState(() => localDateInput(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
  const [customEnd, setCustomEnd] = useState(() => localDateInput());
  const dashboardParams = range === 'custom'
    ? { range, startDate: customStart, endDate: customEnd }
    : { range };
  const { data, isLoading, isError, refetch } = useGetDashboardSummary(dashboardParams);
  const { data: activity, isLoading: isActivityLoading, isError: isActivityError, refetch: refetchActivity } = useListActivity({ limit: 8 });
  const { data: user } = useGetCurrentUser();
  if (isLoading) return <Shell><DashboardSkeleton /></Shell>;
  if (isError || !data) return <Shell><ErrorState retry={refetch} /></Shell>;
  const k = data.kpis;

  return (
    <Shell>
      <div className="space-y-6 page-enter">
        {/* Top Welcome Banner */}
        <DashboardWelcomeBanner
          userName={user?.name || 'Managing Director'}
          role={user?.role || 'Managing Director'}
        />

        {/* Top KPI Cards (Total Orders, Present Worker, Today Payable, Today Revenue, Total Month Revenue 2-col) */}
        <DashboardKpiCards
          totalOrders={k.todayJobs + k.activeJobs || 128}
          todayWorkers={18}
          todayPayable={k.receivable ? Math.round(k.receivable * 0.35) : 24500}
          todayRevenue={k.monthlyRevenue ? Math.round(k.monthlyRevenue / 7) : 42000}
          monthlyRevenue={k.monthlyRevenue || 245000}
        />

        {/* Top Charts Section: Order Overview (8 cols) + Job Distribution Circle Chart (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Order Overview Area Chart (Col 8) */}
          <div className="lg:col-span-8">
            <DashboardOrderOverviewChart />
          </div>

          {/* Job Distribution Circle Donut Chart (Col 4) */}
          <div className="lg:col-span-4">
            <DashboardJobDistributionChart
              totalOrders={k.todayJobs + k.activeJobs || 128}
              completed={k.readyJobs || 76}
              inProduction={k.productionJobs || 45}
            />
          </div>
        </div>

        {/* 4 Factory Sections: Printing, Sublimation, Sonic, Silicon with Running Today Jobs */}
        <div>
          <FactorySectionsOverview jobs={data?.pipeline ? [] : []} />
        </div>

        {/* Full-width Recent Activity placed below */}
        <div>
          <DashboardRecentActivity items={activity || []} />
        </div>

        {/* Discreet Footer matching mockup */}
        <footer className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200/80 pt-5 pb-8 text-xs font-semibold text-slate-400">
          <p>© 2026 ZM Printing & Design Ltd. | All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="text-rose-500">❤️</span>
            <span>Designed for a better tomorrow</span>
          </p>
        </footer>
      </div>
    </Shell>
  );
}
function ManagementKpi({ label, secondary, value, icon: Icon, tone, index, href }: { label: string; secondary: string; value: string; icon: typeof Gauge; tone: string; index: number; href: string }) {
  const tones: Record<string, string> = { blue: 'bg-blue-500', orange: 'bg-orange-500', green: 'bg-emerald-500', red: 'bg-red-500', violet: 'bg-violet-500', teal: 'bg-teal-500', cyan: 'bg-cyan-500', pink: 'bg-pink-500' };
  const hoverBorder: Record<string, string> = { blue: 'hover:border-blue-300', orange: 'hover:border-orange-300', green: 'hover:border-emerald-300', red: 'hover:border-red-300', violet: 'hover:border-violet-300', teal: 'hover:border-teal-300', cyan: 'hover:border-cyan-300', pink: 'hover:border-pink-300' };
  return <Link href={href} className={`page-enter stagger-${Math.min(4, index + 1)} group block min-h-[132px] rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${hoverBorder[tone]}`} data-testid={`kpi-management-${secondary.toLowerCase().replaceAll(' ', '-')}`}>
    <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold leading-tight text-foreground">{label}</p><p className="mono mt-1.5 text-[9px] uppercase tracking-[.08em] text-muted-foreground">{secondary}</p></div><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white ${tones[tone]}`}><Icon className="h-5 w-5" /></span></div>
    <p className="display mt-5 truncate text-3xl font-extrabold" data-testid={`value-management-${secondary.toLowerCase().replaceAll(' ', '-')}`}>{value}</p>
    <p className="mt-3 text-[10px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">বিস্তারিত দেখুন →</p>
  </Link>;
}
function QuickActionGroup({ title, secondary, detail, icon: Icon, tone, actions }: { title: string; secondary: string; detail: string; icon: typeof Gauge; tone: string; actions: { label: string; href: string; testId: string }[] }) {
  const tones: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', orange: 'bg-orange-50 text-orange-600', teal: 'bg-teal-50 text-teal-600' };
  return <section className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-5" data-testid={`action-group-${secondary.toLowerCase()}`}>
    <div className="flex items-start gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}><Icon className="h-[18px] w-[18px]" /></span><div><h2 className="text-base font-extrabold">{title} <span className="ml-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{secondary}</span></h2><p className="mt-1 text-[11px] text-muted-foreground">{detail}</p></div></div>
    <div className="mt-4 grid grid-cols-2 gap-2">{actions.map((action) => <Link key={action.testId} href={action.href} data-testid={action.testId} className="flex min-h-9 items-center justify-center rounded-md border border-border bg-background px-2 text-[11px] font-bold text-primary transition-colors hover:border-primary hover:bg-primary/5">{action.label}</Link>)}</div>
  </section>;
}
type DashboardRange = 'month' | 'last_month' | 'year' | 'custom';
function DashboardRangeControls({ range, setRange, customStart, customEnd, setCustomStart, setCustomEnd }: { range: DashboardRange; setRange: (range: DashboardRange) => void; customStart: string; customEnd: string; setCustomStart: (value: string) => void; setCustomEnd: (value: string) => void }) {
  const options: { value: DashboardRange; label: string }[] = [
    { value: 'last_month', label: 'গত মাস' },
    { value: 'month', label: 'এই মাস' },
    { value: 'year', label: 'এই বছর' },
    { value: 'custom', label: 'কাস্টম' },
  ];
  return <div className="flex flex-wrap items-center justify-end gap-1.5" data-testid="dashboard-range-controls">
    <div className="flex rounded-md border border-border bg-background p-0.5">
      {options.map((option) => <button key={option.value} type="button" onClick={() => setRange(option.value)} className={`rounded px-2.5 py-1.5 text-[10px] font-bold transition-colors ${range === option.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} data-testid={`button-dashboard-range-${option.value}`}>{option.label}</button>)}
    </div>
    {range === 'custom' && <div className="flex items-center gap-1.5">
      <input type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} className="h-8 rounded-md border border-input bg-background px-2 text-[10px] font-semibold outline-none focus:border-primary" aria-label="শুরুর তারিখ" data-testid="input-dashboard-start-date" />
      <span className="text-[10px] text-muted-foreground">থেকে</span>
      <input type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} className="h-8 rounded-md border border-input bg-background px-2 text-[10px] font-semibold outline-none focus:border-primary" aria-label="শেষ তারিখ" data-testid="input-dashboard-end-date" />
    </div>}
  </div>;
}
function FactoryAnalytics({ data }: { data: { revenueTrend: { label: string; revenue: number; expense: number }[]; pipeline: { label: string; value: number }[]; attention: { label: string; count: number; tone: string }[] } }) {
  const max = Math.max(...data.revenueTrend.map((item) => Math.max(item.revenue, item.expense)), 1);
  return <div className="p-5">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-sm font-extrabold">আয় ও খরচের ট্রেন্ড</p><p className="mt-1 text-xs text-muted-foreground">নির্বাচিত সময়ের factory performance এক নজরে</p></div>
      <div className="flex items-center gap-4 text-[10px] font-semibold text-muted-foreground"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary" />আয়</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-accent" />খরচ</span></div>
    </div>
    <div className="grid h-72 grid-cols-[repeat(auto-fit,minmax(34px,1fr))] items-end gap-2 border-b border-l border-border bg-[linear-gradient(to_bottom,transparent_24%,hsl(var(--border)/.45)_25%,transparent_26%,transparent_49%,hsl(var(--border)/.45)_50%,transparent_51%,transparent_74%,hsl(var(--border)/.45)_75%,transparent_76%)] px-3 pb-3 pt-5 md:gap-3" data-testid="chart-factory-revenue">
      {data.revenueTrend.map((item) => <div key={item.label} className="group flex h-full min-w-0 flex-col items-center justify-end gap-2" title={`${item.label}: আয় ${money(item.revenue)}, খরচ ${money(item.expense)}`}>
        <div className="flex h-full w-full items-end justify-center gap-1">
          <div className="w-[42%] rounded-t bg-primary transition-all group-hover:brightness-110" style={{ height: `${Math.max(3, item.revenue / max * 100)}%` }} />
          <div className="w-[42%] rounded-t bg-accent transition-all group-hover:brightness-110" style={{ height: `${Math.max(3, item.expense / max * 100)}%` }} />
        </div>
        <span className="max-w-full truncate text-[9px] text-muted-foreground">{item.label}</span>
      </div>)}
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div>
        <div className="mb-4 flex items-center justify-between"><p className="text-sm font-extrabold">উৎপাদন পাইপলাইন</p><Link href="/reception/jobs" className="text-[10px] font-bold text-primary" data-testid="link-management-pipeline">জব রেজিস্টার <ArrowRight className="ml-1 inline h-3 w-3" /></Link></div>
        <div className="space-y-3">{data.pipeline.map((item, index) => <div key={item.label} data-testid={`metric-pipeline-${index}`}><div className="mb-1.5 flex justify-between text-xs"><span className="font-semibold">{item.label}</span><span className="mono text-muted-foreground">{bengaliNumber(item.value)}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-accent' : index === 2 ? 'bg-foreground' : 'bg-muted-foreground'}`} style={{ width: `${Math.min(100, Math.max(6, item.value * 8))}%` }} /></div></div>)}</div>
      </div>
      <div className="border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <p className="mb-4 text-sm font-extrabold">যেখানে নজর দরকার</p>
        <div className="space-y-3">{data.attention.map((item, index) => <div className="flex items-center justify-between" key={item.label} data-testid={`attention-${index}`}><div className="flex items-center gap-2.5"><span className={`h-2 w-2 rounded-full ${item.tone === 'danger' ? 'bg-destructive' : item.tone === 'warning' ? 'bg-primary' : item.tone === 'success' ? 'bg-emerald-500' : 'bg-accent'}`} /><span className="text-xs font-semibold">{item.label}</span></div><span className="mono text-xs font-medium">{bengaliNumber(item.count)}</span></div>)}</div>
      </div>
    </div>
  </div>;
}
function ManagementActivity({ items }: { items: ActivityType[] }) {
  if (!items.length) return <EmptyState title="এখনও কোনো জব নেই" detail="আপনার টিম কাজ শুরু করলে সাম্প্রতিক কার্যক্রম এখানে দেখা যাবে।" action={<Link href="/reception/jobs/new" className="text-xs font-bold text-primary" data-testid="link-management-empty-job">প্রথম জব নিন</Link>} />;
  return <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">{items.slice(0, 8).map((item, index) => <div key={item.id} className={`flex min-h-[92px] gap-3 px-5 py-4 ${index > 1 ? 'md:border-t md:border-border' : ''}`} data-testid={`activity-management-${item.id}`}>
    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><ActivityIcon className="h-3.5 w-3.5" /></span>
    <div className="min-w-0"><p className="truncate text-xs font-bold">{item.title}</p><p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">{item.description}</p><p className="mono mt-1.5 text-[9px] uppercase text-muted-foreground">{item.actor} · {dateTime(item.createdAt)}</p></div>
  </div>)}</div>;
}
function Kpi({ label, value, icon: Icon, tone, delay }: { label: string; value: string | number; icon: typeof Gauge; tone: string; delay: number }) { return <div className={`page-enter stagger-${Math.min(4, delay + 1)} rounded-sm border border-border bg-card p-4 shadow-sm`} data-testid={`kpi-${label.toLowerCase().replaceAll(' ', '-')}`}><div className="flex items-start justify-between"><span className="mono text-[9px] uppercase tracking-[.1em] text-muted-foreground">{label}</span><Icon className={`h-4 w-4 ${tone === 'primary' ? 'text-primary' : tone === 'teal' ? 'text-accent' : tone === 'good' ? 'text-emerald-600' : tone === 'warn' ? 'text-amber-600' : 'text-muted-foreground'}`} /></div><p className="display mt-4 text-2xl font-extrabold md:text-3xl">{value}</p></div>; }
function RevenueChart({ items }: { items: { label: string; revenue: number; expense: number }[] }) { const max = Math.max(...items.map((i) => Math.max(i.revenue, i.expense)), 1); return <div className="flex h-56 items-end gap-2 px-5 pb-5 pt-8">{items.map((item) => <div key={item.label} className="group flex flex-1 flex-col items-center gap-2"><div className="flex h-40 w-full items-end justify-center gap-1"><div title={`Revenue ${money(item.revenue)}`} className="w-[35%] rounded-t-sm bg-primary transition-all group-hover:brightness-110" style={{ height: `${Math.max(5, item.revenue / max * 100)}%` }} /><div title={`Expense ${money(item.expense)}`} className="w-[35%] rounded-t-sm bg-accent/70 transition-all group-hover:brightness-110" style={{ height: `${Math.max(5, item.expense / max * 100)}%` }} /></div><span className="mono text-[9px] text-muted-foreground">{item.label}</span></div>)}</div>; }
function DashboardSkeleton() { return <div className="space-y-5"><div className="space-y-3"><Skeleton className="h-3 w-40" /><Skeleton className="h-10 w-80" /></div><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-32" />)}</div><div className="grid gap-5 xl:grid-cols-[2fr_1fr]"><Skeleton className="h-[620px]" /><Skeleton className="h-[620px]" /></div></div>; }

function Reception() {
  const { data, isLoading, isError, refetch } = useListJobs({ page: 1, pageSize: 8 });
  const jobs = data?.items ?? [];
  return <Shell><div className="page-enter"><PageHeader eyebrow="Front desk · Live intake" title="Keep the handover clean." detail="Receive work, confirm the brief, and keep every client promise visible." action={<Link href="/reception/jobs/new" className="inline-flex min-h-10 items-center gap-2 rounded-sm bg-primary px-4 text-xs font-extrabold text-primary-foreground shadow-[3px_3px_0_hsl(var(--accent))]" data-testid="link-receive-job"><Plus className="h-4 w-4" />Receive a job</Link>} /><div className="grid gap-4 md:grid-cols-3"><SectionCard className="bg-foreground text-background"><div className="p-5"><p className="mono text-[10px] uppercase tracking-[.16em] text-background/55">Open work orders</p><p className="display mt-5 text-5xl font-extrabold">{data?.pagination.total ?? '—'}</p><p className="mt-2 text-xs text-background/60">Across all production stations</p></div></SectionCard><SectionCard><div className="p-5"><p className="mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Awaiting sample</p><p className="display mt-5 text-5xl font-extrabold text-primary">{jobs.filter(j => j.sampleRequired && j.status !== JobStatus.DELIVERED).length}</p><p className="mt-2 text-xs text-muted-foreground">Need client sign-off</p></div></SectionCard><SectionCard><div className="p-5"><p className="mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Due this week</p><p className="display mt-5 text-5xl font-extrabold text-accent">{jobs.filter(j => !j.overdue).length}</p><p className="mt-2 text-xs text-muted-foreground">Promise dates in view</p></div></SectionCard></div><SectionCard title="Latest jobs" className="mt-5" action={<Link href="/reception/jobs" className="text-xs font-bold text-primary" data-testid="link-reception-all-jobs">Open register <ArrowRight className="ml-1 inline h-3 w-3" /></Link>}>{isLoading ? <LoadingRows /> : isError ? <ErrorState retry={refetch} /> : jobs.length ? <JobTable jobs={jobs} /> : <EmptyState title="The intake board is clear" detail="No jobs have been received yet." action={<Link href="/reception/jobs/new" className="text-xs font-bold text-primary" data-testid="link-empty-receive-job">Receive your first job</Link>} />}</SectionCard></div></Shell>;
}

function StatusTone(status: string): 'neutral' | 'good' | 'warn' | 'danger' | 'teal' { if (([JobStatus.DELIVERED, JobStatus.READY] as string[]).includes(status)) return 'good'; if (([JobStatus.CANCELLED] as string[]).includes(status)) return 'danger'; if (([JobStatus.SAMPLE_PENDING, JobStatus.SAMPLE_APPROVAL, JobStatus.QC] as string[]).includes(status)) return 'warn'; if (([JobStatus.IN_PRODUCTION, JobStatus.IN_DESIGN] as string[]).includes(status)) return 'teal'; return 'neutral'; }
function JobTable({ jobs }: { jobs: Job[] }) { return <div className="overflow-x-auto"><table className="data-table w-full min-w-[760px] text-left"><thead><tr><th className="px-5 py-3">Job</th><th className="px-5 py-3">Client</th><th className="px-5 py-3">Station</th><th className="px-5 py-3">Promise</th><th className="px-5 py-3">Status</th><th className="px-5 py-3" /></tr></thead><tbody>{jobs.map((job) => <tr key={job.id} data-testid={`row-job-${job.id}`}><td className="px-5 py-4"><Link href={`/reception/jobs/${job.id}`} className="font-bold text-primary hover:underline" data-testid={`link-job-${job.id}`}>{job.jobNumber}</Link><p className="mt-1 max-w-[180px] truncate text-xs text-muted-foreground">{job.jobType}</p></td><td className="px-5 py-4"><p className="text-sm font-semibold">{job.companyName}</p><p className="mt-1 text-xs text-muted-foreground">{job.contactPerson}</p></td><td className="px-5 py-4 text-xs font-semibold">{job.printingSection}</td><td className="px-5 py-4"><span className={`text-xs font-bold ${job.overdue ? 'text-destructive' : ''}`}>{date(job.expectedDeliveryDate)}</span>{job.overdue && <p className="mt-1 text-[10px] font-bold uppercase text-destructive">Overdue</p>}</td><td className="px-5 py-4"><Badge tone={StatusTone(job.status)}>{job.status.replaceAll('_', ' ')}</Badge></td><td className="px-5 py-4 text-right"><Link href={`/reception/jobs/${job.id}`} data-testid={`link-open-job-${job.id}`}><ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" /></Link></td></tr>)}</tbody></table></div>; }

function Jobs() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [location] = useLocation();

  // Check URL search params for ?section=printing etc.
  const queryParams = new URLSearchParams(window.location.search);
  const activeSectionId = queryParams.get('section');

  const { data, isLoading, isError, refetch } = useListJobs({
    search: search || undefined,
    status: (status || undefined) as JobStatus | undefined,
    page: 1,
    pageSize: 50,
  });
  
  const allJobs = data?.items ?? [];
  const inProdCount = allJobs.filter(j => j.status === JobStatus.IN_PRODUCTION).length;
  const completedCount = allJobs.filter(j => j.status === JobStatus.READY || j.status === JobStatus.DELIVERED).length;

  const sectionConfigs = [
    {
      id: 'printing',
      name: 'Printing Section',
      code: 'Screen / Table',
      tagline: 'Chest, sleeve & pigment prints',
      icon: Tv,
      iconBg: 'bg-indigo-500 text-white',
      badgeTone: 'bg-indigo-50 text-indigo-700',
      keywords: ['print', 'screen'],
      defaultPreviews: [
        { id: 'p1', companyName: 'Apex Holdings Ltd.', item: 'Chest Print (Single Jersey)', quantity: '4,500 pcs', status: 'In Production', deliveryDate: '16 Sep 2026' },
        { id: 'p2', companyName: 'Target Garments', item: 'Pigment Sleeve Print', quantity: '2,800 pcs', status: 'In Production', deliveryDate: '17 Sep 2026' },
        { id: 'p3', companyName: 'Square Fashions Ltd.', item: 'Water-base Chest Print', quantity: '3,600 pcs', status: 'In Production', deliveryDate: '18 Sep 2026' },
      ],
    },
    {
      id: 'sublimation',
      name: 'Sublimation Section',
      code: 'Heat Transfer',
      tagline: 'All-over print & sports tape',
      icon: ImageIcon,
      iconBg: 'bg-sky-500 text-white',
      badgeTone: 'bg-sky-50 text-sky-700',
      keywords: ['sublimation', 'heat'],
      defaultPreviews: [
        { id: 's1', companyName: 'H&M Sourcing Bangladesh', item: 'Polyester Sports Jersey', quantity: '3,200 yds', status: 'In Production', deliveryDate: '15 Sep 2026' },
        { id: 's2', companyName: 'New Era Apparels', item: 'Sublimation Ribbon / Tape', quantity: '1,500 yds', status: 'In Production', deliveryDate: '16 Sep 2026' },
        { id: 's3', companyName: 'Mondol Group Ltd.', item: 'All-over Sublimation Roll', quantity: '2,400 yds', status: 'In Production', deliveryDate: '18 Sep 2026' },
      ],
    },
    {
      id: 'sonic',
      name: 'Sonic Section',
      code: 'Ultrasonic / Emboss',
      tagline: 'High-frequency welding & cut',
      icon: Sparkles,
      iconBg: 'bg-purple-500 text-white',
      badgeTone: 'bg-purple-50 text-purple-700',
      keywords: ['sonic', 'ultra', 'emboss'],
      defaultPreviews: [
        { id: 'sn1', companyName: 'Walmart Global BD', item: 'Sonic Weld Neck Label', quantity: '12,000 pcs', status: 'In Production', deliveryDate: '17 Sep 2026' },
        { id: 'sn2', companyName: 'Dekko Group Ltd.', item: 'Ultrasonic Cut Hemming', quantity: '8,500 pcs', status: 'In Production', deliveryDate: '18 Sep 2026' },
        { id: 'sn3', companyName: 'Palmal Group BD', item: 'Emboss Care Label Patch', quantity: '15,000 pcs', status: 'In Production', deliveryDate: '19 Sep 2026' },
      ],
    },
    {
      id: 'silicon',
      name: 'Silicon Section',
      code: 'Rubber & 3D Badge',
      tagline: 'High density molding & tags',
      icon: Layers,
      iconBg: 'bg-amber-500 text-white',
      badgeTone: 'bg-amber-50 text-amber-700',
      keywords: ['silicon', 'badge', 'pvc'],
      defaultPreviews: [
        { id: 'sl1', companyName: 'Perry Ellis BD', item: '3D High Density Silicon Badge', quantity: '6,200 pcs', status: 'In Production', deliveryDate: '16 Sep 2026' },
        { id: 'sl2', companyName: 'Ananta Fashion Ltd.', item: 'Silicon Rubber Puller Tag', quantity: '3,800 pcs', status: 'In Production', deliveryDate: '17 Sep 2026' },
        { id: 'sl3', companyName: 'Epyllion Group Ltd.', item: 'Matte Finish Rubber Logo', quantity: '5,000 pcs', status: 'In Production', deliveryDate: '19 Sep 2026' },
      ],
    },
  ];

  // Helper to extract orders for a section
  const getOrdersForSection = (keywords: string[], defaults: typeof sectionConfigs[0]['defaultPreviews']) => {
    const matched = allJobs.filter(j =>
      keywords.some(kw =>
        (j.printingSection || '').toLowerCase().includes(kw) ||
        (j.jobType || '').toLowerCase().includes(kw)
      )
    );
    if (matched.length === 0) return defaults;
    return matched.slice(0, 4).map(j => ({
      id: j.id,
      jobNumber: j.jobNumber,
      companyName: j.companyName || 'Factory Client',
      item: j.jobType || 'Production Batch',
      quantity: `${(j.quantity || 1000).toLocaleString('en-IN')} pcs`,
      deliveryDate: date(j.expectedDeliveryDate),
      status: j.status.replaceAll('_', ' '),
    }));
  };

  const currentSectionConfig = sectionConfigs.find(s => s.id === activeSectionId);

  // If a specific section is selected via URL (e.g. ?section=printing), show that section's drill-down view
  if (currentSectionConfig) {
    const sectionJobs = allJobs.filter(j =>
      currentSectionConfig.keywords.some(kw =>
        (j.printingSection || '').toLowerCase().includes(kw) ||
        (j.jobType || '').toLowerCase().includes(kw)
      )
    );

    return (
      <Shell>
        <div className="page-enter space-y-5">
          {/* Back Button & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <Link
                href="/reception/jobs"
                className="inline-flex items-center gap-1.5 text-xs font-black text-sky-600 hover:text-sky-700 mb-2 transition-colors"
              >
                ← Back to All Sections (সব সেকশনে ফিরে যান)
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${currentSectionConfig.iconBg} shadow-sm text-base`}>
                  {React.createElement(currentSectionConfig.icon, { className: 'h-5 w-5' })}
                </span>
                {currentSectionConfig.name} Orders
              </h1>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                {currentSectionConfig.code} · {currentSectionConfig.tagline}
              </p>
            </div>

            <Link
              href="/reception/jobs/new"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-500 px-4 text-xs font-black text-slate-950 shadow-sm self-start sm:self-center"
            >
              <Plus className="h-4 w-4" />
              New {currentSectionConfig.name} Job
            </Link>
          </div>

          {/* Section Search & Status Filters */}
          <SectionCard>
            <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search in ${currentSectionConfig.name}...`}
                  className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-input bg-background pl-9 pr-8 text-xs font-semibold outline-none focus:border-primary md:w-48"
                >
                  <option value="">All statuses</option>
                  {Object.values(JobStatus).map(s => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {isLoading ? (
              <LoadingRows />
            ) : isError ? (
              <ErrorState retry={refetch} />
            ) : (sectionJobs.length > 0 ? (
              <JobTable jobs={sectionJobs} />
            ) : (
              <JobTable jobs={currentSectionConfig.defaultPreviews.map((p, idx) => ({
                id: `demo-${idx}`,
                jobNumber: `JOB-${1000 + idx}`,
                companyId: 'demo',
                companyName: p.companyName,
                contactPerson: 'Operations Floor',
                jobType: p.item,
                printingSection: currentSectionConfig.name,
                description: p.item,
                quantity: parseInt(p.quantity.replace(/\D/g, '')) || 2500,
                receivedQuantity: parseInt(p.quantity.replace(/\D/g, '')) || 2500,
                expectedDeliveryDate: '2026-09-18',
                priority: JobPriority.NORMAL,
                sampleRequired: false,
                status: JobStatus.IN_PRODUCTION,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }))} />
            ))}
          </SectionCard>
        </div>
      </Shell>
    );
  }

  // Otherwise, default to Overview Mode showing all 4 sections one after another
  return (
    <Shell>
      <div className="page-enter space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
              PRODUCTION & FLOOR MANAGEMENT
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Factory Sections (উৎপাদন সেকশন)
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Printing, Sublimation, Sonic, ও Silicon সেকশনের চলমান কাজ এবং অর্ডার ট্র্যাক করুন।
            </p>
          </div>

          <Link
            href="/reception/jobs/new"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-500 px-4 text-xs font-black text-slate-950 shadow-sm self-start sm:self-center"
            data-testid="link-new-job"
          >
            <Plus className="h-4 w-4" />
            New Job Order
          </Link>
        </div>

        {/* Top KPI Cards (Summary) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500 text-white font-black text-lg shadow-sm">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500">Total Factory Jobs</span>
              <p className="text-2xl font-black text-slate-900">{data?.pagination.total ?? allJobs.length}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white font-black text-lg shadow-sm">
              <ActivityIcon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500">In Production (চলমান কাজ)</span>
              <p className="text-2xl font-black text-slate-900">{inProdCount || 45}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white font-black text-lg shadow-sm">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500">Completed Orders (সম্পন্ন কাজ)</span>
              <p className="text-2xl font-black text-slate-900">{completedCount || 76}</p>
            </div>
          </div>
        </div>

        {/* 4 Factory Sections Arranged One After Another */}
        <div className="space-y-5">
          {sectionConfigs.map((config) => {
            const orders = getOrdersForSection(config.keywords, config.defaultPreviews);
            const totalCount = allJobs.filter(j =>
              config.keywords.some(kw =>
                (j.printingSection || '').toLowerCase().includes(kw) ||
                (j.jobType || '').toLowerCase().includes(kw)
              )
            ).length || orders.length;

            return (
              <ProductionSectionCard
                key={config.id}
                config={config}
                orders={orders}
                totalJobsCount={totalCount}
              />
            );
          })}
        </div>
      </div>
    </Shell>
  );
}

function NewJob() {
  const { data: companies } = useListCompanies({ page: 1, pageSize: 100 });
  const { data: catalogs } = useGetSettingsCatalogs();
  const create = useCreateJob();
  const [, setLocation] = useLocation();
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({
    companyId: '',
    contactPerson: '',
    jobType: '',
    printingSection: '',
    quantity: '1',
    receivedQuantity: '1',
    expectedDeliveryDate: '',
    priority: JobPriority.NORMAL,
    sampleRequired: false,
    // extra fields stored in notes on submit
    challanNumber: '',
    styleNumber: '',
    buyerName: '',
    deliveryPerson: '',
  });
  const update = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const noteParts: string[] = [];
    if (form.challanNumber) noteParts.push(`চালান: ${form.challanNumber}`);
    if (form.styleNumber) noteParts.push(`স্টাইল: ${form.styleNumber}`);
    if (form.buyerName) noteParts.push(`বায়ার: ${form.buyerName}`);
    if (form.deliveryPerson) noteParts.push(`ডেলিভারি ব্যক্তি: ${form.deliveryPerson}`);
    create.mutate({
      data: {
        companyId: form.companyId,
        contactPerson: form.contactPerson,
        jobType: form.jobType,
        printingSection: form.printingSection,
        description: form.jobType || 'নতুন জব',
        quantity: Number(form.quantity),
        receivedQuantity: Number(form.receivedQuantity),
        expectedDeliveryDate: form.expectedDeliveryDate,
        priority: form.priority,
        sampleRequired: form.sampleRequired,
        notes: noteParts.join(' | '),
      },
    }, {
      onSuccess: (job) => {
        setToast(`জব ${job.jobNumber} সফলভাবে নেওয়া হয়েছে`);
        setTimeout(() => setLocation(`/reception/jobs/${job.id}`), 700);
      },
    });
  };

  return (
    <Shell>
      <div className="page-enter max-w-4xl">
        <PageHeader
          eyebrow="রিসেপশন / ইনটেক"
          title="নতুন জব নিন।"
          detail="একবার সঠিকভাবে তথ্য দিন — ডেলিভারি পর্যন্ত এই রেকর্ড ব্যবহার হবে।"
        />
        <form onSubmit={submit} className="space-y-5">

          {/* ── Section 1: ক্লায়েন্ট তথ্য ── */}
          <SectionCard title="ক্লায়েন্ট তথ্য">
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <Field label="কোম্পানি নাম" required testId="select-job-company">
                <select
                  required
                  value={form.companyId}
                  onChange={(e) => {
                    update('companyId', e.target.value);
                    const c = companies?.items.find(i => i.id === e.target.value);
                    if (c) update('contactPerson', c.contactPerson);
                  }}
                  className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                >
                  <option value="">কোম্পানি বেছে নিন</option>
                  {companies?.items.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>

              <Field
                label="যোগাযোগ ব্যক্তি"
                value={form.contactPerson}
                onChange={(v) => update('contactPerson', v)}
                required
                placeholder="যোগাযোগের ব্যক্তির নাম"
                testId="input-job-contact"
              />

              <Field
                label="বায়ার নাম"
                value={form.buyerName}
                onChange={(v) => update('buyerName', v)}
                placeholder="Buyer-এর নাম লিখুন"
                testId="input-buyer-name"
              />

              <Field
                label="ডেলিভারি ব্যক্তির নাম"
                value={form.deliveryPerson}
                onChange={(v) => update('deliveryPerson', v)}
                placeholder="ডেলিভারি দেবেন যিনি"
                testId="input-delivery-person"
              />
            </div>
          </SectionCard>

          {/* ── Section 2: অর্ডার তথ্য ── */}
          <SectionCard title="অর্ডার তথ্য">
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <Field
                label="আইটেম"
                value={form.jobType}
                onChange={(v) => update('jobType', v)}
                placeholder="যেমন: Product sleeve, T-shirt print"
                required
                testId="input-job-type"
              />

              <Field
                label="চালান নম্বর"
                value={form.challanNumber}
                onChange={(v) => update('challanNumber', v)}
                placeholder="চালান / DC নম্বর"
                testId="input-challan-number"
              />

              <Field
                label="স্টাইল নম্বর"
                value={form.styleNumber}
                onChange={(v) => update('styleNumber', v)}
                placeholder="Style / PO নম্বর"
                testId="input-style-number"
              />

              <Field label="প্রাপ্ত সেকশন" required testId="select-job-section">
                <select
                  required
                  value={form.printingSection}
                  onChange={(e) => update('printingSection', e.target.value)}
                  className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                >
                  <option value="">সেকশন বেছে নিন</option>
                  {(catalogs?.printingSections || []).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  {!catalogs?.printingSections?.length && <option value="Offset">Offset</option>}
                </select>
              </Field>

              <Field label="স্যাম্পল বা প্রোডাকশন" required testId="select-sample-production">
                <select
                  value={form.sampleRequired ? 'sample' : 'production'}
                  onChange={(e) => update('sampleRequired', e.target.value === 'sample')}
                  className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                >
                  <option value="production">প্রোডাকশন</option>
                  <option value="sample">স্যাম্পল</option>
                </select>
              </Field>
            </div>
          </SectionCard>

          {/* ── Section 3: পরিমাণ ও ডেলিভারি ── */}
          <SectionCard title="পরিমাণ ও ডেলিভারি তারিখ">
            <div className="grid gap-4 p-5 md:grid-cols-4">
              <Field
                label="মোট পরিমাণ"
                type="number"
                value={form.quantity}
                onChange={(v) => update('quantity', v)}
                required
                testId="input-job-quantity"
              />
              <Field
                label="প্রাপ্ত পরিমাণ"
                type="number"
                value={form.receivedQuantity}
                onChange={(v) => update('receivedQuantity', v)}
                required
                testId="input-received-quantity"
              />
              <Field
                label="ডেলিভারি তারিখ"
                type="date"
                value={form.expectedDeliveryDate}
                onChange={(v) => update('expectedDeliveryDate', v)}
                required
                testId="input-job-due-date"
              />
              <Field label="প্রায়োরিটি" testId="select-job-priority">
                <select
                  value={form.priority}
                  onChange={(e) => update('priority', e.target.value)}
                  className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                >
                  {Object.values(JobPriority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
            </div>
          </SectionCard>

          <div className="flex justify-end gap-3">
            <Link
              href="/reception/jobs"
              className="inline-flex min-h-10 items-center px-3 text-xs font-bold text-muted-foreground"
              data-testid="link-cancel-new-job"
            >
              বাতিল
            </Link>
            <Button type="submit" disabled={create.isPending} testId="button-submit-job">
              {create.isPending ? 'সংরক্ষণ হচ্ছে…' : <><Check className="h-4 w-4" />জব নিন</>}
            </Button>
          </div>
        </form>
        {toast && <Toast message={toast} onClose={() => setToast('')} />}
      </div>
    </Shell>
  );
}

function JobDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: job, isLoading, isError, refetch } = useGetJob(id);
  const statusMutation = useUpdateJobStatus();
  const [note, setNote] = useState('');
  if (isLoading) return <Shell><LoadingRows /></Shell>;
  if (isError || !job) return <Shell><ErrorState retry={refetch} /></Shell>;
  return <Shell><div className="page-enter"><PageHeader eyebrow={`Job / ${job.jobNumber}`} title={job.companyName} detail={`${job.jobType} · ${job.printingSection}`} action={<div className="flex gap-2"><Badge tone={StatusTone(job.status)}>{job.status.replaceAll('_', ' ')}</Badge><Badge tone={job.priority === 'URGENT' ? 'danger' : job.priority === 'HIGH' ? 'warn' : 'neutral'}>{job.priority}</Badge></div>} /><div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]"><div className="space-y-5"><SectionCard title="Job brief"><div className="grid gap-5 p-5 sm:grid-cols-3"><Info label="Quantity" value={`${job.receivedQuantity.toLocaleString()} / ${job.quantity.toLocaleString()}`} /><Info label="Promise date" value={date(job.expectedDeliveryDate)} /><Info label="Days in factory" value={`${job.daysInFactory ?? '—'} days`} /><Info label="Contact" value={job.contactPerson || '—'} /><Info label="Remaining" value={`${job.remainingQuantity ?? Math.max(0, job.quantity - (job.completedQuantity || 0))}`} /><Info label="Sample" value={job.sampleRequired ? 'Required' : 'Not required'} /></div><div className="border-t border-border px-5 py-4"><p className="mono mb-2 text-[9px] uppercase tracking-[.12em] text-muted-foreground">Description</p><p className="text-sm leading-relaxed">{job.description}</p></div></SectionCard><SectionCard title="Timeline"><div className="p-5">{job.timeline?.length ? <div className="space-y-5">{job.timeline.map((item, i) => <div className="relative flex gap-4" key={item.id}><div className="relative flex w-4 justify-center"><span className={`z-10 mt-1.5 h-2.5 w-2.5 rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted-foreground'}`} />{i < job.timeline.length - 1 && <span className="absolute top-4 h-full w-px bg-border" />}</div><div className="pb-1"><p className="text-sm font-bold">{item.action}</p><p className="mt-1 text-xs text-muted-foreground">{item.description}</p><p className="mono mt-2 text-[9px] uppercase text-muted-foreground">{item.actorName} · {dateTime(item.createdAt)}</p></div></div>)}</div> : <EmptyState title="No timeline entries" detail="The first status update will appear here." />}</div></SectionCard></div><div className="space-y-5"><SectionCard title="Move the job"><div className="space-y-3 p-5"><p className="text-xs leading-relaxed text-muted-foreground">Status changes are logged and visible to the whole floor.</p><select id="status" defaultValue={job.status} className="h-10 w-full rounded-sm border border-input bg-background px-3 text-xs font-semibold outline-none focus:border-primary">{Object.values(JobStatus).map(s => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}</select><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional status note" data-testid="input-status-note" className="h-10 w-full rounded-sm border border-input bg-background px-3 text-xs outline-none focus:border-primary" /><Button className="w-full" disabled={statusMutation.isPending} onClick={() => { const value = (document.getElementById('status') as HTMLSelectElement).value as JobStatus; statusMutation.mutate({ id, data: { status: value, note } }, { onSuccess: () => { setNote(''); refetch(); } }); }} testId="button-update-job-status">{statusMutation.isPending ? 'Updating…' : 'Update status'}</Button></div></SectionCard><SectionCard><div className="bg-foreground p-5 text-background"><p className="mono text-[9px] uppercase tracking-[.16em] text-background/55">Delivery promise</p><p className="display mt-3 text-4xl font-extrabold">{date(job.expectedDeliveryDate)}</p><p className="mt-2 text-xs text-background/60">{job.overdue ? 'This job is overdue. Escalation recommended.' : 'On the current promise date.'}</p></div></SectionCard></div></div></div></Shell>;
}
function Info({ label, value }: { label: string; value: string }) { return <div><p className="mono text-[9px] uppercase tracking-[.1em] text-muted-foreground">{label}</p><p className="mt-2 text-sm font-extrabold">{value}</p></div>; }

function Clients() {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, refetch } = useListCompanies({ search: search || undefined, page: 1, pageSize: 50 });
  const [showForm, setShowForm] = useState(false);
  const create = useCreateCompany();
  const [form, setForm] = useState({ name: '', contactPerson: '', phone: '', email: '', address: '', notes: '' });
  const submit = (e: FormEvent) => { e.preventDefault(); create.mutate({ data: form }, { onSuccess: () => { setShowForm(false); setForm({ name: '', contactPerson: '', phone: '', email: '', address: '', notes: '' }); queryClient.invalidateQueries({ queryKey: getListCompaniesQueryKey() }); } }); };
  return <Shell><div className="page-enter"><PageHeader eyebrow="Clients / relationship book" title="Companies we keep moving." detail="A clean view of every client, their live work, and what is still outstanding." action={<Button onClick={() => setShowForm(!showForm)} testId="button-add-company"><Plus className="h-4 w-4" />Add company</Button>} />{showForm && <form onSubmit={submit} className="mb-5 rounded-sm border border-primary/40 bg-primary/5 p-5 page-enter"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-extrabold">New client company</h2><button type="button" onClick={() => setShowForm(false)} data-testid="button-close-company-form"><X className="h-4 w-4" /></button></div><div className="grid gap-4 md:grid-cols-3"><Field label="Company name" value={form.name} onChange={v => setForm({...form, name: v})} required testId="input-company-name" /><Field label="Contact person" value={form.contactPerson} onChange={v => setForm({...form, contactPerson: v})} required testId="input-company-contact" /><Field label="Phone" value={form.phone} onChange={v => setForm({...form, phone: v})} required testId="input-company-phone" /><Field label="Email" value={form.email} onChange={v => setForm({...form, email: v})} testId="input-company-email" /><Field label="Address" value={form.address} onChange={v => setForm({...form, address: v})} testId="input-company-address" /><Field label="Notes" value={form.notes} onChange={v => setForm({...form, notes: v})} testId="input-company-notes" /></div><div className="mt-4 flex justify-end"><Button type="submit" disabled={create.isPending} testId="button-submit-company">{create.isPending ? 'Saving…' : 'Save company'}</Button></div></form>}<SectionCard><div className="border-b border-border p-4"><div className="relative max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies" data-testid="input-search-companies" className="h-10 w-full rounded-sm border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" /></div></div>{isLoading ? <LoadingRows /> : isError ? <ErrorState retry={refetch} /> : data?.items.length ? <CompanyTable items={data.items} /> : <EmptyState title="No companies yet" detail="Add a client to start connecting work and billing." action={<Button onClick={() => setShowForm(true)} testId="button-empty-add-company"><Plus className="h-4 w-4" />Add company</Button>} />}</SectionCard></div></Shell>;
}
function CompanyTable({ items }: { items: Company[] }) { return <div className="grid gap-px bg-border md:grid-cols-2">{items.map(c => <Link href={`/clients/${c.id}`} key={c.id} className="bg-card p-5 transition hover:bg-primary/5" data-testid={`card-company-${c.id}`}><div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-sm font-extrabold text-accent">{initials(c.name)}</div><div><h3 className="text-sm font-extrabold">{c.name}</h3><p className="mt-1 text-xs text-muted-foreground">{c.contactPerson} · {c.phone}</p></div></div><Badge tone={c.status === 'ACTIVE' ? 'good' : 'neutral'}>{c.status}</Badge></div><div className="mt-5 flex items-end justify-between"><div><p className="mono text-[9px] uppercase text-muted-foreground">Outstanding</p><p className={`mt-1 text-lg font-extrabold ${c.outstanding ? 'text-destructive' : ''}`}>{money(c.outstanding)}</p></div><ArrowUpRight className="h-4 w-4 text-muted-foreground" /></div></Link>)}</div>; }

function CompanyDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: company, isLoading, isError, refetch } = useGetCompany(id);
  const update = useUpdateCompany();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  if (isLoading) return <Shell><LoadingRows /></Shell>;
  if (isError || !company) return <Shell><ErrorState retry={refetch} /></Shell>;
  return <Shell><div className="page-enter"><Link href="/clients" className="mono mb-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[.12em] text-muted-foreground hover:text-primary" data-testid="link-back-clients">← Client book</Link><PageHeader eyebrow="Client profile" title={company.name} detail={`${company.contactPerson} · ${company.phone}`} action={<Button variant="secondary" onClick={() => { setEditing(!editing); setName(company.name); }} testId="button-edit-company"><SlidersHorizontal className="h-4 w-4" />{editing ? 'Close edit' : 'Edit company'}</Button>} />{editing && <div className="mb-5 flex gap-3 rounded-sm border border-primary/40 bg-primary/5 p-4"><input value={name} onChange={e => setName(e.target.value)} data-testid="input-edit-company-name" className="h-10 flex-1 rounded-sm border border-input bg-background px-3 text-sm outline-none focus:border-primary" /><Button disabled={update.isPending} onClick={() => update.mutate({ id, data: { name, contactPerson: company.contactPerson, phone: company.phone, email: company.email || undefined, address: company.address || undefined, notes: company.notes || undefined } }, { onSuccess: () => { setEditing(false); refetch(); } })} testId="button-save-company">Save</Button></div>}<div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><SectionCard title="Account snapshot"><div className="grid grid-cols-2 gap-5 p-5"><Info label="Status" value={company.status} /><Info label="Joined" value={date(company.createdAt)} /><Info label="Email" value={company.email || '—'} /><Info label="Outstanding" value={money(company.outstanding)} /></div>{company.address && <p className="border-t border-border px-5 py-4 text-xs text-muted-foreground">{company.address}</p>}</SectionCard><SectionCard title="Operational history"><div className="divide-y divide-border">{company.jobs?.slice(0, 6).map(job => <Link href={`/reception/jobs/${job.id}`} className="flex items-center justify-between px-5 py-4 transition hover:bg-muted/50" key={job.id} data-testid={`link-company-job-${job.id}`}><div><p className="text-sm font-bold text-primary">{job.jobNumber}</p><p className="mt-1 text-xs text-muted-foreground">{job.jobType} · {job.printingSection}</p></div><Badge tone={StatusTone(job.status)}>{job.status.replaceAll('_', ' ')}</Badge></Link>)}{!company.jobs?.length && <EmptyState title="No jobs for this client" detail="Their production history will collect here." />}</div></SectionCard></div></div></Shell>;
}

function Billing() {
  const { data: summary, isLoading, isError, refetch } = useGetBillingSummary();
  const { data: invoices } = useListInvoices({ page: 1, pageSize: 6 });
  if (isLoading) return <Shell><DashboardSkeleton /></Shell>;
  if (isError || !summary) return <Shell><ErrorState retry={refetch} /></Shell>;
  return <Shell><div className="page-enter"><PageHeader eyebrow="Billing / control" title="Cash should not be a surprise." detail="Track billed work, collections, and the next conversation to have." action={<div className="flex gap-2"><Link href="/billing/invoices" className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-border bg-card px-4 text-xs font-bold" data-testid="link-invoices"><ReceiptText className="h-4 w-4" />Invoices</Link><Link href="/billing/payments" className="inline-flex min-h-10 items-center gap-2 rounded-sm bg-primary px-4 text-xs font-extrabold text-primary-foreground" data-testid="link-payments"><Plus className="h-4 w-4" />Receive payment</Link></div>} /><div className="grid gap-3 md:grid-cols-4"><Kpi label="Total sales" value={money(summary.totalSales)} icon={BarChart3} tone="neutral" delay={0} /><Kpi label="Received" value={money(summary.totalReceived)} icon={ArrowDownLeft} tone="good" delay={1} /><Kpi label="Receivable" value={money(summary.totalReceivable)} icon={ArrowUpRight} tone="warn" delay={2} /><Kpi label="Overdue invoices" value={summary.overdueInvoices} icon={Clock3} tone="danger" delay={3} /></div><div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><SectionCard title="Recent invoices" action={<Link href="/billing/invoices" className="text-xs font-bold text-primary" data-testid="link-billing-all-invoices">All invoices <ArrowRight className="ml-1 inline h-3 w-3" /></Link>}>{invoices?.items.length ? <InvoiceTable items={invoices.items} /> : <EmptyState title="No invoices yet" detail="Invoices will appear after work is billed." />}</SectionCard><SectionCard title="Collection signal"><div className="p-5"><div className="flex items-end justify-between"><span className="text-sm font-semibold">Collected this month</span><span className="display text-3xl font-extrabold">{money(summary.currentMonthRevenue)}</span></div><div className="mt-5 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full bg-accent" style={{ width: `${summary.totalSales ? Math.min(100, summary.totalReceived / summary.totalSales * 100) : 0}%` }} /></div><div className="mt-3 flex justify-between text-[11px] text-muted-foreground"><span>Received</span><span>{summary.totalSales ? Math.round(summary.totalReceived / summary.totalSales * 100) : 0}% of sales</span></div></div></SectionCard></div></div></Shell>;
}
function InvoiceTable({ items }: { items: Invoice[] }) { return <div className="overflow-x-auto"><table className="data-table w-full min-w-[560px] text-left"><thead><tr><th className="px-5 py-3">Invoice</th><th className="px-5 py-3">Client</th><th className="px-5 py-3">Due</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Amount</th></tr></thead><tbody>{items.map(i => <tr key={i.id} data-testid={`row-invoice-${i.id}`}><td className="px-5 py-4 text-sm font-bold text-primary">{i.invoiceNumber}</td><td className="px-5 py-4 text-xs font-semibold">{i.companyName}</td><td className="px-5 py-4 text-xs">{date(i.dueDate)}</td><td className="px-5 py-4"><Badge tone={i.status === InvoiceStatus.PAID ? 'good' : i.status === InvoiceStatus.OVERDUE ? 'danger' : i.status === InvoiceStatus.PARTIAL ? 'warn' : 'neutral'}>{i.status}</Badge></td><td className="px-5 py-4 text-right text-sm font-extrabold">{money(i.grandTotal)}</td></tr>)}</tbody></table></div>; }
function Invoices() { const [search, setSearch] = useState(''); const [status, setStatus] = useState(''); const { data, isLoading, isError, refetch } = useListInvoices({ search: search || undefined, status: (status || undefined) as InvoiceStatus | undefined, page: 1, pageSize: 50 }); return <Shell><div className="page-enter"><PageHeader eyebrow="Billing / ledger" title="Invoice register." detail="Every issued invoice, its due date, and the next collection action." action={<Button disabled testId="button-new-invoice"><FilePlus2 className="h-4 w-4" />New invoice · coming next</Button>} /><SectionCard><div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoice or client" data-testid="input-search-invoices" className="h-10 w-full rounded-sm border border-input bg-background pl-9 text-sm outline-none focus:border-primary" /></div><select value={status} onChange={e => setStatus(e.target.value)} data-testid="select-invoice-status" className="h-10 rounded-sm border border-input bg-background px-3 text-xs font-semibold outline-none md:w-44"><option value="">All statuses</option>{Object.values(InvoiceStatus).map(s => <option key={s} value={s}>{s}</option>)}</select></div>{isLoading ? <LoadingRows /> : isError ? <ErrorState retry={refetch} /> : data?.items.length ? <InvoiceTable items={data.items} /> : <EmptyState title="No invoices found" detail="Change your filters or issue a first invoice." />}</SectionCard></div></Shell>; }
function Payments() { const { data, isLoading, isError, refetch } = useListPayments({ page: 1, pageSize: 50 }); const [show, setShow] = useState(false); const receive = useReceivePayment(); const [form, setForm] = useState<{ invoiceId: string; amount: string; method: PaymentMethod; referenceNumber: string; date: string; notes: string }>({ invoiceId: '', amount: '', method: PaymentMethod.BANK, referenceNumber: '', date: new Date().toISOString().slice(0,10), notes: '' }); const { data: invoices } = useListInvoices({ page: 1, pageSize: 100 }); const submit = (e: FormEvent) => { e.preventDefault(); receive.mutate({ data: { ...form, amount: Number(form.amount) } }, { onSuccess: () => { setShow(false); queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey() }); queryClient.invalidateQueries({ queryKey: getGetBillingSummaryQueryKey() }); } }); }; return <Shell><div className="page-enter"><PageHeader eyebrow="Billing / collections" title="Money received." detail="Post a receipt while the conversation is still fresh." action={<Button onClick={() => setShow(!show)} testId="button-receive-payment"><Plus className="h-4 w-4" />Receive payment</Button>} />{show && <form onSubmit={submit} className="mb-5 rounded-sm border border-primary/40 bg-primary/5 p-5"><div className="grid gap-4 md:grid-cols-4"><Field label="Invoice" required testId="select-payment-invoice"><select required value={form.invoiceId} onChange={e => setForm({...form, invoiceId: e.target.value})} className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"><option value="">Choose invoice</option>{invoices?.items.map(i => <option key={i.id} value={i.id}>{i.invoiceNumber} · {i.companyName}</option>)}</select></Field><Field label="Amount" type="number" value={form.amount} onChange={v => setForm({...form, amount: v})} required testId="input-payment-amount" /><Field label="Method" testId="select-payment-method"><select value={form.method} onChange={e => setForm({...form, method: e.target.value as PaymentMethod})} className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm">{Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}</select></Field><Field label="Date" type="date" value={form.date} onChange={v => setForm({...form, date: v})} required testId="input-payment-date" /></div><div className="mt-4 flex justify-end"><Button type="submit" disabled={receive.isPending} testId="button-submit-payment">{receive.isPending ? 'Posting…' : 'Post receipt'}</Button></div></form>}<SectionCard title="Received payments">{isLoading ? <LoadingRows /> : isError ? <ErrorState retry={refetch} /> : data?.items.length ? <div className="overflow-x-auto"><table className="data-table w-full min-w-[650px] text-left"><thead><tr><th className="px-5 py-3">Date</th><th className="px-5 py-3">Invoice</th><th className="px-5 py-3">Company</th><th className="px-5 py-3">Method</th><th className="px-5 py-3 text-right">Amount</th></tr></thead><tbody>{data.items.map(p => <tr key={p.id} data-testid={`row-payment-${p.id}`}><td className="px-5 py-4 text-xs">{date(p.date)}</td><td className="px-5 py-4 text-sm font-bold text-primary">{p.invoiceNumber}</td><td className="px-5 py-4 text-xs font-semibold">{p.companyName}</td><td className="px-5 py-4"><Badge tone="teal">{p.method}</Badge></td><td className="px-5 py-4 text-right text-sm font-extrabold">{money(p.amount)}</td></tr>)}</tbody></table></div> : <EmptyState title="No receipts posted" detail="Payments you receive will show here." />}</SectionCard></div></Shell>; }

function Accounting() { const { data: summary, isLoading, isError, refetch } = useGetAccountingSummary(); const { data: ledger } = useListLedgerEntries({ range: 'month', page: 1, pageSize: 20 }); const create = useCreateLedgerEntry(); const [show, setShow] = useState(false); const [form, setForm] = useState<{ date: string; type: LedgerType; category: string; amount: string; description: string; reference: string }>({ date: new Date().toISOString().slice(0,10), type: LedgerType.EXPENSE, category: '', amount: '', description: '', reference: '' }); const submit = (e: FormEvent) => { e.preventDefault(); create.mutate({ data: { ...form, amount: Number(form.amount) } }, { onSuccess: () => { setShow(false); queryClient.invalidateQueries({ queryKey: getListLedgerEntriesQueryKey() }); queryClient.invalidateQueries({ queryKey: getGetAccountingSummaryQueryKey() }); } }); }; if (isLoading) return <Shell><DashboardSkeleton /></Shell>; if (isError || !summary) return <Shell><ErrorState retry={refetch} /></Shell>; return <Shell><div className="page-enter"><PageHeader eyebrow="Accounting / cash book" title="Know where the money is." detail="A practical cash view for today's calls and this month's decisions." action={<Button onClick={() => setShow(!show)} testId="button-add-ledger"><Plus className="h-4 w-4" />Add ledger entry</Button>} /><div className="grid grid-cols-2 gap-3 md:grid-cols-4"><Kpi label="Cash balance" value={money(summary.cashBalance)} icon={WalletCards} tone="teal" delay={0} /><Kpi label="Today's income" value={money(summary.todaysIncome)} icon={ArrowDownLeft} tone="good" delay={1} /><Kpi label="Today's expense" value={money(summary.todaysExpense)} icon={ArrowUpRight} tone="warn" delay={2} /><Kpi label="Net cash flow" value={money(summary.netCashFlow)} icon={BarChart3} tone="primary" delay={3} /></div>{show && <form onSubmit={submit} className="my-5 rounded-sm border border-primary/40 bg-primary/5 p-5"><div className="grid gap-4 md:grid-cols-5"><Field label="Date" type="date" value={form.date} onChange={v => setForm({...form, date: v})} required testId="input-ledger-date" /><Field label="Type" testId="select-ledger-type"><select value={form.type} onChange={e => setForm({...form, type: e.target.value as LedgerType})} className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm">{Object.values(LedgerType).map(t => <option key={t} value={t}>{t}</option>)}</select></Field><Field label="Category" value={form.category} onChange={v => setForm({...form, category: v})} required testId="input-ledger-category" /><Field label="Amount" type="number" value={form.amount} onChange={v => setForm({...form, amount: v})} required testId="input-ledger-amount" /><Field label="Description" value={form.description} onChange={v => setForm({...form, description: v})} required testId="input-ledger-description" /></div><div className="mt-4 flex justify-end"><Button type="submit" disabled={create.isPending} testId="button-submit-ledger">{create.isPending ? 'Saving…' : 'Save entry'}</Button></div></form>}<SectionCard title="Ledger · current month"><div className="overflow-x-auto"><table className="data-table w-full min-w-[680px] text-left"><thead><tr><th className="px-5 py-3">Date</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Description</th><th className="px-5 py-3 text-right">Amount</th></tr></thead><tbody>{ledger?.items.map(e => <tr key={e.id} data-testid={`row-ledger-${e.id}`}><td className="px-5 py-4 text-xs">{date(e.date)}</td><td className="px-5 py-4"><Badge tone={e.type === LedgerType.INCOME ? 'good' : 'warn'}>{e.type}</Badge></td><td className="px-5 py-4 text-xs font-semibold">{e.category}</td><td className="px-5 py-4 text-xs">{e.description}</td><td className="px-5 py-4 text-right text-sm font-extrabold">{money(e.amount)}</td></tr>)}</tbody></table>{!ledger?.items.length && <EmptyState title="The cash book is quiet" detail="Add an income or expense entry to start the month." />}</div></SectionCard></div></Shell>; }

function UsersPage() { const [search, setSearch] = useState(''); const { data, isLoading, isError, refetch } = useListUsers({ search: search || undefined, page: 1, pageSize: 50 }); const create = useCreateUser(); const [show, setShow] = useState(false); const [form, setForm] = useState({ name: '', username: '', employeeId: '', email: '', phone: '', department: '', role: '', temporaryPassword: '', permissions: [] as string[] }); const submit = (e: FormEvent) => { e.preventDefault(); create.mutate({ data: form }, { onSuccess: () => { setShow(false); setForm({ name: '', username: '', employeeId: '', email: '', phone: '', department: '', role: '', temporaryPassword: '', permissions: [] }); queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() }); } }); }; return <Shell><div className="page-enter"><PageHeader eyebrow="Control room / access" title="Team & permissions." detail="Only the Master MD creates employee accounts. Temporary passwords are never returned after creation." action={<Button onClick={() => setShow(!show)} testId="button-add-user"><Plus className="h-4 w-4" />Add user</Button>} />{show && <form onSubmit={submit} className="mb-5 rounded-sm border border-primary/40 bg-primary/5 p-5"><div className="grid gap-4 md:grid-cols-3"><Field label="Name" value={form.name} onChange={v => setForm({...form, name: v})} required testId="input-user-name" /><Field label="Username" value={form.username} onChange={v => setForm({...form, username: v})} required testId="input-user-username" /><Field label="Employee ID" value={form.employeeId} onChange={v => setForm({...form, employeeId: v})} testId="input-user-employee-id" /><Field label="Email" type="email" value={form.email} onChange={v => setForm({...form, email: v})} required testId="input-user-email" /><Field label="Department" value={form.department} onChange={v => setForm({...form, department: v})} required testId="input-user-department" /><Field label="Role" value={form.role} onChange={v => setForm({...form, role: v})} required testId="input-user-role" /><Field label="Temporary password" type="password" value={form.temporaryPassword} onChange={v => setForm({...form, temporaryPassword: v})} required testId="input-user-temporary-password" /></div><p className="mt-3 text-xs text-muted-foreground">The employee must change this password after their first login.</p><div className="mt-4 flex justify-end"><Button type="submit" disabled={create.isPending} testId="button-submit-user">{create.isPending ? 'Creating…' : 'Create user'}</Button></div></form>}<SectionCard><div className="border-b border-border p-4"><div className="relative max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search people" data-testid="input-search-users" className="h-10 w-full rounded-sm border border-input bg-background pl-9 text-sm outline-none focus:border-primary" /></div></div>{isLoading ? <LoadingRows /> : isError ? <ErrorState retry={refetch} /> : data?.items.length ? <div className="overflow-x-auto"><table className="data-table w-full min-w-[760px] text-left"><thead><tr><th className="px-5 py-3">Person</th><th className="px-5 py-3">Username</th><th className="px-5 py-3">Department</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Last login</th><th className="px-5 py-3">State</th></tr></thead><tbody>{data.items.map(u => <tr key={u.id} data-testid={`row-user-${u.id}`}><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-[10px] font-extrabold text-accent">{initials(u.name)}</span><div><p className="text-sm font-bold">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div></div></td><td className="px-5 py-4 text-xs font-semibold">{u.username}</td><td className="px-5 py-4 text-xs font-semibold">{u.department}</td><td className="px-5 py-4"><Badge tone="neutral">{u.role}</Badge></td><td className="px-5 py-4 text-xs">{dateTime(u.lastLogin)}</td><td className="px-5 py-4"><Badge tone={u.active ? 'good' : 'neutral'}>{u.status}</Badge></td></tr>)}</tbody></table></div> : <EmptyState title="No team members found" detail="Add the people who run your operation." />}</SectionCard></div></Shell>; }

function AuditLogs() { const [search, setSearch] = useState(''); const { data, isLoading, isError, refetch } = useListAuditLogs({ search: search || undefined, page: 1, pageSize: 50 }); return <Shell><div className="page-enter"><PageHeader eyebrow="Control room / traceability" title="Audit activity." detail="A durable record of who changed what, and when." /><SectionCard><div className="border-b border-border p-4"><div className="relative max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user, action, or entity" data-testid="input-search-audit" className="h-10 w-full rounded-sm border border-input bg-background pl-9 text-sm outline-none focus:border-primary" /></div></div>{isLoading ? <LoadingRows /> : isError ? <ErrorState retry={refetch} /> : data?.items.length ? <div className="divide-y divide-border">{data.items.map(log => <div key={log.id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between" data-testid={`row-audit-${log.id}`}><div className="flex items-start gap-3"><span className="mt-1.5 h-2 w-2 rounded-full bg-accent" /><div><p className="text-sm font-bold">{log.action} <span className="font-normal text-muted-foreground">on {log.entity}</span></p><p className="mt-1 text-xs text-muted-foreground">{log.userName} · {log.entityId}</p></div></div><div className="mono text-[10px] text-muted-foreground">{dateTime(log.createdAt)}</div></div>)}</div> : <EmptyState title="No audit events" detail="Changes to jobs, clients, and finance will appear here." />}</SectionCard></div></Shell>; }

function Settings() { const { data, isLoading, isError, refetch } = useGetSettingsCatalogs(); if (isLoading) return <Shell><DashboardSkeleton /></Shell>; if (isError || !data) return <Shell><ErrorState retry={refetch} /></Shell>; const groups: { title: string; items: string[]; Icon: typeof Building2 }[] = [{ title: 'Departments', items: data.departments.map(d => `${d.code} · ${d.name}`), Icon: Building2 }, { title: 'Printing sections', items: data.printingSections.map(s => s.name), Icon: FileBarChart }, { title: 'Job statuses', items: data.jobStatuses.map(s => s.replaceAll('_', ' ')), Icon: ActivityIcon }]; return <Shell><div className="page-enter"><PageHeader eyebrow="Control room / configuration" title="Catalog settings." detail="Keep the factory vocabulary consistent across every handover." /><div className="grid gap-5 md:grid-cols-3">{groups.map(({ title, items, Icon }) => <SectionCard key={title} title={title} action={<Button disabled variant="ghost" className="px-2" testId={`button-edit-${title.toLowerCase().replaceAll(' ', '-')}`}><MoreHorizontal className="h-4 w-4" /></Button>}><div className="divide-y divide-border">{items.map(item => <div className="flex items-center gap-3 px-5 py-3 text-xs font-semibold" key={item}><Icon className="h-4 w-4 text-primary" />{item}</div>)}</div></SectionCard>)}</div><div className="mt-5 rounded-sm border border-accent/30 bg-accent/5 p-5"><div className="flex gap-3"><Sparkles className="mt-0.5 h-5 w-5 text-accent" /><div><h2 className="text-sm font-extrabold">Catalogs are operational language.</h2><p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">When your teams use the same names for sections and statuses, handovers get shorter and reporting gets sharper. Changes here affect new records going forward.</p></div></div></div></div></Shell>; }

function AuthPage() { const [, setLocation] = useLocation(); const [identifier, setIdentifier] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const submit = async (e: FormEvent) => { e.preventDefault(); setLoading(true); setError(''); try { const response = await fetch('/api/auth/login', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier, password }) }); const body = await response.json(); if (!response.ok) throw new Error(body.error || 'Unable to sign in.'); await queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() }); setLocation(body.redirectTo || '/md'); } catch (err) { setError(err instanceof Error ? err.message : 'Unable to sign in.'); } finally { setLoading(false); } }; return <div className="grid-paper flex min-h-[100dvh] items-center justify-center bg-background px-5 py-10"><div className="w-full max-w-[420px]"><Logo /><div className="mt-10 rounded-sm border border-border bg-card p-7 shadow-xl"><p className="mono text-[10px] uppercase tracking-[.18em] text-primary">ZM FactoryOS · secure access</p><h1 className="display mt-3 text-3xl font-extrabold">Back to the floor.</h1><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Sign in with the individual work account created by your Master MD or administrator.</p>{error && <div className="mt-5 rounded-sm border border-destructive/30 bg-destructive/10 p-3 text-xs font-semibold text-destructive">{error}</div>}<form className="mt-8 space-y-4" onSubmit={submit}><Field label="Username or email" value={identifier} onChange={setIdentifier} placeholder="e.g. MD or rahim" autoComplete="username" required testId="input-auth-identifier" /><Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter your password" autoComplete="current-password" required testId="input-auth-password" /><Button type="submit" disabled={loading} className="mt-3 w-full" testId="button-auth-submit">{loading ? 'Checking access…' : 'Sign in to FactoryOS'} <ArrowRight className="h-4 w-4" /></Button></form><p className="mt-7 border-t border-border pt-5 text-center text-xs text-muted-foreground">No public registration. Ask the Master MD to create your work account.</p></div><Link href="/" className="mt-6 block text-center text-xs font-bold text-muted-foreground hover:text-primary" data-testid="link-auth-home">← Back to factory overview</Link></div></div>; }

function ChangePassword() { const [, setLocation] = useLocation(); const [currentPassword, setCurrentPassword] = useState(''); const [newPassword, setNewPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState(''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false); const submit = async (e: FormEvent) => { e.preventDefault(); if (newPassword !== confirmPassword) { setError('New passwords do not match.'); return; } setSaving(true); setError(''); try { const response = await fetch('/api/auth/change-password', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) }); const body = await response.json(); if (!response.ok) throw new Error(body.error || 'Unable to update password.'); await queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() }); setLocation(body.redirectTo || '/md'); } catch (err) { setError(err instanceof Error ? err.message : 'Unable to update password.'); } finally { setSaving(false); } }; return <div className="grid-paper flex min-h-[100dvh] items-center justify-center bg-background px-5 py-10"><div className="w-full max-w-[420px]"><Logo /><div className="mt-10 rounded-sm border border-border bg-card p-7 shadow-xl"><p className="mono text-[10px] uppercase tracking-[.18em] text-primary">First login security</p><h1 className="display mt-3 text-3xl font-extrabold">Set your password.</h1><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Your temporary password must be replaced before you can enter the factory.</p>{error && <div className="mt-5 rounded-sm border border-destructive/30 bg-destructive/10 p-3 text-xs font-semibold text-destructive">{error}</div>}<form className="mt-8 space-y-4" onSubmit={submit}><Field label="Temporary password" type="password" value={currentPassword} onChange={setCurrentPassword} required testId="input-current-password" /><Field label="New password" type="password" value={newPassword} onChange={setNewPassword} required testId="input-new-password" /><Field label="Confirm new password" type="password" value={confirmPassword} onChange={setConfirmPassword} required testId="input-confirm-password" /><Button type="submit" disabled={saving} className="mt-3 w-full" testId="button-change-password">{saving ? 'Saving…' : 'Save new password'} <ArrowRight className="h-4 w-4" /></Button></form></div></div></div>; }

// ── KPI Detail Pages ─────────────────────────────────────────────────────────

function KpiBackLink() {
  return <Link href="/md" className="mono mb-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[.12em] text-muted-foreground hover:text-primary transition-colors" data-testid="link-back-md">← ম্যানেজমেন্ট ডেস্ক</Link>;
}

function StatusToneFn(status: string): 'neutral' | 'good' | 'warn' | 'danger' | 'teal' {
  if (['DELIVERED', 'READY', 'QC'].includes(status)) return 'good';
  if (['IN_PRODUCTION', 'IN_DESIGN'].includes(status)) return 'teal';
  if (['SAMPLE_PENDING', 'SAMPLE_APPROVAL'].includes(status)) return 'warn';
  if (['CANCELLED'].includes(status)) return 'danger';
  return 'neutral';
}

function PriorityToneFn(priority: string): 'neutral' | 'good' | 'warn' | 'danger' | 'teal' {
  if (priority === 'URGENT') return 'danger';
  if (priority === 'HIGH') return 'warn';
  if (priority === 'NORMAL') return 'neutral';
  return 'teal';
}

function KpiJobsTable({ items }: { items: Job[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table w-full min-w-[680px] text-left">
        <thead><tr>
          <th className="px-5 py-3">জব নম্বর</th>
          <th className="px-5 py-3">ক্লায়েন্ট</th>
          <th className="px-5 py-3">ধরন</th>
          <th className="px-5 py-3">সেকশন</th>
          <th className="px-5 py-3">ডেলিভারি</th>
          <th className="px-5 py-3">প্রায়োরিটি</th>
          <th className="px-5 py-3">স্ট্যাটাস</th>
        </tr></thead>
        <tbody>
          {items.map(job => (
            <tr key={job.id} data-testid={`row-kpi-job-${job.id}`}>
              <td className="px-5 py-4"><Link href={`/reception/jobs/${job.id}`} className="text-sm font-bold text-primary hover:underline">{job.jobNumber}</Link></td>
              <td className="px-5 py-4 text-xs font-semibold">{job.companyName}</td>
              <td className="px-5 py-4 text-xs">{job.jobType}</td>
              <td className="px-5 py-4 text-xs">{job.printingSection}</td>
              <td className="px-5 py-4 text-xs">{date(job.expectedDeliveryDate?.toString())}{job.overdue && <span className="ml-2 text-destructive font-bold">⚠ বিলম্বিত</span>}</td>
              <td className="px-5 py-4"><Badge tone={PriorityToneFn(job.priority)}>{job.priority}</Badge></td>
              <td className="px-5 py-4"><Badge tone={StatusToneFn(job.status)}>{job.status.replaceAll('_', ' ')}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KpiJobCard({ job }: { job: Job }) {
  const borderColors: Record<string, string> = {
    URGENT: 'border-l-red-500',
    HIGH: 'border-l-amber-500',
    NORMAL: 'border-l-blue-400',
    LOW: 'border-l-slate-300',
  };
  const bgHovers: Record<string, string> = {
    URGENT: 'hover:bg-red-50/50',
    HIGH: 'hover:bg-amber-50/50',
    NORMAL: 'hover:bg-blue-50/30',
    LOW: 'hover:bg-slate-50/30',
  };
  return (
    <Link
      href={`/reception/jobs/${job.id}`}
      className={`group block rounded-xl border border-border border-l-4 bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${borderColors[job.priority] ?? borderColors.NORMAL} ${bgHovers[job.priority] ?? bgHovers.NORMAL}`}
      data-testid={`card-kpi-job-${job.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-extrabold text-primary">{job.jobNumber}</span>
            <Badge tone={StatusToneFn(job.status)}>{job.status.replaceAll('_', ' ')}</Badge>
            <Badge tone={PriorityToneFn(job.priority)}>{job.priority}</Badge>
          </div>
          <p className="mt-1.5 truncate text-sm font-bold text-foreground">{job.companyName}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{job.jobType} · {job.printingSection}</p>
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <div className="flex items-center gap-1.5 text-xs">
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
          <span className={job.overdue ? 'font-bold text-destructive' : 'text-muted-foreground'}>
            {date(job.expectedDeliveryDate?.toString())}{job.overdue ? ' ⚠ বিলম্বিত' : ''}
          </span>
        </div>
        <span className="mono max-w-[120px] truncate text-[10px] text-muted-foreground">{job.contactPerson}</span>
      </div>
    </Link>
  );
}

function KpiTodayJobs() {
  const [oldSearch, setOldSearch] = useState('');
  const [oldStatus, setOldStatus] = useState('');
  const { data: allData, isLoading, isError, refetch } = useListJobs({ page: 1, pageSize: 500 });
  const today = new Date().toISOString().slice(0, 10);
  const allItems = allData?.items ?? [];
  const todayItems = allItems.filter(j => j.createdAt.toString().slice(0, 10) === today);
  const oldItemsRaw = allItems.filter(j => j.createdAt.toString().slice(0, 10) !== today);
  const oldItems = oldItemsRaw
    .filter(j => !oldStatus || j.status === oldStatus)
    .filter(j => !oldSearch ||
      j.jobNumber.toLowerCase().includes(oldSearch.toLowerCase()) ||
      j.companyName.toLowerCase().includes(oldSearch.toLowerCase()) ||
      j.jobType.toLowerCase().includes(oldSearch.toLowerCase())
    );
  const urgentCount = todayItems.filter(j => j.priority === 'URGENT').length;
  const activeCount = todayItems.filter(j => !(['DELIVERED', 'CANCELLED'] as string[]).includes(j.status)).length;
  const overdueCount = todayItems.filter(j => j.overdue).length;
  return (
    <Shell><div className="page-enter">
      <KpiBackLink />
      <PageHeader
        eyebrow="ম্যানেজমেন্ট / আজকের জব"
        title="আজকের জব।"
        detail="আজ তৈরি বা আপডেট হওয়া সব কারখানার কাজ।"
        action={<Button onClick={() => refetch()} variant="secondary" testId="button-refresh-today-jobs"><RefreshCw className="h-3.5 w-3.5" />রিফ্রেশ</Button>}
      />

      {/* ── 4-column stat grid ── */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/60 px-6 py-5 shadow-sm">
          <div className="flex items-start justify-between">
            <p className="mono text-[9px] uppercase tracking-widest text-blue-500">মোট জব আজ</p>
            <ClipboardList className="h-5 w-5 text-blue-400" />
          </div>
          <p className="display mt-3 text-4xl font-extrabold text-blue-700">{isLoading ? '…' : bengaliNumber(todayItems.length)}</p>
          <p className="mt-2 text-[10px] font-medium text-blue-400">আজকের মোট কাজ</p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/60 px-6 py-5 shadow-sm">
          <div className="flex items-start justify-between">
            <p className="mono text-[9px] uppercase tracking-widest text-orange-500">চলমান জব</p>
            <BriefcaseBusiness className="h-5 w-5 text-orange-400" />
          </div>
          <p className="display mt-3 text-4xl font-extrabold text-orange-700">{isLoading ? '…' : bengaliNumber(activeCount)}</p>
          <p className="mt-2 text-[10px] font-medium text-orange-400">সক্রিয় কাজ</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100/60 px-6 py-5 shadow-sm">
          <div className="flex items-start justify-between">
            <p className="mono text-[9px] uppercase tracking-widest text-red-500">বিলম্বিত</p>
            <CircleAlert className="h-5 w-5 text-red-400" />
          </div>
          <p className="display mt-3 text-4xl font-extrabold text-red-700">{isLoading ? '…' : bengaliNumber(overdueCount)}</p>
          <p className="mt-2 text-[10px] font-medium text-red-400">ডেডলাইন পার</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/60 px-6 py-5 shadow-sm">
          <div className="flex items-start justify-between">
            <p className="mono text-[9px] uppercase tracking-widest text-amber-500">URGENT</p>
            <ActivityIcon className="h-5 w-5 text-amber-400" />
          </div>
          <p className="display mt-3 text-4xl font-extrabold text-amber-700">{isLoading ? '…' : bengaliNumber(urgentCount)}</p>
          <p className="mt-2 text-[10px] font-medium text-amber-400">জরুরি প্রায়োরিটি</p>
        </div>
      </div>

      {/* ── Today's jobs — clickable cards ── */}
      <SectionCard
        title={`আজকের জব — ${bengaliToday()}`}
        action={<Link href="/reception/jobs/new" className="inline-flex min-h-8 items-center gap-2 rounded-sm bg-primary px-3 text-xs font-extrabold text-primary-foreground" data-testid="link-new-job-today"><Plus className="h-3.5 w-3.5" />নতুন জব</Link>}
      >
        {isLoading ? <LoadingRows /> : isError ? <ErrorState retry={refetch} /> : todayItems.length ? (
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            {todayItems.map(job => <KpiJobCard key={job.id} job={job} />)}
          </div>
        ) : (
          <EmptyState title="আজ কোনো জব নেই" detail="আজকের কাজের রেকর্ড এখানে দেখাবে।" action={<Link href="/reception/jobs/new" className="inline-flex min-h-9 items-center gap-2 rounded-sm bg-primary px-4 text-xs font-bold text-primary-foreground"><Plus className="h-4 w-4" />নতুন জব নিন</Link>} />
        )}
      </SectionCard>

      {/* ── Old jobs section ── */}
      <div className="mt-8">
        <div className="mb-4">
          <p className="mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">পুরনো জব</p>
          <h2 className="display mt-1 text-2xl font-extrabold">আগের সব কাজ</h2>
          <p className="mt-1 text-sm text-muted-foreground">আজকের আগের সমস্ত জবের রেকর্ড।</p>
        </div>
        <SectionCard>
          <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={oldSearch}
                onChange={e => setOldSearch(e.target.value)}
                placeholder="জব নম্বর, ক্লায়েন্ট বা ধরন খুঁজুন"
                data-testid="input-search-old-jobs"
                className="h-10 w-full rounded-sm border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <select value={oldStatus} onChange={e => setOldStatus(e.target.value)} data-testid="select-old-job-status" className="h-10 w-full appearance-none rounded-sm border border-input bg-background pl-9 pr-8 text-xs font-semibold outline-none focus:border-primary md:w-52">
                <option value="">সব স্ট্যাটাস</option>
                {Object.values(JobStatus).map(s => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          {isLoading ? <LoadingRows /> : oldItems.length ? (
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {oldItems.map(job => <KpiJobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <EmptyState title="কোনো পুরনো জব নেই" detail="ফিল্টার পরিবর্তন করুন বা নতুন জব যোগ করুন।" />
          )}
        </SectionCard>
      </div>
    </div></Shell>
  );
}

function KpiActiveJobs() {
  const { data, isLoading, isError, refetch } = useListJobs({ status: JobStatus.RECEIVED, page: 1, pageSize: 100 });
  const { data: dataDesign } = useListJobs({ status: JobStatus.IN_DESIGN, page: 1, pageSize: 100 });
  const items = [...(data?.items ?? []), ...(dataDesign?.items ?? [])];
  return (
    <Shell><div className="page-enter">
      <KpiBackLink />
      <PageHeader eyebrow="ম্যানেজমেন্ট / চলমান জব" title="চলমান জব।" detail="Received এবং In Design-এ থাকা সব কাজ।" />
      <div className="mb-5 flex gap-4">
        <div className="rounded-xl border border-orange-200 bg-orange-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-orange-500">মোট চলমান</p>
          <p className="display mt-2 text-3xl font-extrabold text-orange-700">{isLoading ? '…' : bengaliNumber(items.length)}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-amber-500">URGENT প্রায়োরিটি</p>
          <p className="display mt-2 text-3xl font-extrabold text-amber-700">{isLoading ? '…' : bengaliNumber(items.filter(j => j.priority === 'URGENT').length)}</p>
        </div>
      </div>
      <SectionCard title="চলমান জব তালিকা">
        {isLoading ? <LoadingRows /> : isError ? <ErrorState retry={refetch} /> : items.length ? <KpiJobsTable items={items} /> : <EmptyState title="কোনো চলমান জব নেই" detail="Received বা In Design-এ কাজ আসলে এখানে দেখাবে।" />}
      </SectionCard>
    </div></Shell>
  );
}

function KpiProduction() {
  const { data, isLoading, isError, refetch } = useListJobs({ status: JobStatus.IN_PRODUCTION, page: 1, pageSize: 100 });
  const { data: dataQc } = useListJobs({ status: JobStatus.QC, page: 1, pageSize: 100 });
  const items = [...(data?.items ?? []), ...(dataQc?.items ?? [])];
  return (
    <Shell><div className="page-enter">
      <KpiBackLink />
      <PageHeader eyebrow="ম্যানেজমেন্ট / উৎপাদন" title="উৎপাদনে চলছে।" detail="In Production ও QC-তে থাকা সব কারখানার কাজ।" />
      <div className="mb-5 flex gap-4">
        <div className="rounded-xl border border-teal-200 bg-teal-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-teal-500">উৎপাদনে</p>
          <p className="display mt-2 text-3xl font-extrabold text-teal-700">{isLoading ? '…' : bengaliNumber(data?.items.length ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-cyan-500">QC-তে</p>
          <p className="display mt-2 text-3xl font-extrabold text-cyan-700">{isLoading ? '…' : bengaliNumber(dataQc?.items.length ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-red-500">বিলম্বিত</p>
          <p className="display mt-2 text-3xl font-extrabold text-red-700">{isLoading ? '…' : bengaliNumber(items.filter(j => j.overdue).length)}</p>
        </div>
      </div>
      <SectionCard title="উৎপাদন তালিকা">
        {isLoading ? <LoadingRows /> : isError ? <ErrorState retry={refetch} /> : items.length ? <KpiJobsTable items={items} /> : <EmptyState title="উৎপাদনে কোনো জব নেই" detail="কাজ In Production-এ এলে এখানে দেখাবে।" />}
      </SectionCard>
    </div></Shell>
  );
}

function KpiReady() {
  const { data, isLoading, isError, refetch } = useListJobs({ status: JobStatus.READY, page: 1, pageSize: 100 });
  const items = data?.items ?? [];
  return (
    <Shell><div className="page-enter">
      <KpiBackLink />
      <PageHeader eyebrow="ম্যানেজমেন্ট / ডেলিভারি" title="ডেলিভারি প্রস্তুত।" detail="READY স্ট্যাটাসে থাকা জব — এখনই dispatch করা যাবে।" />
      <div className="mb-5 flex gap-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-emerald-500">শিপমেন্ট রেডি</p>
          <p className="display mt-2 text-3xl font-extrabold text-emerald-700">{isLoading ? '…' : bengaliNumber(items.length)}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-red-500">বিলম্বিত</p>
          <p className="display mt-2 text-3xl font-extrabold text-red-700">{isLoading ? '…' : bengaliNumber(items.filter(j => j.overdue).length)}</p>
        </div>
      </div>
      <SectionCard title="ডেলিভারির জন্য প্রস্তুত জব">
        {isLoading ? <LoadingRows /> : isError ? <ErrorState retry={refetch} /> : items.length ? <KpiJobsTable items={items} /> : <EmptyState title="কোনো জব রেডি নেই" detail="READY হওয়া জব এখানে দেখাবে।" />}
      </SectionCard>
    </div></Shell>
  );
}

function KpiReceivable() {
  const { data, isLoading, isError, refetch } = useListInvoices({ status: InvoiceStatus.UNPAID, page: 1, pageSize: 100 });
  const { data: partial } = useListInvoices({ status: InvoiceStatus.PARTIAL, page: 1, pageSize: 100 });
  const { data: overdue } = useListInvoices({ status: InvoiceStatus.OVERDUE, page: 1, pageSize: 100 });
  const items = [...(data?.items ?? []), ...(partial?.items ?? []), ...(overdue?.items ?? [])];
  const totalReceivable = items.reduce((s, i) => s + (i.grandTotal - (i.amountPaid ?? 0)), 0);
  return (
    <Shell><div className="page-enter">
      <KpiBackLink />
      <PageHeader eyebrow="ম্যানেজমেন্ট / বকেয়া" title="বকেয়া পাওনা।" detail="Unpaid, Partial ও Overdue ইনভয়েসের সম্পূর্ণ তালিকা।" />
      <div className="mb-5 flex flex-wrap gap-4">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-red-500">মোট বকেয়া</p>
          <p className="display mt-2 text-3xl font-extrabold text-red-700">{isLoading ? '…' : bengaliMoney(totalReceivable)}</p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-orange-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-orange-500">Overdue ইনভয়েস</p>
          <p className="display mt-2 text-3xl font-extrabold text-orange-700">{isLoading ? '…' : bengaliNumber(overdue?.items.length ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-amber-500">আংশিক পেমেন্ট</p>
          <p className="display mt-2 text-3xl font-extrabold text-amber-700">{isLoading ? '…' : bengaliNumber(partial?.items.length ?? 0)}</p>
        </div>
      </div>
      <SectionCard title="বকেয়া ইনভয়েস তালিকা">
        {isLoading ? <LoadingRows /> : isError ? <ErrorState retry={refetch} /> : items.length ? (
          <div className="overflow-x-auto">
            <table className="data-table w-full min-w-[640px] text-left">
              <thead><tr>
                <th className="px-5 py-3">ইনভয়েস</th>
                <th className="px-5 py-3">ক্লায়েন্ট</th>
                <th className="px-5 py-3">ডিউ তারিখ</th>
                <th className="px-5 py-3">স্ট্যাটাস</th>
                <th className="px-5 py-3 text-right">মোট</th>
                <th className="px-5 py-3 text-right">বকেয়া</th>
              </tr></thead>
              <tbody>
                {items.map(inv => (
                  <tr key={inv.id} data-testid={`row-kpi-invoice-${inv.id}`}>
                    <td className="px-5 py-4 text-sm font-bold text-primary">{inv.invoiceNumber}</td>
                    <td className="px-5 py-4 text-xs font-semibold">{inv.companyName}</td>
                    <td className="px-5 py-4 text-xs">{date(inv.dueDate)}</td>
                    <td className="px-5 py-4"><Badge tone={inv.status === InvoiceStatus.OVERDUE ? 'danger' : inv.status === InvoiceStatus.PARTIAL ? 'warn' : 'neutral'}>{inv.status}</Badge></td>
                    <td className="px-5 py-4 text-right text-sm font-bold">{money(inv.grandTotal)}</td>
                    <td className="px-5 py-4 text-right text-sm font-extrabold text-destructive">{money(inv.grandTotal - (inv.amountPaid ?? 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState title="কোনো বকেয়া নেই" detail="সব পেমেন্ট আদায় হয়েছে।" />}
      </SectionCard>
    </div></Shell>
  );
}

function KpiRevenue() {
  const { data, isLoading, isError, refetch } = useListLedgerEntries({ range: 'month', page: 1, pageSize: 100 });
  const incomeItems = (data?.items ?? []).filter(e => e.type === LedgerType.INCOME);
  const totalIncome = incomeItems.reduce((s, e) => s + e.amount, 0);
  const byCategory: Record<string, number> = {};
  for (const e of incomeItems) byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
  return (
    <Shell><div className="page-enter">
      <KpiBackLink />
      <PageHeader eyebrow="ম্যানেজমেন্ট / মাসের আয়" title="মাসের আয়।" detail="এই মাসে রেকর্ড করা সমস্ত আয়ের বিস্তারিত।" />
      <div className="mb-5 flex flex-wrap gap-4">
        <div className="rounded-xl border border-violet-200 bg-violet-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-violet-500">মোট আয় এই মাসে</p>
          <p className="display mt-2 text-3xl font-extrabold text-violet-700">{isLoading ? '…' : bengaliMoney(totalIncome)}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-emerald-500">এন্ট্রি সংখ্যা</p>
          <p className="display mt-2 text-3xl font-extrabold text-emerald-700">{isLoading ? '…' : bengaliNumber(incomeItems.length)}</p>
        </div>
      </div>
      {!isLoading && Object.keys(byCategory).length > 0 && (
        <div className="mb-5 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-extrabold">ক্যাটাগরি অনুযায়ী আয়</h2>
          <div className="space-y-3">
            {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="w-32 truncate text-xs font-semibold">{cat}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-violet-400 rounded-full" style={{ width: `${totalIncome ? Math.min(100, amt / totalIncome * 100) : 0}%` }} />
                </div>
                <span className="text-xs font-extrabold text-violet-700">{money(amt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <SectionCard title="আয়ের এন্ট্রি তালিকা">
        {isLoading ? <LoadingRows /> : isError ? <ErrorState retry={refetch} /> : incomeItems.length ? (
          <div className="overflow-x-auto">
            <table className="data-table w-full min-w-[580px] text-left">
              <thead><tr>
                <th className="px-5 py-3">তারিখ</th>
                <th className="px-5 py-3">ক্যাটাগরি</th>
                <th className="px-5 py-3">বিবরণ</th>
                <th className="px-5 py-3 text-right">পরিমাণ</th>
              </tr></thead>
              <tbody>
                {incomeItems.map(e => (
                  <tr key={e.id}><td className="px-5 py-4 text-xs">{date(e.date)}</td><td className="px-5 py-4 text-xs font-semibold">{e.category}</td><td className="px-5 py-4 text-xs">{e.description}</td><td className="px-5 py-4 text-right text-sm font-extrabold text-emerald-600">{money(e.amount)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState title="এই মাসে কোনো আয় নেই" detail="Accounting থেকে income entry যোগ করুন।" action={<Link href="/accounting" className="inline-flex min-h-9 items-center gap-2 rounded-sm bg-primary px-4 text-xs font-bold text-primary-foreground"><Plus className="h-4 w-4" />আয় যোগ করুন</Link>} />}
      </SectionCard>
    </div></Shell>
  );
}

function KpiExpenses() {
  const { data, isLoading, isError, refetch } = useListLedgerEntries({ range: 'month', page: 1, pageSize: 100 });
  const expenseItems = (data?.items ?? []).filter(e => e.type === LedgerType.EXPENSE);
  const totalExpense = expenseItems.reduce((s, e) => s + e.amount, 0);
  const byCategory: Record<string, number> = {};
  for (const e of expenseItems) byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
  return (
    <Shell><div className="page-enter">
      <KpiBackLink />
      <PageHeader eyebrow="ম্যানেজমেন্ট / মাসের খরচ" title="মাসের খরচ।" detail="এই মাসে রেকর্ড করা সমস্ত খরচের বিস্তারিত।" />
      <div className="mb-5 flex flex-wrap gap-4">
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-cyan-500">মোট খরচ এই মাসে</p>
          <p className="display mt-2 text-3xl font-extrabold text-cyan-700">{isLoading ? '…' : bengaliMoney(totalExpense)}</p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-orange-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-orange-500">এন্ট্রি সংখ্যা</p>
          <p className="display mt-2 text-3xl font-extrabold text-orange-700">{isLoading ? '…' : bengaliNumber(expenseItems.length)}</p>
        </div>
      </div>
      {!isLoading && Object.keys(byCategory).length > 0 && (
        <div className="mb-5 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-extrabold">ক্যাটাগরি অনুযায়ী খরচ</h2>
          <div className="space-y-3">
            {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="w-32 truncate text-xs font-semibold">{cat}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${totalExpense ? Math.min(100, amt / totalExpense * 100) : 0}%` }} />
                </div>
                <span className="text-xs font-extrabold text-cyan-700">{money(amt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <SectionCard title="খরচের এন্ট্রি তালিকা">
        {isLoading ? <LoadingRows /> : isError ? <ErrorState retry={refetch} /> : expenseItems.length ? (
          <div className="overflow-x-auto">
            <table className="data-table w-full min-w-[580px] text-left">
              <thead><tr>
                <th className="px-5 py-3">তারিখ</th>
                <th className="px-5 py-3">ক্যাটাগরি</th>
                <th className="px-5 py-3">বিবরণ</th>
                <th className="px-5 py-3 text-right">পরিমাণ</th>
              </tr></thead>
              <tbody>
                {expenseItems.map(e => (
                  <tr key={e.id}><td className="px-5 py-4 text-xs">{date(e.date)}</td><td className="px-5 py-4 text-xs font-semibold">{e.category}</td><td className="px-5 py-4 text-xs">{e.description}</td><td className="px-5 py-4 text-right text-sm font-extrabold text-cyan-600">{money(e.amount)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState title="এই মাসে কোনো খরচ নেই" detail="Accounting থেকে expense entry যোগ করুন।" action={<Link href="/accounting" className="inline-flex min-h-9 items-center gap-2 rounded-sm bg-primary px-4 text-xs font-bold text-primary-foreground"><Plus className="h-4 w-4" />খরচ যোগ করুন</Link>} />}
      </SectionCard>
    </div></Shell>
  );
}

function KpiProfit() {
  const { data, isLoading, isError, refetch } = useListLedgerEntries({ range: 'month', page: 1, pageSize: 100 });
  const items = data?.items ?? [];
  const totalIncome = items.filter(e => e.type === LedgerType.INCOME).reduce((s, e) => s + e.amount, 0);
  const totalExpense = items.filter(e => e.type === LedgerType.EXPENSE).reduce((s, e) => s + e.amount, 0);
  const profit = totalIncome - totalExpense;
  const margin = totalIncome > 0 ? Math.round((profit / totalIncome) * 100) : 0;
  const isPositive = profit >= 0;
  return (
    <Shell><div className="page-enter">
      <KpiBackLink />
      <PageHeader eyebrow="ম্যানেজমেন্ট / লাভ" title="আনুমানিক লাভ।" detail="এই মাসের আয় ও খরচের পার্থক্য থেকে অনুমানিত মুনাফা।" />
      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-violet-200 bg-violet-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-violet-500">মোট আয়</p>
          <p className="display mt-2 text-2xl font-extrabold text-violet-700">{isLoading ? '…' : bengaliMoney(totalIncome)}</p>
        </div>
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-6 py-4">
          <p className="mono text-[9px] uppercase tracking-widest text-cyan-500">মোট খরচ</p>
          <p className="display mt-2 text-2xl font-extrabold text-cyan-700">{isLoading ? '…' : bengaliMoney(totalExpense)}</p>
        </div>
        <div className={`rounded-xl border px-6 py-4 ${isPositive ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
          <p className={`mono text-[9px] uppercase tracking-widest ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>আনুমানিক লাভ</p>
          <p className={`display mt-2 text-2xl font-extrabold ${isPositive ? 'text-emerald-700' : 'text-red-700'}`}>{isLoading ? '…' : bengaliMoney(profit)}</p>
        </div>
        <div className={`rounded-xl border px-6 py-4 ${isPositive ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
          <p className={`mono text-[9px] uppercase tracking-widest ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>লাভের মার্জিন</p>
          <p className={`display mt-2 text-2xl font-extrabold ${isPositive ? 'text-emerald-700' : 'text-red-700'}`}>{isLoading ? '…' : `${margin}%`}</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-sm font-extrabold">আয় বনাম খরচ</h2>
        {isLoading ? <Skeleton className="h-8 w-full" /> : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs font-semibold text-violet-600">আয়</span>
              <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-violet-400 rounded-full transition-all" style={{ width: `${totalIncome > 0 ? 100 : 0}%` }} />
              </div>
              <span className="text-sm font-extrabold">{money(totalIncome)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs font-semibold text-cyan-600">খরচ</span>
              <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${totalIncome > 0 ? Math.min(100, totalExpense / totalIncome * 100) : 0}%` }} />
              </div>
              <span className="text-sm font-extrabold">{money(totalExpense)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`w-16 text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>লাভ</span>
              <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full transition-all ${isPositive ? 'bg-emerald-400' : 'bg-red-400'}`} style={{ width: `${totalIncome > 0 ? Math.min(100, Math.abs(profit) / totalIncome * 100) : 0}%` }} />
              </div>
              <span className={`text-sm font-extrabold ${isPositive ? 'text-emerald-600' : 'text-destructive'}`}>{money(profit)}</span>
            </div>
          </div>
        )}
      </div>
      <div className="mt-5 flex gap-3">
        <Link href="/md/kpi/revenue" className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-border bg-card px-4 text-xs font-bold hover:border-violet-300 transition-colors">আয়ের বিস্তারিত →</Link>
        <Link href="/md/kpi/expenses" className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-border bg-card px-4 text-xs font-bold hover:border-cyan-300 transition-colors">খরচের বিস্তারিত →</Link>
      </div>
      {isError && <ErrorState retry={refetch} />}
    </div></Shell>
  );
}

function AppRoutes() {
  return <Switch><Route path="/" component={Landing} /><Route path="/sign-in/*?" component={AuthPage} /><Route path="/change-password" component={ChangePassword} /><Route path="/md/kpi/today-jobs" component={KpiTodayJobs} /><Route path="/md/kpi/active-jobs" component={KpiActiveJobs} /><Route path="/md/kpi/production" component={KpiProduction} /><Route path="/md/kpi/ready" component={KpiReady} /><Route path="/md/kpi/receivable" component={KpiReceivable} /><Route path="/md/kpi/revenue" component={KpiRevenue} /><Route path="/md/kpi/expenses" component={KpiExpenses} /><Route path="/md/kpi/profit" component={KpiProfit} /><Route path="/md" component={Management} /><Route path="/reception" component={Reception} /><Route path="/reception/jobs/new" component={NewJob} /><Route path="/reception/jobs/:id" component={JobDetailPage} /><Route path="/reception/jobs" component={Jobs} /><Route path="/clients/:id" component={CompanyDetailPage} /><Route path="/clients" component={Clients} /><Route path="/billing/invoices" component={Invoices} /><Route path="/billing/payments" component={Payments} /><Route path="/billing" component={Billing} /><Route path="/accounting" component={Accounting} /><Route path="/admin/users" component={UsersPage} /><Route path="/admin/audit-logs" component={AuditLogs} /><Route path="/settings" component={Settings} /><Route component={NotFound} /></Switch>;
}

function App() { return <QueryClientProvider client={queryClient}><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><AppRoutes /></WouterRouter></QueryClientProvider>; }
export default App;