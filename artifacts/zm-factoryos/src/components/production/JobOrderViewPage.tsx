import React, { useState, useMemo } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import {
  Factory,
  ArrowLeft,
  Printer,
  Edit,
  ChevronDown,
  Calendar,
  Layers,
  Clock,
  AlertCircle,
  FileText,
  User,
  CheckCircle2,
  Download,
  Zap,
  RotateCw,
  Send,
  Pencil,
  FileSpreadsheet,
  FileImage,
  FileCheck2,
  X,
  Plus,
  Tag,
  Info
} from 'lucide-react';
import {
  useGetJob,
  useListJobs,
  useUpdateJobStatus,
  useUpdateJob,
  JobStatus,
  type Job
} from '@workspace/api-client-react';
import {
  parseJobDetails,
  formatDateStr,
  formatElapsedTime,
  isRecuttingRemark,
  type JobBreakdownBatch
} from './AllFactoryOrdersPage';

export function JobOrderViewPage() {
  const { id = '' } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: job, isLoading, isError, refetch } = useGetJob(id);
  const { data: jobsList } = useListJobs({ page: 1, pageSize: 50 });
  const updateStatusMutation = useUpdateJobStatus();
  const updateJobMutation = useUpdateJob();

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<JobStatus>(JobStatus.RECEIVED);
  const [statusNote, setStatusNote] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [localNotes, setLocalNotes] = useState<
    Array<{ author: string; time: string; text: string }>
  >([
    {
      author: 'Managing Director',
      time: '18 Sept 2026 10:24 AM',
      text: 'This job is started for printing. Please confirm the artwork.',
    },
  ]);

  // Edit form state
  const [editQty, setEditQty] = useState<number>(0);
  const [editSection, setEditSection] = useState('');
  const [editDeliveryDate, setEditDeliveryDate] = useState('');

  // Add Challan Batch Modal state
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [batchChallanNo, setBatchChallanNo] = useState('');
  const [batchOrderDate, setBatchOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [batchColor, setBatchColor] = useState('');
  const [batchPart, setBatchPart] = useState('');
  const [batchOrderQty, setBatchOrderQty] = useState<number | ''>('');
  const [batchOutQty, setBatchOutQty] = useState<number | ''>('');
  const [batchRemarks, setBatchRemarks] = useState('');
  const [batchError, setBatchError] = useState('');
  const [isBatchSubmitting, setIsBatchSubmitting] = useState(false);
  const [batchSuccessToast, setBatchSuccessToast] = useState('');

  // Extract parsed job details
  const parsed = useMemo(() => {
    if (!job) {
      return {
        challanNo: '',
        styleNo: '33333',
        color: 'Black',
        part: 'Sleeve',
        size: '',
        remarks: '',
        orderDate: '18 Sept 2026',
        itemType: 'Production' as const,
        outQty: 150,
        batches: [] as JobBreakdownBatch[],
      };
    }
    const p = parseJobDetails(job);
    return {
      challanNo: p.challanNo || '260918-004',
      styleNo: p.styleNo || (job.jobNumber?.includes('0004') ? '33333' : '33333'),
      color: p.color || 'Black',
      part: p.part || 'Sleeve',
      size: p.size || 'M',
      remarks: p.remarks || '-',
      orderDate: p.orderDate ? formatDateStr(p.orderDate) : '18 Sept 2026',
      itemType: p.itemType || 'Production',
      outQty: p.outQty || job.receivedQuantity || job.quantity || 150,
      batches: p.batches || [],
    };
  }, [job]);

  const handleAddBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBatchError('');
    if (!batchChallanNo.trim()) {
      setBatchError('Please enter a Challan Number.');
      return;
    }
    const oQty = Math.max(0, Number(batchOrderQty) || 0);
    const recQty = Math.max(0, Number(batchOutQty) || 0);
    if (oQty <= 0 && recQty <= 0) {
      setBatchError('Please enter an Order Quantity or Out Quantity.');
      return;
    }

    setIsBatchSubmitting(true);
    try {
      const isRecutting = isRecuttingRemark(batchRemarks);
      const newBatch: JobBreakdownBatch = {
        id: `batch-${Date.now()}`,
        challanNumber: batchChallanNo.trim(),
        orderDate: batchOrderDate,
        styleNumber: parsed.styleNo,
        color: batchColor.trim() || parsed.color,
        part: batchPart.trim() || parsed.part,
        orderQty: oQty,
        outQty: recQty,
        remarks: batchRemarks.trim(),
        isRecutting,
        itemType: parsed.itemType,
        createdAt: new Date().toISOString(),
      };

      // Recutting rule:
      // - If recutting: do not increase job billable quantity or receivedQuantity
      // - If regular / short pcs: increase quantity and receivedQuantity
      const newQuantity = isRecutting
        ? (job?.quantity || 0)
        : ((job?.quantity || 0) + oQty);
      const newReceivedQty = isRecutting
        ? (job?.receivedQuantity || 0)
        : ((job?.receivedQuantity || 0) + recQty);

      let existingNotesObj: any = {};
      try {
        const rawNotes = (job as any)?.notes;
        existingNotesObj =
          typeof rawNotes === 'object'
            ? rawNotes
            : JSON.parse(rawNotes || '{}');
      } catch {}

      const updatedBatches = [...(parsed.batches || []), newBatch];
      const updatedNotes = JSON.stringify({
        ...existingNotesObj,
        batches: updatedBatches,
        lastChallanNumber: batchChallanNo.trim(),
        lastUpdated: new Date().toISOString(),
      });

      await updateJobMutation.mutateAsync({
        id: job!.id,
        data: {
          quantity: newQuantity,
          receivedQuantity: newReceivedQty,
          notes: updatedNotes,
        },
      });

      setIsAddBatchModalOpen(false);
      setBatchChallanNo('');
      setBatchRemarks('');
      setBatchOrderQty('');
      setBatchOutQty('');
      refetch();
      setBatchSuccessToast(
        isRecutting
          ? `Challan #${batchChallanNo} added as Recutting/Repair (Breakdown updated, billable qty unchanged).`
          : `Challan #${batchChallanNo} added! (+${oQty} pcs Order Qty, +${recQty} pcs Out Qty added).`
      );
      setTimeout(() => setBatchSuccessToast(''), 4500);
    } catch (err: any) {
      setBatchError(err?.message || 'Failed to add challan batch.');
    } finally {
      setIsBatchSubmitting(false);
    }
  };

  // Next job in list
  const allJobs = jobsList?.items ?? [];
  const currentIndex = allJobs.findIndex((j) => j.id === id);
  const nextJob =
    currentIndex >= 0 && currentIndex < allJobs.length - 1
      ? allJobs[currentIndex + 1]
      : allJobs[0];

  const handleStatusChange = (status: JobStatus) => {
    updateStatusMutation.mutate(
      {
        id,
        data: {
          status,
          note: statusNote || `Status changed to ${status}`,
        },
      },
      {
        onSuccess: () => {
          setIsStatusModalOpen(false);
          setIsStatusDropdownOpen(false);
          setStatusNote('');
          refetch();
        },
      }
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setLocalNotes((prev) => [
      ...prev,
      {
        author: 'Managing Director',
        time: new Date().toLocaleString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        text: newNoteText.trim(),
      },
    ]);
    setNewNoteText('');
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-8 text-center text-slate-400 font-semibold">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3" />
        <p>Loading Job Order Details...</p>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center space-y-3">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-600" />
        <h3 className="text-base font-bold text-rose-900">Job Order not found</h3>
        <p className="text-xs text-rose-600">Could not retrieve details for this job order.</p>
        <Link
          href="/reception/jobs"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs"
        >
          ← Return to Job List
        </Link>
      </div>
    );
  }

  const quantity = job.quantity || 150;
  const outQuantity = job.receivedQuantity || parsed.outQty || quantity;
  const completedQuantity = job.completedQuantity || 0;
  const inProgressQuantity = Math.max(0, quantity - completedQuantity);
  const receivedDateRaw = parsed.orderDate || job.createdAt;
  const receivedInfo = formatElapsedTime(receivedDateRaw);

  return (
    <div className="space-y-6 page-enter pb-16">
      {/* ── Back to Job List link ──────────────────────────────────────── */}
      <div>
        <Link
          href="/reception/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-black text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job List
        </Link>
      </div>

      {/* ── Top Main Job Header Card ──────────────────────────────────── */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          {/* Left info */}
          <div className="flex items-start gap-4">
            {/* Orange Factory Icon Box */}
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-xs">
              <Factory className="h-7 w-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {job.jobNumber}
                </h1>
                {/* Type Badge */}
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                    parsed.itemType === 'Sample'
                      ? 'bg-sky-50 border border-sky-200 text-sky-700'
                      : 'bg-slate-100 border border-slate-200 text-slate-700'
                  }`}
                >
                  {parsed.itemType}
                </span>
                {/* Status Pill Badge */}
                <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {job.status.replaceAll('_', ' ')}
                </span>
              </div>

              {/* Subtitle with blue style number */}
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                Style: <span className="font-bold text-blue-600">{parsed.styleNo}</span>
                <span className="text-slate-400"> • </span>
                Color: <span className="text-slate-800">{parsed.color}</span>
                <span className="text-slate-400"> • </span>
                Part: <span className="text-slate-800">{parsed.part}</span>
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 self-start md:self-center">
            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex h-9 sm:h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 sm:px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              Print
            </button>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() => {
                setEditQty(job.quantity);
                setEditSection(job.printingSection || 'Printing');
                setEditDeliveryDate(job.expectedDeliveryDate || '');
                setIsEditModalOpen(true);
              }}
              className="inline-flex h-9 sm:h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 sm:px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5 text-slate-500" />
              Edit
            </button>

            {/* Update Status Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="inline-flex h-9 sm:h-10 items-center gap-2 rounded-xl bg-amber-500 px-4 text-xs font-black text-slate-950 shadow-xs hover:bg-amber-600 transition-colors cursor-pointer"
              >
                <span>Update Status</span>
                <ChevronDown className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute right-0 mt-1.5 z-40 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl text-xs font-semibold text-slate-700 space-y-1">
                  <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Change Status
                  </p>
                  {Object.values(JobStatus).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setNewStatus(st);
                        setIsStatusModalOpen(true);
                        setIsStatusDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-slate-50 transition ${
                        job.status === st ? 'text-amber-600 font-bold bg-amber-50/50' : ''
                      }`}
                    >
                      <span>{st.replaceAll('_', ' ')}</span>
                      {job.status === st && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5 Metric Cards in a Row ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Order Quantity / Out Quantity */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Order Quantity</p>
              <p className="text-xl font-black text-slate-900 mt-0.5 leading-none">
                {quantity} / {outQuantity} <span className="text-xs font-bold text-slate-500">pcs</span>
              </p>
              <p className="text-[10px] font-medium text-slate-400 mt-1">Order Qty / Out Qty</p>
            </div>
          </div>
        </div>

        {/* Card 2: Completed */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Completed</p>
              <p className="text-xl font-black text-slate-900 mt-0.5 leading-none">
                {completedQuantity} pcs
              </p>
              <p className="text-[10px] font-medium text-slate-400 mt-1">0% of total</p>
            </div>
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500">In Progress</p>
              <p className="text-xl font-black text-slate-900 mt-0.5 leading-none">
                {inProgressQuantity} pcs
              </p>
              <p className="text-[10px] font-medium text-slate-400 mt-1">100% of total</p>
            </div>
          </div>
          {/* Green progress bar underneath */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-emerald-500" />
        </div>

        {/* Card 4: Received Date with Elapsed Time */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Received Date</p>
              <p className="text-base sm:text-lg font-black text-slate-900 mt-0.5 leading-tight">
                {receivedInfo.formattedDate}
              </p>
              <p className="text-[10px] font-bold text-amber-600 mt-1">
                ⏱ {receivedInfo.elapsedStr} ({receivedInfo.dayName})
              </p>
            </div>
          </div>
        </div>

        {/* Card 5: Status */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Status</p>
              <p className="text-base sm:text-lg font-black text-slate-900 mt-0.5 leading-tight capitalize">
                {job.status.toLowerCase()}
              </p>
              <span className="inline-block mt-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                {job.status.replaceAll('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 1. Job Order Information (Full Width) ────────────────────── */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Job Order Information</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-4 text-xs">
          {/* Row 1 */}
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Job Order No.</p>
            <p className="font-bold text-slate-900 mt-1 text-sm">{job.jobNumber}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Style No.</p>
            <p className="font-bold text-blue-600 mt-1 text-sm">{parsed.styleNo}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Color</p>
            <p className="font-bold text-slate-800 mt-1 text-sm">{parsed.color}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Part</p>
            <p className="font-bold text-slate-800 mt-1 text-sm">{parsed.part}</p>
          </div>

          {/* Row 2 */}
          <div className="relative">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Client / Customer</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="font-bold text-slate-800 text-sm">{job.companyName || 'Youlee'}</span>

              {/* Customer Details Popover on (i) hover */}
              <div className="relative group inline-flex items-center">
                <button
                  type="button"
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition cursor-pointer"
                  title="Hover to view Customer Details"
                >
                  <Info className="h-2.5 w-2.5 stroke-[2.5]" />
                </button>

                {/* Floating Customer Details Card */}
                <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 delay-75 absolute left-0 top-full mt-2 z-50 w-72 rounded-2xl border border-slate-200/95 bg-white p-4 shadow-2xl space-y-3 pointer-events-none group-hover:pointer-events-auto">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">Customer Details</p>
                      <p className="text-[10px] text-slate-400 font-medium">Profile & contact information</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400">Customer Name</p>
                      <p className="font-bold text-slate-900 mt-0.5">{job.companyName || 'Youlee'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400">Contact Person</p>
                      <p className="font-semibold text-slate-700 mt-0.5">{job.contactPerson || 'youlee'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400">Phone</p>
                      <p className="font-semibold text-slate-700 mt-0.5">+880 1711-XXXX</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400">Email</p>
                      <p className="font-semibold text-slate-700 mt-0.5">info@youlee.com</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400">Address</p>
                      <p className="font-semibold text-slate-700 mt-0.5">Dhaka, Bangladesh</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Order Date</p>
            <p className="font-semibold text-slate-700 mt-1 text-sm">{parsed.orderDate}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Received Date</p>
            <p className="font-semibold text-slate-700 mt-1 text-sm">{receivedInfo.formattedDate}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Station / Section</p>
            <p className="font-semibold text-slate-700 mt-1 text-sm">{job.printingSection || 'Printing'}</p>
          </div>

          {/* Row 3 */}
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Order / Out Qty</p>
            <p className="font-bold text-slate-900 mt-1 text-sm">
              {quantity} / <span className="text-sky-700">{outQuantity}</span> pcs
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Item Type</p>
            <div className="mt-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  parsed.itemType === 'Sample'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {parsed.itemType}
              </span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Elapsed Time</p>
            <p className="font-bold text-amber-600 mt-1 text-sm">{receivedInfo.elapsedStr}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Remarks</p>
            <p className="font-semibold text-slate-500 mt-1 text-sm">{parsed.remarks || '-'}</p>
          </div>
        </div>
      </div>

      {/* ── Order Items / Style Breakdown (Expanded Full Width) ──────── */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Order Items / Style Breakdown</h2>
            <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
              {parsed.batches.length} {parsed.batches.length === 1 ? 'Challan Batch' : 'Challan Batches'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setBatchChallanNo('');
              setBatchOrderDate(new Date().toISOString().split('T')[0]);
              setBatchColor(parsed.color);
              setBatchPart(parsed.part);
              setBatchOrderQty('');
              setBatchOutQty('');
              setBatchRemarks('');
              setBatchError('');
              setIsAddBatchModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 px-3.5 py-1.5 text-xs font-bold transition shadow-2xs cursor-pointer active:translate-y-px"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Add Challan Batch</span>
          </button>
        </div>

        {batchSuccessToast && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{batchSuccessToast}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3">Challan / Date</th>
                <th className="py-2.5 px-3">Style No.</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Color</th>
                <th className="py-2.5 px-3">Part</th>
                <th className="py-2.5 px-3 text-right">Order Qty</th>
                <th className="py-2.5 px-3 text-right">Out Qty</th>
                <th className="py-2.5 px-3">Batch Info & Remarks</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {parsed.batches.map((batch, idx) => {
                const isRecut = Boolean(batch.isRecutting || isRecuttingRemark(batch.remarks));
                return (
                  <tr
                    key={batch.id || idx}
                    className={`transition ${
                      isRecut ? 'bg-amber-50/25 hover:bg-amber-50/50' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <td className="py-3 px-3 text-center text-slate-400 font-bold">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 leading-tight">
                        #{batch.challanNumber || parsed.challanNo || 'CH-001'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {batch.orderDate ? formatDateStr(batch.orderDate) : parsed.orderDate}
                      </p>
                    </td>
                    <td className="py-3 px-3 font-bold text-blue-600">
                      {batch.styleNumber || parsed.styleNo}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          (batch.itemType || parsed.itemType) === 'Sample'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {batch.itemType || parsed.itemType}
                      </span>
                    </td>
                    <td className="py-3 px-3">{batch.color || parsed.color}</td>
                    <td className="py-3 px-3">{batch.part || parsed.part}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      {batch.orderQty} pcs
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-sky-700">
                      {batch.outQty} pcs
                    </td>
                    <td className="py-3 px-3">
                      {isRecut ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100/90 border border-amber-300 px-2 py-0.5 text-[10px] font-extrabold text-amber-900">
                            ⚠️ Recutting / Repair
                          </span>
                          <p className="text-[10px] text-amber-800 font-medium">
                            Tracked in breakdown (Excluded from billable order qty)
                          </p>
                          {batch.remarks && (
                            <p className="text-[10px] text-slate-500 font-normal italic">
                              {batch.remarks}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            ✓ Standard Delivery
                          </span>
                          {batch.remarks && (
                            <p className="text-[10px] text-slate-500 font-normal">
                              {batch.remarks}
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                        IN PROGRESS
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t-2 border-slate-200 bg-slate-50/80 font-bold text-xs text-slate-800">
              <tr>
                <td
                  colSpan={6}
                  className="py-2.5 px-3 text-right text-slate-600 uppercase text-[10px] tracking-wider"
                >
                  Active Job Order Totals:
                </td>
                <td className="py-2.5 px-3 text-right font-black text-slate-900">
                  {quantity} pcs
                </td>
                <td className="py-2.5 px-3 text-right font-black text-sky-700">
                  {outQuantity} pcs
                </td>
                <td colSpan={2} className="py-2.5 px-3 text-slate-500 font-medium text-[11px]">
                  {parsed.batches.filter((b) => b.isRecutting || isRecuttingRemark(b.remarks)).length > 0 ? (
                    <span className="text-amber-700 font-bold">
                      +{' '}
                      {parsed.batches
                        .filter((b) => b.isRecutting || isRecuttingRemark(b.remarks))
                        .reduce((sum, b) => sum + (Number(b.orderQty) || 0), 0)}{' '}
                      pcs recutting/repair recorded
                    </span>
                  ) : (
                    <span>All delivered quantities active</span>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── Bottom 3 Cards: Notes, Documents, Quick Actions ───────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Column 1: Production Notes (Cols 5) */}
        <div className="md:col-span-5 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Production Notes</h2>
            </div>

            {/* Existing notes list */}
            <div className="space-y-3">
              {localNotes.map((n, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-[10px]">
                    MD
                  </div>
                  <div className="flex-1 bg-slate-50/70 border border-slate-100 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900">{n.author}</p>
                      <Pencil className="h-3 w-3 text-slate-400 hover:text-slate-600 cursor-pointer" />
                    </div>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">{n.time}</p>
                    <p className="text-slate-700 mt-1.5 font-medium leading-relaxed">
                      {n.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add note input */}
          <form onSubmit={handleAddNote} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Write a note..."
              className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:bg-white transition"
            />
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-amber-500 px-4 text-xs font-black text-slate-950 hover:bg-amber-600 transition shadow-xs shrink-0 cursor-pointer"
            >
              Add Note
            </button>
          </form>
        </div>

        {/* Column 2: Related Documents (Cols 4) */}
        <div className="md:col-span-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Related Documents</h2>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Document 1: Challan / PO */}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs">Challan / PO</p>
                  <p className="text-[10px] font-medium text-slate-400">challan-260918-004.pdf</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            {/* Document 2: Style Image */}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <FileImage className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs">Style Image</p>
                  <p className="text-[10px] font-medium text-slate-400">style-33333.jpg</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            {/* Document 3: Artwork */}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xs">Artwork</p>
                  <p className="text-[10px] font-medium text-slate-400">artwork-33333.pdf</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Quick Actions (Cols 3) */}
        <div className="md:col-span-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Zap className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Quick Actions</h2>
            </div>

            <div className="space-y-2">
              {/* Button 1: Update Status */}
              <button
                type="button"
                onClick={() => {
                  setNewStatus(job.status);
                  setIsStatusModalOpen(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-600 transition shadow-2xs cursor-pointer"
              >
                <RotateCw className="h-3.5 w-3.5 stroke-[2.5]" />
                Update Status
              </button>

              {/* Button 2: Print Job Order */}
              <button
                type="button"
                onClick={handlePrint}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-slate-500" />
                Print Job Order
              </button>

              {/* Button 3: Download PDF */}
              <button
                type="button"
                onClick={handlePrint}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                Download PDF
              </button>

              {/* Button 4: Go to Next Job */}
              {nextJob && nextJob.id !== id && (
                <button
                  type="button"
                  onClick={() => setLocation(`/reception/jobs/${nextJob.id}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
                >
                  <span>Go to Next Job</span>
                  <span className="text-xs">➔</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Status Update Modal ───────────────────────────────────────── */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Update Status for {job.jobNumber}
              </h3>
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">
                  Select Status
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

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">
                  Optional Note
                </label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Started batch production on table 2"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updateStatusMutation.isPending}
                onClick={() => handleStatusChange(newStatus)}
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-slate-950 shadow-xs hover:bg-amber-600"
              >
                {updateStatusMutation.isPending ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Job Modal ────────────────────────────────────────────── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Edit Job Order {job.jobNumber}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">Quantity</label>
                <input
                  type="number"
                  value={editQty}
                  onChange={(e) => setEditQty(Number(e.target.value))}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">Station / Section</label>
                <input
                  type="text"
                  value={editSection}
                  onChange={(e) => setEditSection(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">Received Date</label>
                <input
                  type="date"
                  value={editDeliveryDate}
                  onChange={(e) => setEditDeliveryDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updateJobMutation.isPending}
                onClick={() => {
                  updateJobMutation.mutate(
                    {
                      id,
                      data: {
                        quantity: editQty,
                        printingSection: editSection,
                        expectedDeliveryDate: editDeliveryDate || undefined,
                      },
                    },
                    {
                      onSuccess: () => {
                        setIsEditModalOpen(false);
                        refetch();
                      },
                    }
                  );
                }}
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-slate-950 shadow-xs hover:bg-amber-600"
              >
                {updateJobMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Challan Batch Modal ────────────────────────────────────── */}
      {isAddBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Add Challan Batch to {job.jobNumber}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Style: <span className="font-bold text-blue-600">{parsed.styleNo}</span> · Part: <span className="font-bold text-slate-800">{parsed.part}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddBatchModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {batchError && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{batchError}</span>
              </div>
            )}

            <form onSubmit={handleAddBatchSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Challan Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={batchChallanNo}
                    onChange={(e) => setBatchChallanNo(e.target.value)}
                    placeholder="e.g. 4150 or CH-002"
                    className="h-9.5 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Challan Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={batchOrderDate}
                    onChange={(e) => setBatchOrderDate(e.target.value)}
                    className="h-9.5 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Order Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={batchOrderQty}
                    onChange={(e) => setBatchOrderQty(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 50"
                    className="h-9.5 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Out Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={batchOutQty}
                    onChange={(e) => setBatchOutQty(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 50"
                    className="h-9.5 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">Color</label>
                  <input
                    type="text"
                    value={batchColor}
                    onChange={(e) => setBatchColor(e.target.value)}
                    placeholder={parsed.color}
                    className="h-9.5 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">Part</label>
                  <input
                    type="text"
                    value={batchPart}
                    onChange={(e) => setBatchPart(e.target.value)}
                    placeholder={parsed.part}
                    className="h-9.5 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">
                  Remarks / Reason
                </label>
                <input
                  type="text"
                  value={batchRemarks}
                  onChange={(e) => setBatchRemarks(e.target.value)}
                  placeholder="e.g. Recutting, Repairing, Production short pcs, Normal delivery"
                  className="h-9.5 w-full rounded-xl border border-slate-200 px-3 text-xs font-semibold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
                />

                {/* Quick Selection Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold">Quick fill:</span>
                  <button
                    type="button"
                    onClick={() => setBatchRemarks('Recutting')}
                    className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 hover:bg-amber-100 transition cursor-pointer"
                  >
                    ⚠️ Recutting
                  </button>
                  <button
                    type="button"
                    onClick={() => setBatchRemarks('Repairing')}
                    className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 hover:bg-amber-100 transition cursor-pointer"
                  >
                    🔧 Repairing
                  </button>
                  <button
                    type="button"
                    onClick={() => setBatchRemarks('Production short pcs')}
                    className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800 hover:bg-blue-100 transition cursor-pointer"
                  >
                    ➕ Production short pcs
                  </button>
                  <button
                    type="button"
                    onClick={() => setBatchRemarks('Normal delivery')}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    ✓ Normal delivery
                  </button>
                </div>
              </div>

              {/* Dynamic Rule Indicator Banner */}
              {isRecuttingRemark(batchRemarks) ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Recutting / Repairing Rule Applied</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    This batch will be added to the Style Breakdown table for delivery tracking and history. Per factory rule, <strong>it will NOT increase the overall billable Job Order Quantity or Out Quantity</strong>.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Standard Delivery / Production Short Rule</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    This batch will increase the Job's total active <strong>Order Quantity (+{Number(batchOrderQty) || 0} pcs)</strong> and <strong>Out Quantity (+{Number(batchOutQty) || 0} pcs)</strong>.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddBatchModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBatchSubmitting}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
                >
                  {isBatchSubmitting ? 'Saving Batch...' : 'Save Challan Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
