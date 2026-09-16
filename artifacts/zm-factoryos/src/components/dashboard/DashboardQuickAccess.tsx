import React from 'react';
import { Link } from 'wouter';
import { 
  Zap, 
  Tv, 
  Image as ImageIcon, 
  Layers, 
  SquareAsterisk,
  ArrowUpRight 
} from 'lucide-react';

interface QuickService {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  href: string;
}

const services: QuickService[] = [
  {
    id: 'screen-printing',
    name: 'Screen Printing',
    subtitle: 'View & Manage',
    icon: Tv,
    iconBg: 'bg-indigo-600',
    iconColor: 'text-white',
    href: '/reception/jobs?category=screen-printing',
  },
  {
    id: 'sublimation-printing',
    name: 'Sublimation Printing',
    subtitle: 'View & Manage',
    icon: ImageIcon,
    iconBg: 'bg-sky-500',
    iconColor: 'text-white',
    href: '/reception/jobs?category=sublimation',
  },
  {
    id: 'silicon-badge',
    name: 'Silicon Badge',
    subtitle: 'View & Manage',
    icon: Layers,
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    href: '/reception/jobs?category=silicon',
  },
  {
    id: 'pvc-badge',
    name: 'PVC Badge',
    subtitle: 'View & Manage',
    icon: SquareAsterisk,
    iconBg: 'bg-emerald-600',
    iconColor: 'text-white',
    href: '/reception/jobs?category=pvc',
  },
];

export function DashboardQuickAccess() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 text-amber-500">
          <Zap className="h-4 w-4 fill-amber-500" />
        </span>
        <h2 className="text-base font-black text-slate-900">Quick Access</h2>
      </div>

      {/* Grid of 4 services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Link
              key={service.id}
              href={service.href}
              className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-sm"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${service.iconBg} ${service.iconColor} shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                  {service.name}
                </p>
                <div className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-slate-400 group-hover:text-slate-600">
                  <span>{service.subtitle}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
