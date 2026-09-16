import React from 'react';
import { CalendarDays } from 'lucide-react';

interface DashboardWelcomeBannerProps {
  userName?: string;
  role?: string;
}

export function DashboardWelcomeBanner({ userName = 'Managing Director', role = 'Managing Director' }: DashboardWelcomeBannerProps) {
  const now = new Date();
  const dayStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const weekdayStr = now.toLocaleDateString('en-GB', { weekday: 'long' });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-r from-[#eef5fc] via-[#f4f9ff] to-[#e6f1fc] p-6 sm:p-7 shadow-sm">
      <div 
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-80 opacity-30 bg-contain bg-right bg-no-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 150' fill='%230284c7'%3E%3Cpath opacity='0.2' d='M20 150V80h30v70h10V50h40v100h20V90h30v60h15V30h45v120h20V70h35v80h15V40h50v110h40v-85h25v85z'/%3E%3Cpath opacity='0.35' d='M0 150V95h35v55h15V70h40v80h25V105h30v45h20V55h40v95h15V85h35v65h20V60h45v90h35v-70h20v70z'/%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">
            WELCOME BACK,
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            স্বাগতম, <span className="font-extrabold">{userName || role}</span>
          </h1>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="h-1 w-6 rounded-full bg-amber-500" />
            <p className="text-xs sm:text-sm font-medium text-slate-600">
              আপনার প্রতিষ্ঠানের সার্বিক কার্যক্রম এখান থেকে সহজেই পরিচালনা করুন।
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-white/80 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 font-black text-slate-950 text-sm shadow-sm">
              ZM
            </div>
            <div className="leading-tight">
              <p className="text-xs font-black tracking-wide text-slate-900">
                ZM PRINTING & DESIGN LTD.
              </p>
              <p className="text-[10px] font-semibold text-slate-400">
                Quality | Creativity | Solution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/80 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-slate-900">{dayStr}</p>
              <p className="text-[10px] font-medium text-slate-500">{weekdayStr}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
