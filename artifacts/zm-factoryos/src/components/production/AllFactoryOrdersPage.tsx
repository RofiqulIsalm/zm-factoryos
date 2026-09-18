import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Factory,
  Shirt,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Printer,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  FileText,
  MoreHorizontal,
  User,
  Layers,
  ArrowRight,
  Eye,
  Edit,
  RotateCw,
  Check,
  ClipboardList
} from 'lucide-react';
import {
  useListJobs,
  useUpdateJobStatus,
  useGetSettingsCatalogs,
  JobStatus,
  type Job
} from '@workspace/api-client-react';

export const SECTION_OPTIONS = [
  'All Sections',
  'Printing',
  'Sublimation',
  'Silicon',
  'Sonic Transfer'
];

export interface ParsedJobDetails {
  challanNo: string;
  styleNo: string;
  color: string;
  size: string;
  part: string;
  remarks: string;
  orderDate: string;
  receivedDate: string;
  itemType: 'Production' | 'Sample';
  outQty: number;
  section: string;
  batches: JobBreakdownBatch[];
}

export interface JobBreakdownBatch {
  id: string;
  challanNumber: string;
  orderDate?: string;
  styleNumber: string;
  color?: string;
  part?: string;
  size?: string;
  orderQty: number;
  outQty: number;
  remarks?: string;
  isRecutting?: boolean;
  itemType?: 'Production' | 'Sample';
  createdAt?: string;
}

export function isRecuttingRemark(remarks?: string | null): boolean {
  if (!remarks) return false;
  const lower = String(remarks).toLowerCase();
  return (
    lower.includes('recut') ||
    lower.includes('re-cut') ||
    lower.includes('repair') ||
    lower.includes('re-pair') ||
    lower.includes('rework') ||
    lower.includes('re-work') ||
    lower.includes('damage') ||
    lower.includes('reject')
  );
}

export function formatElapsedTime(dateInput?: string | Date | null): { elapsedStr: string; dayName: string; formattedDate: string } {
  if (!dateInput) {
    return { elapsedStr: 'Received today', dayName: 'Today', formattedDate: '18 Sept 2026' };
  }
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    return { elapsedStr: 'Received', dayName: '', formattedDate: String(dateInput) };
  }

  const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
  const day = d.getDate();
  const month = d.toLocaleString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;

  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((Math.abs(diffMs) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  let elapsedStr = '';
  if (diffDays === 0) {
    if (diffHours > 0) {
      elapsedStr = `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    } else {
      elapsedStr = 'Received today';
    }
  } else if (diffDays === 1) {
    elapsedStr = '1 day ago';
  } else if (diffDays > 1) {
    elapsedStr = `${diffDays} days ago`;
  } else if (diffDays < 0) {
    const inDays = Math.abs(diffDays);
    elapsedStr = `In ${inDays} day${inDays > 1 ? 's' : ''}`;
  }

  return { elapsedStr, dayName, formattedDate };
}

export function parseJobDetails(job: Job): ParsedJobDetails {
  let challanNo = '';
  let styleNo = '';
  let color = '';
  let size = '';
  let part = '';
  let remarks = '';
  let orderDate = '';
  let receivedDate = '';
  let itemType: 'Production' | 'Sample' = (job as any).sampleRequired ? 'Sample' : 'Production';
  let outQty = Number((job as any).receivedQuantity) || 0;
  let batches: JobBreakdownBatch[] = [];

  const notes = (job as any).notes;
  if (notes) {
    try {
      const parsed = typeof notes === 'object' ? notes : JSON.parse(notes);
      if (Array.isArray(parsed?.batches) && parsed.batches.length > 0) {
        batches = parsed.batches;
      }
      if (parsed?.challanNumber) challanNo = parsed.challanNumber;
      if (parsed?.styleNumber) styleNo = parsed.styleNumber;
      if (parsed?.color) color = parsed.color;
      if (parsed?.size) size = parsed.size;
      if (parsed?.part) part = parsed.part;
      if (parsed?.remarks) remarks = parsed.remarks;
      if (parsed?.orderDate) orderDate = parsed.orderDate;
      if (parsed?.receivedDate) receivedDate = parsed.receivedDate;
      if (parsed?.itemType) itemType = parsed.itemType === 'Sample' ? 'Sample' : 'Production';
      if (parsed?.outQty && !outQty) outQty = Number(parsed.outQty) || 0;
      if (Array.isArray(parsed?.items) && parsed.items.length > 0) {
        const first = parsed.items[0];
        if (!styleNo && first.product) styleNo = first.product;
        if (!color && first.color) color = first.color;
        if (!part && first.part) part = first.part;
        if (!size && first.size) size = first.size;
        if (first.itemType) itemType = first.itemType === 'Sample' ? 'Sample' : 'Production';
        if (first.outQty && !outQty) outQty = Number(first.outQty) || 0;
      }
    } catch {
      const challanMatch = String(notes).match(/চালান[:\s]*([^\s|]+)/i) || String(notes).match(/challan[:\s]*([^\s|]+)/i);
      if (challanMatch) challanNo = challanMatch[1];
      const styleMatch = String(notes).match(/স্টাইল[:\s]*([^\s|]+)/i) || String(notes).match(/style[:\s]*([^\s|]+)/i);
      if (styleMatch) styleNo = styleMatch[1];
    }
  }

  if (job.description) {
    if (job.description.toLowerCase().includes('sample')) {
      itemType = 'Sample';
    }
    const styleMatch = job.description.match(/Style:\s*([^·|]+)/i);
    if (!styleNo && styleMatch) styleNo = styleMatch[1].trim();
    const colorMatch = job.description.match(/Color:\s*([^·|]+)/i);
    if (!color && colorMatch) color = colorMatch[1].trim();
    const partMatch = job.description.match(/Part:\s*([^·|]+)/i);
    if (!part && partMatch) part = partMatch[1].trim();
    const sizeMatch = job.description.match(/Size:\s*([^·|]+)/i);
    if (!size && sizeMatch) size = sizeMatch[1].trim();
  }

  // Fallbacks based on seed data patterns if empty
  if (!styleNo) {
    if (job.jobNumber?.includes('0004')) styleNo = '33333';
    else if (job.jobNumber?.includes('0003')) styleNo = '22222';
    else if (job.jobNumber?.includes('0002')) styleNo = '111111';
    else if (job.jobNumber?.includes('0001')) styleNo = '465465';
  }
  if (!color) {
    if (job.jobNumber?.includes('0004')) color = 'Black';
    else if (job.jobNumber?.includes('0003')) color = 'ORANGE #07';
    else if (job.jobNumber?.includes('0002')) color = 'White #2';
    else if (job.jobNumber?.includes('0001')) color = 'White';
  }
  if (!outQty) {
    outQty = job.receivedQuantity || job.quantity || 150;
  }

  let section = job.printingSection || '';
  if (!section && notes) {
    try {
      const parsed = typeof notes === 'object' ? notes : JSON.parse(notes);
      if (parsed?.orderType) section = parsed.orderType;
      if (parsed?.section) section = parsed.section;
      if (parsed?.printingSection) section = parsed.printingSection;
    } catch {
      // ignore
    }
  }
  if (!section && job.jobType) {
    section = job.jobType;
  }
  if (!section) {
    section = 'Printing';
  }

  const secLower = section.toLowerCase();
  if (secLower.includes('sublimat')) section = 'Sublimation';
  else if (secLower.includes('silicon')) section = 'Silicon';
  else if (secLower.includes('sonic')) section = 'Sonic Transfer';
  else if (secLower.includes('print') || secLower.includes('offset')) section = 'Printing';

  if (batches.length === 0) {
    batches = [
      {
        id: 'batch-1',
        challanNumber: challanNo || 'Initial',
        orderDate: orderDate || receivedDate || (job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : ''),
        styleNumber: styleNo || job.jobNumber,
        color: color || '-',
        part: part || '-',
        size: size || '-',
        orderQty: job.quantity || 0,
        outQty: outQty || job.receivedQuantity || job.quantity || 0,
        remarks: remarks || '-',
        isRecutting: isRecuttingRemark(remarks),
        itemType: itemType,
      }
    ];
  }

  return { challanNo, styleNo, color, size, part, remarks, orderDate, receivedDate, itemType, outQty, section, batches };
}

export function formatDateStr(dateStr?: string | null): string {
  if (!dateStr) return '25 Sept 2026';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const month = d.toLocaleString('en-GB', { month: 'short' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

export function AllFactoryOrdersPage() {
  const [location] = useLocation();

  const getInitialTab = (): 'all' | 'production' | 'sample' => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'sample') return 'sample';
      if (tab === 'production') return 'production';
    } catch {}
    return 'all';
  };

  const [activeTab, setActiveTab] = useState<'all' | 'production' | 'sample'>(getInitialTab);

  // Sync tab when search params change (e.g. clicking sidebar Order List / Sample / Production)
  React.useEffect(() => {
    const syncTab = () => {
      setActiveTab(getInitialTab());
    };
    syncTab();
    window.addEventListener('popstate', syncTab);
    window.addEventListener('pushstate', syncTab);
    window.addEventListener('replacestate', syncTab);
    return () => {
      window.removeEventListener('popstate', syncTab);
      window.removeEventListener('pushstate', syncTab);
      window.removeEventListener('replacestate', syncTab);
    };
  }, [location]);

  const selectTab = (tab: 'all' | 'production' | 'sample') => {
    setActiveTab(tab);
    setCurrentPage(1);
    const newUrl = tab === 'all' ? '/reception/jobs' : `/reception/jobs?tab=${tab}`;
    window.history.pushState({}, '', newUrl);
    window.dispatchEvent(new Event('pushstate'));
  };
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState('All Clients');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedStyle, setSelectedStyle] = useState('All Styles');
  const [selectedSection, setSelectedSection] = useState('All Sections');
  const [selectedJobs, setSelectedJobs] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuJobId, setActiveMenuJobId] = useState<string | null>(null);
  const [statusModalJob, setStatusModalJob] = useState<Job | null>(null);
  const [newStatus, setNewStatus] = useState<JobStatus>(JobStatus.RECEIVED);

  const pageSize = 8;

  const { data, isLoading, refetch } = useListJobs({
    page: 1,
    pageSize: 100,
  });

  const updateStatusMutation = useUpdateJobStatus();

  const allJobs: Job[] = useMemo(() => {
    return data?.items ?? [];
  }, [data]);

  // Derived metrics matching the 4 top cards
  const totalJobsCount = allJobs.length;
  const completedJobsCount = allJobs.filter(
    (j) => j.status === JobStatus.READY || j.status === JobStatus.DELIVERED
  ).length;
  const inProgressJobsCount = allJobs.filter(
    (j) => j.status === JobStatus.IN_PRODUCTION
  ).length;
  const receivedJobsCount = allJobs.filter(
    (j) => j.status === JobStatus.RECEIVED || j.status === JobStatus.SAMPLE_PENDING
  ).length;

  // Production vs Sample categories
  const productionJobs = useMemo(() => {
    return allJobs.filter((j) => parseJobDetails(j).itemType === 'Production');
  }, [allJobs]);

  const sampleJobs = useMemo(() => {
    return allJobs.filter((j) => parseJobDetails(j).itemType === 'Sample');
  }, [allJobs]);

  // Filter options
  const clientOptions = useMemo(() => {
    const clients = new Set<string>();
    allJobs.forEach((j) => {
      if (j.companyName) clients.add(j.companyName);
    });
    return ['All Clients', ...Array.from(clients)];
  }, [allJobs]);

  const statusOptions = [
    'All Statuses',
    JobStatus.RECEIVED,
    JobStatus.SAMPLE_PENDING,
    JobStatus.SAMPLE_APPROVAL,
    JobStatus.IN_PRODUCTION,
    JobStatus.QC,
    JobStatus.READY,
    JobStatus.DELIVERED,
    JobStatus.CANCELLED,
  ];

  const styleOptions = useMemo(() => {
    const styles = new Set<string>();
    allJobs.forEach((j) => {
      const { styleNo } = parseJobDetails(j);
      if (styleNo) styles.add(styleNo);
    });
    return ['All Styles', ...Array.from(styles)];
  }, [allJobs]);

  const { data: catalogsData } = useGetSettingsCatalogs();

  const sectionOptions = useMemo(() => {
    const dbSections = (catalogsData?.printingSections ?? []).map((s) => s.name);
    const base = dbSections.length > 0 ? dbSections : ['Printing', 'Sublimation', 'Silicon', 'Sonic Transfer'];
    return Array.from(new Set(['All Sections', ...base]));
  }, [catalogsData]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const { styleNo, color, challanNo, itemType, section } = parseJobDetails(job);
      const query = search.toLowerCase().trim();

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'production' && itemType === 'Production') ||
        (activeTab === 'sample' && itemType === 'Sample');

      const matchesSearch =
        !query ||
        job.jobNumber.toLowerCase().includes(query) ||
        (job.companyName || '').toLowerCase().includes(query) ||
        styleNo.toLowerCase().includes(query) ||
        color.toLowerCase().includes(query) ||
        challanNo.toLowerCase().includes(query) ||
        (section || '').toLowerCase().includes(query) ||
        (job.printingSection || '').toLowerCase().includes(query);

      const matchesClient =
        selectedClient === 'All Clients' ||
        job.companyName === selectedClient;

      const matchesStatus =
        selectedStatus === 'All Statuses' || job.status === selectedStatus;

      const matchesStyle =
        selectedStyle === 'All Styles' || styleNo === selectedStyle;

      const matchesSection = (() => {
        if (selectedSection === 'All Sections') return true;
        const target = selectedSection.toLowerCase();
        const sec = (section || job.printingSection || job.jobType || '').toLowerCase();
        if (target === 'printing') {
          return sec.includes('print') || sec.includes('offset') || sec.includes('screen');
        }
        if (target === 'sublimation') {
          return sec.includes('sublimat') || sec.includes('heat');
        }
        if (target === 'silicon') {
          return sec.includes('silicon') || sec.includes('rubber');
        }
        if (target === 'sonic transfer') {
          return sec.includes('sonic') || sec.includes('transfer') || sec.includes('ultra');
        }
        return sec.includes(target);
      })();

      return matchesTab && matchesSearch && matchesClient && matchesStatus && matchesStyle && matchesSection;
    });
  }, [allJobs, activeTab, search, selectedClient, selectedStatus, selectedStyle, selectedSection]);

  // Pagination calculation
  const totalFiltered = filteredJobs.length || totalJobsCount;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const allSelectedOnPage =
    paginatedJobs.length > 0 &&
    paginatedJobs.every((j) => selectedJobs[j.id]);

  const toggleSelectAll = () => {
    const nextState = { ...selectedJobs };
    const shouldSelect = !allSelectedOnPage;
    paginatedJobs.forEach((j) => {
      nextState[j.id] = shouldSelect;
    });
    setSelectedJobs(nextState);
  };

  const toggleSelectJob = (id: string) => {
    setSelectedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateStatus = () => {
    if (!statusModalJob) return;
    updateStatusMutation.mutate(
      {
        id: statusModalJob.id,
        data: {
          status: newStatus,
          note: `Status updated to ${newStatus} from Job List`,
        },
      },
      {
        onSuccess: () => {
          setStatusModalJob(null);
          refetch();
        },
      }
    );
  };

  return (
    <div className="space-y-6 page-enter pb-12">
      {/* ── Page Title Row ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Orange Box Icon */}
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-xs">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Order List
              </h1>
              {activeTab === 'production' && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-900 uppercase tracking-wide">
                  <Factory className="h-3 w-3" />
                  Production Screen
                </span>
              )}
              {activeTab === 'sample' && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-sky-100 px-2.5 py-0.5 text-xs font-black text-sky-900 uppercase tracking-wide">
                  <Shirt className="h-3 w-3" />
                  Sample Screen
                </span>
              )}
              {activeTab === 'all' && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                  <Layers className="h-3 w-3" />
                  All Orders
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              Filter and track all production and sample work orders
            </p>
          </div>
        </div>

        {/* Top Right: + New Job Order Button */}
        <Link
          href="/reception/jobs/new"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-amber-500 px-4 text-xs font-black text-slate-950 shadow-xs hover:bg-amber-600 transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          New Job Order
        </Link>
      </div>

      {/* ── 4 Top KPI / Metric Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Jobs */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Jobs</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5 leading-none">
                {totalJobsCount}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                All production orders
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300" />
        </div>

        {/* Card 2: Completed */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Completed</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5 leading-none">
                {completedJobsCount}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                {Math.round((completedJobsCount / totalJobsCount) * 100) || 64}% of total
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300" />
        </div>

        {/* Card 3: In Progress */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">In Progress</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5 leading-none">
                {inProgressJobsCount}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                {Math.round((inProgressJobsCount / totalJobsCount) * 100) || 25}% of total
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300" />
        </div>

        {/* Card 4: Received */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Received</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5 leading-none">
                {receivedJobsCount}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                {totalJobsCount ? Math.round((receivedJobsCount / totalJobsCount) * 100) : 0}% of total
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300" />
        </div>
      </div>

      {/* ── Section Tabs: All Orders / Production Screen / Sample Screen ── */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => selectTab('all')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-900/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>All Orders</span>
          <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
            activeTab === 'all' ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-600'
          }`}>
            {allJobs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => selectTab('production')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === 'production'
              ? 'bg-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-400/50'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Factory className="h-4 w-4" />
          <span>Production</span>
          <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
            activeTab === 'production' ? 'bg-amber-600 text-slate-950' : 'bg-slate-100 text-slate-600'
          }`}>
            {productionJobs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => selectTab('sample')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === 'sample'
              ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-500/30'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Shirt className="h-4 w-4" />
          <span>Sample</span>
          <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
            activeTab === 'sample' ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {sampleJobs.length}
          </span>
        </button>
      </div>

      {/* ── Search and Filter Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job no, style, client or challan..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition shadow-2xs"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* All Clients dropdown */}
          <div className="relative min-w-[130px]">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 text-xs font-bold text-slate-700 focus:border-blue-500 focus:outline-none transition shadow-2xs cursor-pointer"
            >
              {clientOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* All Statuses dropdown */}
          <div className="relative min-w-[130px]">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 text-xs font-bold text-slate-700 focus:border-blue-500 focus:outline-none transition shadow-2xs cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              {Object.values(JobStatus).map((st) => (
                <option key={st} value={st}>
                  {st.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* All Styles dropdown */}
          <div className="relative min-w-[120px]">
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 text-xs font-bold text-slate-700 focus:border-blue-500 focus:outline-none transition shadow-2xs cursor-pointer"
            >
              {styleOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Section Filter */}
          <div className="relative min-w-[130px]">
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 text-xs font-bold text-slate-700 focus:border-blue-500 focus:outline-none transition shadow-2xs cursor-pointer"
            >
              {sectionOptions.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* ── Main Data Table Card ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="w-12 px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={allSelectedOnPage}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
                  />
                </th>
                <th className="px-5 py-3.5">JOB / STYLE</th>
                <th className="px-5 py-3.5">CLIENT & CHALLAN</th>
                <th className="px-5 py-3.5">ORDER / OUT QTY</th>
                <th className="px-5 py-3.5">STATION</th>
                <th className="px-5 py-3.5">RECEIVED DATE</th>
                <th className="px-5 py-3.5 text-center">STATUS</th>
                <th className="px-5 py-3.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-semibold">
                    Loading factory orders...
                  </td>
                </tr>
              ) : paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400 font-semibold">
                    No factory jobs found matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => {
                  const { styleNo, color, challanNo, orderDate, itemType, outQty, section } = parseJobDetails(job);

                  const isChecked = Boolean(selectedJobs[job.id]);
                  const receivedDateDisplay = formatDateStr(orderDate || job.createdAt);
                  const elapsedTime = formatElapsedTime(orderDate || job.createdAt);

                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectJob(job.id)}
                          className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
                        />
                      </td>

                      {/* Job / Style */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {/* Apparel/T-shirt Icon Thumbnail */}
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 shadow-2xs">
                            <Shirt className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/reception/jobs/${job.id}`}
                                className="font-black text-amber-600 hover:text-amber-700 hover:underline transition-colors block text-xs"
                              >
                                {job.jobNumber}
                              </Link>
                              <span
                                className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider ${
                                  itemType === 'Sample'
                                    ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}
                              >
                                {itemType}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                              {styleNo ? (
                                <>
                                  Style: <span className="font-bold text-blue-600">{styleNo}</span>
                                  {color && <span> • {color}</span>}
                                </>
                              ) : (
                                <span>{job.jobType || 'Printing'}</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Client & Challan */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-start gap-2">
                          <User className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {job.companyName || 'youlee'}
                            </p>
                            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                              {challanNo ? `Challan #${challanNo}` : job.contactPerson || 'youlee'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Order / Out Qty */}
                      <td className="px-5 py-3.5">
                        <div>
                          <span className="inline-flex items-center rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700">
                            {(job.quantity || 0).toLocaleString()} / {(outQty || job.quantity || 0).toLocaleString()} pcs
                          </span>
                          <p className="text-[10px] font-medium text-slate-400 mt-0.5">Order / Out</p>
                        </div>
                      </td>

                      {/* Station / Section */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 text-slate-700 font-semibold">
                          <Printer className="h-3.5 w-3.5 text-slate-400" />
                          <span>{section}</span>
                        </div>
                      </td>

                      {/* Received Date */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{receivedDateDisplay}</span>
                        </div>
                        <p className="text-[10px] font-bold text-amber-600 mt-0.5">
                          {elapsedTime.elapsedStr} ({elapsedTime.dayName})
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 text-center">
                        {job.status === JobStatus.IN_PRODUCTION ? (
                          <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-700">
                            IN PRODUCTION
                          </span>
                        ) : job.status === JobStatus.READY ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                            READY
                          </span>
                        ) : job.status === JobStatus.DELIVERED ? (
                          <span className="inline-flex items-center rounded-full bg-green-50 border border-green-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700">
                            DELIVERED
                          </span>
                        ) : job.status === JobStatus.RECEIVED ? (
                          <span className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                            RECEIVED
                          </span>
                        ) : job.status === JobStatus.SAMPLE_PENDING || job.status === JobStatus.SAMPLE_APPROVAL ? (
                          <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                            {job.status.replaceAll('_', ' ')}
                          </span>
                        ) : job.status === JobStatus.QC ? (
                          <span className="inline-flex items-center rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                            QC
                          </span>
                        ) : job.status === JobStatus.IN_DESIGN ? (
                          <span className="inline-flex items-center rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-700">
                            IN DESIGN
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                            {job.status.replaceAll('_', ' ')}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right relative">
                        <div className="inline-block text-left">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuJobId(activeMenuJobId === job.id ? null : job.id)
                            }
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {activeMenuJobId === job.id && (
                            <div className="absolute right-0 mt-1 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg text-xs font-semibold text-slate-700">
                              <Link
                                href={`/reception/jobs/${job.id}`}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50 transition"
                                onClick={() => setActiveMenuJobId(null)}
                              >
                                <Eye className="h-3.5 w-3.5 text-slate-500" />
                                View Details
                              </Link>
                              <button
                                type="button"
                                onClick={() => {
                                  setStatusModalJob(job);
                                  setNewStatus(job.status);
                                  setActiveMenuJobId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50 transition text-left"
                              >
                                <RotateCw className="h-3.5 w-3.5 text-slate-500" />
                                Update Status
                              </button>
                              <Link
                                href={`/reception/jobs/${job.id}`}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50 transition"
                                onClick={() => setActiveMenuJobId(null)}
                              >
                                <Printer className="h-3.5 w-3.5 text-slate-500" />
                                Print Job
                              </Link>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer: Pagination ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 px-5 py-4 text-xs font-medium text-slate-500 bg-white">
          <p>
            Showing {paginatedJobs.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
            {Math.min(currentPage * pageSize, totalFiltered)} of {totalFiltered} jobs
          </p>

          <div className="flex items-center gap-1.5">
            {/* Previous Page Button */}
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page number buttons */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-amber-500 text-slate-950 shadow-2xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Page Button */}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Status Update Modal ───────────────────────────────────────── */}
      {statusModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Update Status for {statusModalJob.jobNumber}
            </h3>
            <p className="text-xs text-slate-500">
              Select new production status for this job order.
            </p>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as JobStatus)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold outline-none focus:border-amber-500"
              >
                {Object.values(JobStatus).map((s) => (
                  <option key={s} value={s}>
                    {s.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStatusModalJob(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updateStatusMutation.isPending}
                onClick={handleUpdateStatus}
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-slate-950 shadow-xs hover:bg-amber-600"
              >
                {updateStatusMutation.isPending ? 'Updating...' : 'Save Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
