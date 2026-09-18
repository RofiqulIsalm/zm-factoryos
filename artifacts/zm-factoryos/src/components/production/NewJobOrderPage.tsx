import React, { useState, useMemo, type FormEvent, type ChangeEvent } from 'react';
import { Link, useLocation } from 'wouter';
import {
  FileText,
  Building2,
  CalendarDays,
  Package,
  Plus,
  Trash2,
  UploadCloud,
  Save,
  X,
  ClipboardEdit,
  Sparkles,
  Receipt,
  CheckCircle2,
  ArrowLeft,
  ChevronDown,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import {
  JobPriority,
  JobStatus,
  useCreateJob,
  useUpdateJob,
  useCreateCompany,
  useListCompanies,
  useListJobs,
  useGetSettingsCatalogs,
  type Company,
} from '@workspace/api-client-react';
import {
  parseJobDetails,
  isRecuttingRemark,
  type JobBreakdownBatch,
} from './AllFactoryOrdersPage';

export interface OrderItemRow {
  id: string;
  product: string;
  color: string;
  part: string;
  size: string;
  orderQty: number | string;
  outQty: number | string;
  remarks: string;
  itemType: 'Production' | 'Sample';
}

const DEFAULT_ROWS: OrderItemRow[] = [
  {
    id: 'row-1',
    product: '',
    color: '',
    part: '',
    size: '',
    orderQty: '',
    outQty: '',
    remarks: '',
    itemType: 'Production',
  },
];

const COLOR_SUGGESTIONS = [
  'White',
  'White #2',
  'ORANGE #07',
  '(NPP)',
  'Black',
  'Navy',
  'Royal Blue',
  'Melange Grey',
  'Charcoal',
  'Red',
  'Bottle Green',
  'Yellow'
];

const PART_SUGGESTIONS = [
  '—',
  'Front',
  'Back',
  'Sleeve',
  'Left Chest',
  'Right Chest',
  'Pocket',
  'B-03 F2',
  'Collar',
  'Hood',
  'Bottom Hem'
];

const SIZE_SUGGESTIONS = [
  'F',
  'Front',
  'S',
  'M',
  'L',
  'XL',
  '2XL',
  '3XL',
  'All Size',
  'BHA - Wight + Shirt HMO'
];

const DEFAULT_SECTIONS = [
  'Printing',
  'Sublimation',
  'Silicon',
  'Sonic Transfer',
];

const PAYMENT_TERMS = [
  'Due on Delivery',
  'Advance 50%',
  '100% Advance',
  'Net 15 Days',
  'Net 30 Days',
  'Weekly Settlement'
];

function getCompanyCode(name: string): string {
  const clean = name.toLowerCase().trim();
  if (!clean) return 'xx';
  if (clean.startsWith('dhaka')) return 'dk';
  const letters = clean.replace(/[^a-z0-9]/g, '');
  if (letters.length >= 2) return letters.slice(0, 2);
  return (letters + 'x').slice(0, 2);
}

export function NewJobOrderPage() {
  const [, setLocation] = useLocation();
  const { data: catalogsData } = useGetSettingsCatalogs();
  const { data: companiesData } = useListCompanies({ page: 1, pageSize: 100 });
  const { data: jobsData } = useListJobs({ page: 1, pageSize: 100 });
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const createCompany = useCreateCompany();

  const availableSections = useMemo(() => {
    const dbSections = (catalogsData?.printingSections ?? []).map((s) => s.name);
    if (dbSections.length > 0) return dbSections;
    return DEFAULT_SECTIONS;
  }, [catalogsData]);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [contactPerson, setContactPerson] = useState('');
  
  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeekStr = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const [orderDate, setOrderDate] = useState(todayStr);
  const [deliveryDate, setDeliveryDate] = useState(nextWeekStr);

  // Challan & Details
  const [challanNo, setChallanNo] = useState('');
  const [orderType, setOrderType] = useState('Printing');

  // Items
  const [items, setItems] = useState<OrderItemRow[]>(DEFAULT_ROWS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Auto generated job number based on customer / company name
  const autoJobNumber = useMemo(() => {
    if (!customerName.trim()) {
      return 'zm-??001';
    }

    const allJobs = jobsData?.items ?? [];

    // Check if customer matches an existing company
    const matchedCompany = companiesData?.items?.find(
      (c) =>
        c.id === selectedCompanyId ||
        c.name.toLowerCase().trim() === customerName.toLowerCase().trim()
    );

    let code = '';
    let maxSeq = 0;

    if (matchedCompany) {
      // Find jobs belonging to this company to reuse their established code
      const companyJobs = allJobs.filter((j) => j.companyId === matchedCompany.id);
      for (const j of companyJobs) {
        const match = j.jobNumber.match(/^zm-([a-z0-9]+?)(\d+)$/i);
        if (match) {
          if (!code) code = match[1].toLowerCase();
          const seq = parseInt(match[2], 10);
          if (!isNaN(seq) && seq > maxSeq) {
            maxSeq = seq;
          }
        }
      }
    }

    // If no prior job code found for this company, generate from name
    if (!code) {
      code = getCompanyCode(customerName);
      for (const j of allJobs) {
        const match = j.jobNumber.match(new RegExp(`^zm-${code}(\\d+)$`, 'i'));
        if (match) {
          const seq = parseInt(match[1], 10);
          if (!isNaN(seq) && seq > maxSeq) {
            maxSeq = seq;
          }
        }
      }
    }

    const nextSeq = maxSeq + 1;
    return `zm-${code}${String(nextSeq).padStart(3, '0')}`;
  }, [customerName, selectedCompanyId, companiesData?.items, jobsData?.items]);

  // Summaries
  const totalItems = items.length;
  const totalQuantity = useMemo(() => {
    return items.reduce((sum, item) => {
      const q = typeof item.orderQty === 'number' ? item.orderQty : parseFloat(String(item.orderQty)) || 0;
      return sum + q;
    }, 0);
  }, [items]);

  const totalOutQuantity = useMemo(() => {
    return items.reduce((sum, item) => {
      const q = typeof item.outQty === 'number' ? item.outQty : parseFloat(String(item.outQty)) || 0;
      return sum + q;
    }, 0);
  }, [items]);

  const productionCount = useMemo(() => {
    return items.filter((i) => i.itemType === 'Production').length;
  }, [items]);

  const sampleCount = useMemo(() => {
    return items.filter((i) => i.itemType === 'Sample').length;
  }, [items]);

  // Handle adding rows
  const handleAddRow = () => {
    const nextIndex = items.length + 1;
    const newRow: OrderItemRow = {
      id: `row-${Date.now()}-${nextIndex}`,
      product: '',
      color: '',
      part: '',
      size: '',
      orderQty: '',
      outQty: '',
      remarks: '',
      itemType: 'Production',
    };
    setItems((prev) => [...prev, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateRow = (id: string, field: keyof OrderItemRow, value: string | number) => {
    setItems((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Handle Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Please enter a Customer / Company Name.');
      return;
    }

    if (!challanNo.trim()) {
      setErrorMessage('Please enter a Challan Number.');
      return;
    }

    // Filter valid rows: row must have a Style Number or Order Quantity
    const validRows = items.filter(
      (row) => (row.product && row.product.trim() !== '') || (Number(row.orderQty) > 0)
    );

    if (validRows.length === 0) {
      setErrorMessage('Please enter at least one Style Number or Order Quantity.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Resolve or create company
      let compId = selectedCompanyId;
      const existingMatch = companiesData?.items?.find(
        (c) => c.name.toLowerCase() === customerName.trim().toLowerCase()
      );

      if (existingMatch) {
        compId = existingMatch.id;
      } else if (!compId) {
        // Create new company
        try {
          const newComp = await createCompany.mutateAsync({
            data: {
              name: customerName.trim(),
              contactPerson: contactPerson.trim() || 'Company Rep',
              phone: '+880 1700-000000',
              notes: 'Created via New Job Order intake',
            },
          });
          compId = newComp.id;
        } catch {
          // Fallback to first existing company if creation fails
          if (companiesData?.items?.[0]?.id) {
            compId = companiesData.items[0].id;
          }
        }
      }

      // If still no companyId, pick first available
      if (!compId && companiesData?.items?.[0]?.id) {
        compId = companiesData.items[0].id;
      }

      if (!compId) {
        setErrorMessage('Could not associate a company. Please ensure at least one company exists.');
        setIsSubmitting(false);
        return;
      }

      // 2. Process each style row under the Challan:
      // If a job already exists for this Company with the SAME Style Number and SAME Part:
      // Merge it into the existing Job Order's breakdown batches!
      // User rule:
      // - If remarks indicate Recutting / Repairing / Damage:
      //   Add the batch to the breakdown history, but do NOT increase total billable quantity or out quantity.
      // - If remarks do NOT indicate recutting (or production short pcs):
      //   Add the batch and INCREASE total order quantity (job.quantity += rowQty) and out quantity (job.receivedQuantity += rowOutQty).
      // If no match found:
      //   Create a new Job Order with its initial batch in the breakdown.

      const currentJobsPool = [...(jobsData?.items ?? [])];
      let mergedJobsCount = 0;
      let createdJobsCount = 0;

      for (let i = 0; i < validRows.length; i++) {
        const row = validRows[i];
        const rowQty = Math.max(1, Number(row.orderQty) || 1);
        const rowOutQty = Math.max(0, Number(row.outQty) || 0);
        const styleNumber = row.product.trim() || `Style-${i + 1}`;
        const isSample = row.itemType === 'Sample';
        const cleanRowPart = (row.part || '').trim().toLowerCase();
        const isRecutting = isRecuttingRemark(row.remarks);

        // Find existing job with same company, same style, and same part
        const matchingJobIndex = currentJobsPool.findIndex((j) => {
          if (j.companyId !== compId) return false;
          const details = parseJobDetails(j);
          const sameStyle =
            details.styleNo &&
            details.styleNo.toLowerCase().trim() === styleNumber.toLowerCase().trim();
          const cleanJobPart = (details.part || '').trim().toLowerCase();
          const samePart =
            cleanJobPart === cleanRowPart || (!cleanJobPart && !cleanRowPart);
          return Boolean(sameStyle && samePart);
        });

        if (matchingJobIndex !== -1) {
          const matchingJob = currentJobsPool[matchingJobIndex];
          const details = parseJobDetails(matchingJob);
          const existingBatches: JobBreakdownBatch[] = [...details.batches];

          const newBatch: JobBreakdownBatch = {
            id: `batch-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
            challanNumber: challanNo.trim(),
            orderDate,
            styleNumber,
            color: row.color.trim() || details.color,
            part: row.part.trim() || details.part,
            size: row.size.trim() || details.size,
            orderQty: rowQty,
            outQty: rowOutQty,
            remarks: row.remarks.trim(),
            isRecutting,
            itemType: row.itemType,
            createdAt: new Date().toISOString(),
          };

          // Quantity calculation based on user rule:
          // Recutting does not increase billable order quantity or out quantity
          const newQty = isRecutting
            ? (matchingJob.quantity || 0)
            : ((matchingJob.quantity || 0) + rowQty);
          const newOutQty = isRecutting
            ? (matchingJob.receivedQuantity || 0)
            : ((matchingJob.receivedQuantity || 0) + rowOutQty);

          let existingNotesObj: any = {};
          try {
            const rawNotes = (matchingJob as any)?.notes;
            existingNotesObj =
              typeof rawNotes === 'object'
                ? rawNotes
                : JSON.parse(rawNotes || '{}');
          } catch {}

          const updatedNotes = JSON.stringify({
            ...existingNotesObj,
            batches: [...existingBatches, newBatch],
            lastChallanNumber: challanNo.trim(),
            lastUpdated: new Date().toISOString(),
          });

          const updated = await updateJob.mutateAsync({
            id: matchingJob.id,
            data: {
              quantity: newQty,
              receivedQuantity: newOutQty,
              notes: updatedNotes,
            },
          });

          // Update local pool in case subsequent rows match the same job
          currentJobsPool[matchingJobIndex] = {
            ...matchingJob,
            ...updated,
            quantity: newQty,
            receivedQuantity: newOutQty,
            notes: updatedNotes,
          } as any;
          mergedJobsCount++;
        } else {
          // Create new job
          const newBatch: JobBreakdownBatch = {
            id: `batch-1`,
            challanNumber: challanNo.trim(),
            orderDate,
            styleNumber,
            color: row.color.trim(),
            part: row.part.trim(),
            size: row.size.trim(),
            orderQty: rowQty,
            outQty: rowOutQty,
            remarks: row.remarks.trim(),
            isRecutting,
            itemType: row.itemType,
            createdAt: new Date().toISOString(),
          };

          const descParts = [`Style: ${isSample ? '[Sample] ' : ''}${styleNumber}`];
          if (row.color && row.color.trim()) descParts.push(`Color: ${row.color.trim()}`);
          if (row.part && row.part.trim() && row.part !== '—') descParts.push(`Part: ${row.part.trim()}`);
          if (row.size && row.size.trim()) descParts.push(`Size: ${row.size.trim()}`);
          const description = descParts.join(' · ');

          const notesPayload = {
            challanNumber: challanNo.trim(),
            styleNumber,
            color: row.color.trim(),
            part: row.part.trim(),
            size: row.size.trim(),
            remarks: row.remarks.trim(),
            orderDate,
            receivedDate: deliveryDate,
            orderType,
            itemType: row.itemType,
            outQty: rowOutQty,
            itemIndex: i + 1,
            totalChallanItems: validRows.length,
            batches: [newBatch],
          };

          const job = await createJob.mutateAsync({
            data: {
              companyId: compId,
              contactPerson: contactPerson.trim() || customerName.trim(),
              jobType: orderType,
              printingSection: orderType,
              description,
              quantity: rowQty,
              receivedQuantity: rowOutQty,
              expectedDeliveryDate: deliveryDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
              priority: JobPriority.NORMAL,
              sampleRequired: isSample,
              notes: JSON.stringify(notesPayload),
            },
          });

          currentJobsPool.push(job);
          createdJobsCount++;
        }
      }

      let toastMsg = '';
      if (mergedJobsCount > 0 && createdJobsCount > 0) {
        toastMsg = `Challan #${challanNo}: ${mergedJobsCount} style(s) merged into existing jobs, ${createdJobsCount} new job(s) created!`;
      } else if (mergedJobsCount > 0) {
        toastMsg = `Challan #${challanNo}: ${mergedJobsCount} style(s) merged into existing job(s) (Same Style & Part)!`;
      } else {
        toastMsg = `Successfully created ${createdJobsCount} Job Order${createdJobsCount > 1 ? 's' : ''} for Challan #${challanNo}!`;
      }
      setSuccessToast(toastMsg);
      setTimeout(() => {
        const hasSampleOnly = validRows.every((r) => r.itemType === 'Sample');
        const hasProductionOnly = validRows.every((r) => r.itemType === 'Production');
        if (hasSampleOnly) {
          setLocation('/reception/jobs?tab=sample');
        } else if (hasProductionOnly) {
          setLocation('/reception/jobs?tab=production');
        } else {
          setLocation('/reception/jobs');
        }
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save job orders. Please check your inputs and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1340px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
      {/* Top Banner / Toast */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl bg-emerald-600 px-5 py-3.5 text-white shadow-xl animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-xs sm:text-sm font-bold">{successToast}</p>
        </div>
      )}

      {/* Main Form Container - Exact white rounded card matching design */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        
        {/* ── 1. Header Section ────────────────────────────────────────── */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* Blue Rounded Document Icon */}
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xs">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                New Job Order
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                Add a new job order based on the received challan from your customer.
              </p>
            </div>
          </div>

          {/* Close button to return to overview */}
          <Link
            href="/reception/jobs"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            title="Cancel and return"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-8">
          {/* ── 2. Customer & Challan Details ─────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-700" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Customer & Challan Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Customer / Company Name */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600">
                  Customer / Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomerName(val);
                      const match = companiesData?.items?.find(
                        (c) => c.name.toLowerCase().trim() === val.toLowerCase().trim()
                      );
                      if (match) {
                        setSelectedCompanyId(match.id);
                        if (match.contactPerson) setContactPerson(match.contactPerson);
                      } else {
                        setSelectedCompanyId('');
                      }
                    }}
                    placeholder="Enter customer name..."
                    list="companies-datalist"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition"
                  />
                  <datalist id="companies-datalist">
                    {companiesData?.items?.map((c) => (
                      <option key={c.id} value={c.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Order Date */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600">
                  Order Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <input
                    type="date"
                    required
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition"
                  />
                </div>
              </div>

              {/* Job Order No. (Auto) */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600">
                  Job Order No. (Auto)
                </label>
                <input
                  type="text"
                  readOnly
                  value={autoJobNumber}
                  className="h-10 w-full rounded-xl border border-amber-200/80 bg-amber-50/50 px-3.5 text-xs font-black text-amber-900 cursor-not-allowed select-none font-mono tracking-wider shadow-2xs"
                />
              </div>

              {/* Challan No. */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600">
                  Challan No. <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-bold text-slate-400">
                    #
                  </div>
                  <input
                    type="text"
                    required
                    value={challanNo}
                    onChange={(e) => setChallanNo(e.target.value)}
                    placeholder="4146"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition"
                  />
                </div>
              </div>

              {/* Received Date */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600">
                  Received Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition"
                  />
                </div>
              </div>

              {/* Section / Order Type */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600">
                  Section / Order Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-8 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition cursor-pointer"
                  >
                    {availableSections.map((wt) => (
                      <option key={wt} value={wt}>
                        {wt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600">
                  Status
                </label>
                <div className="flex h-10 items-center">
                  <span className="inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 3. Product / Order Items Table ────────────────────────── */}
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    Product / Order Items
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Add all items from the challan. You can add multiple rows if needed.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddRow}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3.5 py-1.5 text-xs font-bold text-blue-600 shadow-2xs hover:bg-blue-50/70 hover:border-blue-300 transition active:translate-y-px"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Table wrapper */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full min-w-[960px] text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500">
                    <th className="py-3 px-3 text-center w-12">#</th>
                    <th className="py-3 px-3 min-w-[180px]">Style Number</th>
                    <th className="py-3 px-3 min-w-[130px]">Type</th>
                    <th className="py-3 px-3 min-w-[130px]">Color</th>
                    <th className="py-3 px-3 min-w-[120px]">Part</th>
                    <th className="py-3 px-3 min-w-[130px]">Size</th>
                    <th className="py-3 px-3 min-w-[100px]">Order Qty.</th>
                    <th className="py-3 px-3 min-w-[90px]">Out Qty.</th>
                    <th className="py-3 px-3 min-w-[120px]">Remarks</th>
                    <th className="py-3 px-3 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Row index # */}
                      <td className="py-2.5 px-3 text-center font-bold text-slate-400 text-xs">
                        {String(idx + 1).padStart(2, '0')}
                      </td>

                      {/* Style Number */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={row.product}
                          onChange={(e) => handleUpdateRow(row.id, 'product', e.target.value)}
                          placeholder=""
                          className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition"
                        />
                      </td>

                      {/* Item Type: Production vs Sample */}
                      <td className="py-2.5 px-3">
                        <div className="relative">
                          <select
                            value={row.itemType}
                            onChange={(e) => handleUpdateRow(row.id, 'itemType', e.target.value as 'Production' | 'Sample')}
                            className={`h-9 w-full appearance-none rounded-xl border px-3 pr-7 text-xs font-bold transition cursor-pointer focus:outline-none focus:ring-1 ${
                              row.itemType === 'Sample'
                                ? 'bg-sky-50 border-sky-300 text-sky-800 focus:border-sky-500 focus:ring-sky-500/20'
                                : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
                            }`}
                          >
                            <option value="Production">Production</option>
                            <option value="Sample">Sample</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                        </div>
                      </td>

                      {/* Color */}
                      <td className="py-2.5 px-3">
                        <div className="relative">
                          <input
                            type="text"
                            value={row.color}
                            onChange={(e) => handleUpdateRow(row.id, 'color', e.target.value)}
                            list={`color-list-${row.id}`}
                            placeholder=""
                            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 pr-7 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition"
                          />
                          <datalist id={`color-list-${row.id}`}>
                            {COLOR_SUGGESTIONS.map((col) => (
                              <option key={col} value={col} />
                            ))}
                          </datalist>
                          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                        </div>
                      </td>

                      {/* Part */}
                      <td className="py-2.5 px-3">
                        <div className="relative">
                          <input
                            type="text"
                            value={row.part}
                            onChange={(e) => handleUpdateRow(row.id, 'part', e.target.value)}
                            list={`part-list-${row.id}`}
                            placeholder=""
                            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 pr-7 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition"
                          />
                          <datalist id={`part-list-${row.id}`}>
                            {PART_SUGGESTIONS.map((p) => (
                              <option key={p} value={p} />
                            ))}
                          </datalist>
                          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                        </div>
                      </td>

                      {/* Size */}
                      <td className="py-2.5 px-3">
                        <div className="relative">
                          <input
                            type="text"
                            value={row.size}
                            onChange={(e) => handleUpdateRow(row.id, 'size', e.target.value)}
                            list={`size-list-${row.id}`}
                            placeholder=""
                            className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 pr-7 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition"
                          />
                          <datalist id={`size-list-${row.id}`}>
                            {SIZE_SUGGESTIONS.map((s) => (
                              <option key={s} value={s} />
                            ))}
                          </datalist>
                          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                        </div>
                      </td>

                      {/* Order Qty */}
                      <td className="py-2.5 px-3">
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            value={row.orderQty}
                            onChange={(e) => handleUpdateRow(row.id, 'orderQty', e.target.value)}
                            placeholder=""
                            className={`h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition ${row.orderQty !== '' ? 'pr-8 text-right' : ''}`}
                          />
                          {row.orderQty !== '' && (
                            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                              pcs
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Out Qty */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={row.outQty}
                          onChange={(e) => handleUpdateRow(row.id, 'outQty', e.target.value)}
                          placeholder=""
                          className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition text-center"
                        />
                      </td>

                      {/* Remarks */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={row.remarks}
                          onChange={(e) => handleUpdateRow(row.id, 'remarks', e.target.value)}
                          placeholder="e.g. Normal, Recutting, Short pcs"
                          className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition"
                        />
                        {isRecuttingRemark(row.remarks) && (
                          <div className="mt-1 flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 border border-amber-200">
                            <span>⚠️ Recutting (Qty not added)</span>
                          </div>
                        )}
                        {!isRecuttingRemark(row.remarks) && row.remarks && (
                          <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-emerald-700">
                            <span>✓ Standard / Short (Qty will add)</span>
                          </div>
                        )}
                      </td>

                      {/* Delete Action */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.id)}
                          disabled={items.length <= 1}
                          className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                          title="Delete row"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* + Add another item link */}
            <button
              type="button"
              onClick={handleAddRow}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer pt-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add another item</span>
            </button>
          </div>

          {/* ── 4. Order Summary Only ─────────────────────────────────── */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <Receipt className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Order Summary
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5 text-xs">
              <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-100">
                <span className="font-semibold text-slate-500 block text-[11px]">Total Items</span>
                <span className="font-black text-slate-900 text-lg mt-1 block">{totalItems}</span>
              </div>
              <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-100">
                <span className="font-semibold text-slate-500 block text-[11px]">Total Order Qty</span>
                <span className="font-black text-slate-900 text-lg mt-1 block">{totalQuantity} pcs</span>
              </div>
              <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-100">
                <span className="font-semibold text-slate-500 block text-[11px]">Total Out Qty</span>
                <span className="font-black text-sky-700 text-lg mt-1 block">{totalOutQuantity} pcs</span>
              </div>
              <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-100">
                <span className="font-semibold text-slate-500 block text-[11px]">Production</span>
                <span className="font-black text-slate-800 text-lg mt-1 block">{productionCount}</span>
              </div>
              <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-100">
                <span className="font-semibold text-slate-500 block text-[11px]">Sample</span>
                <span className="font-black text-amber-600 text-lg mt-1 block">{sampleCount}</span>
              </div>
              <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-100">
                <span className="font-semibold text-slate-500 block text-[11px]">Status</span>
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 mt-2">
                  Pending
                </span>
              </div>
            </div>
          </div>

          {/* ── 5. Action Buttons ─────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/reception/jobs"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:translate-y-px transition disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Job Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default NewJobOrderPage;
