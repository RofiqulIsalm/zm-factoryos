import React, { useState, FormEvent, useMemo } from 'react';
import { Link } from 'wouter';
import {
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Printer,
  ChevronRight,
  RefreshCw,
  X
} from 'lucide-react';
import {
  useGetSettingsCatalogs,
  useGetCurrentUser,
  getGetSettingsCatalogsQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';

const CORE_SECTIONS = ['Printing', 'Sublimation', 'Silicon', 'Sonic Transfer', 'Sonic'];

const QUICK_SUGGESTIONS = [
  'DTF Printing',
  'Screen Print',
  'Embroidery',
  'Heat Transfer',
  'Laser Cutting',
  'Flock Print',
  'High Density Print',
  'Digital Direct (DTG)',
];

export function ManageSectionsPage() {
  const queryClient = useQueryClient();
  const { data: user, isLoading: userLoading } = useGetCurrentUser();
  const { data: catalogs, isLoading: catalogsLoading, refetch } = useGetSettingsCatalogs();

  const [sectionName, setSectionName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const roleUpper = (user?.role || '').toUpperCase();
  const isMD = Boolean(
    (user as any)?.isMaster ||
    roleUpper === 'ADMIN' ||
    roleUpper === 'MASTER_MD' ||
    roleUpper.includes('MD') ||
    roleUpper.includes('MANAGING DIRECTOR')
  );

  const sectionsList = useMemo(() => {
    return catalogs?.printingSections ?? [];
  }, [catalogs]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const clean = sectionName.trim();
    if (!clean) {
      setErrorMsg('Please enter a section name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/settings/sections', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: clean }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || 'Failed to create section.');
      }

      setSuccessMsg(`Section "${clean}" has been successfully added!`);
      setSectionName('');
      await queryClient.invalidateQueries({ queryKey: getGetSettingsCatalogsQueryKey() });
      await refetch();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while creating the section.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove section "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch(`/api/settings/sections/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || 'Failed to remove section.');
      }

      setSuccessMsg(`Section "${name}" was removed.`);
      await queryClient.invalidateQueries({ queryKey: getGetSettingsCatalogsQueryKey() });
      await refetch();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to remove section.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6 sm:p-8 space-y-8 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-amber-600 transition">Dashboard</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/settings" className="hover:text-amber-600 transition">Settings</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-bold text-slate-900">Manage Sections</span>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-md">
              <Layers className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-900 border border-amber-200">
                  <ShieldCheck className="h-3 w-3" /> MD Control Room
                </span>
                <span className="text-xs font-medium text-slate-500">· Factory Vocabulary</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl mt-1">
                Factory Sections Management
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                Configure operational sections. Only the Managing Director (MD) has the authorization to create new sections, which immediately appear in the Order Intake form and filter bar.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex h-9 items-center gap-2 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${catalogsLoading ? 'animate-spin text-amber-500' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Feedback Banners */}
      {successMsg && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs font-bold text-emerald-800 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button type="button" onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50/90 p-4 text-xs font-bold text-red-800 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button type="button" onClick={() => setErrorMsg('')} className="text-red-700 hover:text-red-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* MD Power Notice if user is not MD */}
      {!userLoading && !isMD && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-xs text-amber-900">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-black text-sm">Managing Director Authorization Required</p>
              <p className="mt-1 font-medium text-amber-800">
                You are currently viewing factory sections in read-only mode. Only the Managing Director account has authorization to add, modify, or remove sections.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Create New Section Form (For MD) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold">
                <Plus className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900">Create New Section</h2>
                <p className="text-[11px] font-medium text-slate-400">Add a new operational department</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Section Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={!isMD || isSubmitting}
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  placeholder="e.g. DTF Printing, Embroidery"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/15 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Quick Suggestion Chips */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-2">Common Factory Sections:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SUGGESTIONS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      disabled={!isMD || isSubmitting}
                      onClick={() => setSectionName(tag)}
                      className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-amber-900 transition disabled:opacity-50 cursor-pointer"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isMD || isSubmitting || !sectionName.trim()}
                  className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 text-xs font-black text-slate-950 hover:bg-amber-400 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Creating Section...
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      Add Section
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-[11px] font-medium text-slate-500 flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                Newly created sections immediately sync into the <strong>New Job Order</strong> intake form and the <strong>Order List Section filter</strong>.
              </span>
            </div>
          </div>
        </div>

        {/* Right: Existing Sections List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Active Factory Sections ({sectionsList.length})
                </h2>
                <p className="text-[11px] font-medium text-slate-400">
                  Current operational floor categories recognized in ZM FactoryOS
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-black text-emerald-700 uppercase tracking-wider">
                System Active
              </span>
            </div>

            {catalogsLoading ? (
              <div className="p-8 text-center text-slate-400 font-semibold text-xs">
                Loading sections...
              </div>
            ) : sectionsList.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-semibold text-xs">
                No sections defined yet. Use the form on the left to add your first section.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {sectionsList.map((sec) => {
                  const isCore = CORE_SECTIONS.some((c) => c.toLowerCase() === sec.name.toLowerCase());
                  const isDeleting = deletingId === sec.id;

                  return (
                    <div
                      key={sec.id}
                      className="group relative flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-amber-300 hover:shadow-xs transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 group-hover:bg-amber-50 group-hover:text-amber-700 group-hover:border-amber-200 transition">
                          <Printer className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-black text-slate-900">{sec.name}</h3>
                            {isCore && (
                              <span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.2 text-[9px] font-black text-amber-800">
                                Core
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">
                            ● Active on Floor
                          </p>
                        </div>
                      </div>

                      {/* Delete action for custom sections */}
                      {isMD && !isCore && (
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDelete(sec.id, sec.name)}
                          title="Remove section"
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageSectionsPage;
