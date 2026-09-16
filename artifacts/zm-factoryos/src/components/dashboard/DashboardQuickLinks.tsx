import React from 'react';
import { Link } from 'wouter';
import { 
  Link as LinkIcon, 
  FileText, 
  UserPlus, 
  BarChart2, 
  Settings, 
  Megaphone, 
  ArrowRight 
} from 'lucide-react';

export function DashboardQuickLinks() {
  const links = [
    {
      title: 'New Job Order',
      href: '/reception/jobs/new',
      icon: FileText,
      iconColor: 'text-sky-600',
    },
    {
      title: 'Add Customer',
      href: '/clients',
      icon: UserPlus,
      iconColor: 'text-sky-600',
    },
    {
      title: 'View Reports',
      href: '/accounting',
      icon: BarChart2,
      iconColor: 'text-sky-600',
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      iconColor: 'text-sky-600',
    },
  ];

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm h-full">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 pb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
            <LinkIcon className="h-3.5 w-3.5" />
          </span>
          <h2 className="text-base font-black text-slate-900">Quick Links</h2>
        </div>

        {/* 2x2 Action Buttons */}
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.title}
                href={link.href}
                className="group flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-3 text-xs font-bold text-slate-800 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-xs"
              >
                <Icon className={`h-4 w-4 shrink-0 ${link.iconColor} group-hover:scale-110 transition-transform`} />
                <span className="truncate group-hover:text-amber-600 transition-colors">
                  {link.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Blue Message Callout Banner at bottom */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-sky-50 to-blue-50/80 p-3.5 border border-sky-100/60">
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500 text-white shadow-xs">
            <Megaphone className="h-4 w-4" />
          </div>
          <p className="truncate text-[11px] font-semibold text-slate-700">
            We are committed to providing high quality printing & accessories solutions.
          </p>
        </div>
        <Link
          href="/settings"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sky-600 shadow-xs hover:bg-sky-500 hover:text-white transition-colors"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
