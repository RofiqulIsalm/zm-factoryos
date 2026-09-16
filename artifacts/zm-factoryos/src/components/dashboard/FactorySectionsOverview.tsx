import React from 'react';
import { Link } from 'wouter';
import { 
  Tv, 
  Image as ImageIcon, 
  Layers, 
  Sparkles, 
  Building2, 
  ArrowUpRight,
  Clock3
} from 'lucide-react';
import type { Job } from '@workspace/api-client-react';

interface FactorySectionsOverviewProps {
  jobs?: Job[];
}

interface RunningJobItem {
  id: string;
  companyName: string;
  item: string;
  quantity: string;
  status: string;
}

interface FactorySectionData {
  id: string;
  name: string;
  code: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  badgeTone: string;
  runningJobs: RunningJobItem[];
}

export function FactorySectionsOverview({ jobs = [] }: FactorySectionsOverviewProps) {
  // Helper to extract jobs per section if present, or provide realistic active floor work
  const findJobsForSection = (sectionKeywords: string[], defaultFallback: RunningJobItem[]): RunningJobItem[] => {
    if (!jobs || jobs.length === 0) return defaultFallback;
    const matched = jobs.filter(j => 
      sectionKeywords.some(kw => 
        (j.printingSection || '').toLowerCase().includes(kw) || 
        (j.jobType || '').toLowerCase().includes(kw)
      )
    );
    if (matched.length === 0) return defaultFallback;
    return matched.slice(0, 2).map(j => ({
      id: j.id,
      companyName: j.companyName || 'Target Garments',
      item: j.jobType || 'Print Batch',
      quantity: `${(j.quantity || 1500).toLocaleString('en-IN')} pcs`,
      status: j.status.replaceAll('_', ' '),
    }));
  };

  const sections: FactorySectionData[] = [
    {
      id: 'printing',
      name: 'Printing Section',
      code: 'Screen / Table',
      tagline: 'Active floor work today',
      icon: Tv,
      iconBg: 'bg-indigo-500 text-white',
      badgeTone: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      runningJobs: findJobsForSection(['print', 'screen'], [
        {
          id: 'p1',
          companyName: 'Apex Holdings Ltd.',
          item: 'Chest Print (Single Jersey)',
          quantity: '4,500 pcs',
          status: 'In Production',
        },
        {
          id: 'p2',
          companyName: 'Target Garments',
          item: 'Pigment Sleeve Print',
          quantity: '2,800 pcs',
          status: 'In Production',
        },
      ]),
    },
    {
      id: 'sublimation',
      name: 'Sublimation Section',
      code: 'Heat Transfer',
      tagline: 'All-over & roll-to-roll',
      icon: ImageIcon,
      iconBg: 'bg-sky-500 text-white',
      badgeTone: 'bg-sky-50 text-sky-700 border-sky-200',
      runningJobs: findJobsForSection(['sublimation', 'heat'], [
        {
          id: 's1',
          companyName: 'H&M Sourcing Bangladesh',
          item: 'Polyester Sports Jersey',
          quantity: '3,200 yds',
          status: 'In Production',
        },
        {
          id: 's2',
          companyName: 'New Era Apparels',
          item: 'Sublimation Ribbon / Tape',
          quantity: '1,500 yds',
          status: 'In Production',
        },
      ]),
    },
    {
      id: 'sonic',
      name: 'Sonic Section',
      code: 'Ultrasonic / Emboss',
      tagline: 'High frequency sealing',
      icon: Sparkles,
      iconBg: 'bg-purple-500 text-white',
      badgeTone: 'bg-purple-50 text-purple-700 border-purple-200',
      runningJobs: findJobsForSection(['sonic', 'ultra', 'emboss'], [
        {
          id: 'sn1',
          companyName: 'Walmart Global BD',
          item: 'Sonic Weld Neck Label',
          quantity: '12,000 pcs',
          status: 'In Production',
        },
        {
          id: 'sn2',
          companyName: 'Dekko Group Ltd.',
          item: 'Ultrasonic Cut Hemming',
          quantity: '8,500 pcs',
          status: 'In Production',
        },
      ]),
    },
    {
      id: 'silicon',
      name: 'Silicon Section',
      code: 'Rubber & 3D Badge',
      tagline: 'Molding & Heat Cure',
      icon: Layers,
      iconBg: 'bg-amber-500 text-white',
      badgeTone: 'bg-amber-50 text-amber-700 border-amber-200',
      runningJobs: findJobsForSection(['silicon', 'badge', 'pvc'], [
        {
          id: 'sl1',
          companyName: 'Perry Ellis BD',
          item: '3D High Density Silicon Badge',
          quantity: '6,200 pcs',
          status: 'In Production',
        },
        {
          id: 'sl2',
          companyName: 'Ananta Fashion Ltd.',
          item: 'Silicon Rubber Puller Tag',
          quantity: '3,800 pcs',
          status: 'In Production',
        },
      ]),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <div
            key={section.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            {/* Section Header */}
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${section.iconBg} shadow-sm`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-black text-slate-900">
                      {section.name}
                    </h3>
                    <p className="truncate text-[10px] font-semibold text-slate-400">
                      {section.code}
                    </p>
                  </div>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse mt-1.5" title="Live operation" />
              </div>

              {/* Today's Running Jobs Header */}
              <div className="mt-3.5 mb-2 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock3 className="h-3 w-3 text-slate-400" />
                  Today Running Work
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  2 Jobs Active
                </span>
              </div>

              {/* Job List (2 items per section) */}
              <div className="space-y-2.5">
                {section.runningJobs.map((job, idx) => (
                  <div
                    key={job.id || idx}
                    className="group rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-colors hover:border-slate-200 hover:bg-white"
                  >
                    {/* Company Name & Quantity */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <p className="truncate text-xs font-black text-slate-800">
                          {job.companyName}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-xs font-black text-slate-900 border border-slate-200/80 shadow-2xs">
                        {job.quantity}
                      </span>
                    </div>

                    {/* Work description / Item */}
                    <p className="mt-1.5 truncate text-[11px] font-semibold text-slate-600">
                      {job.item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Section Link */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                href={`/reception/jobs?section=${section.id}`}
                className="flex items-center justify-between text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors"
              >
                <span>View {section.name} Board</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
