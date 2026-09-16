import React from 'react';
import { Link } from 'wouter';
import { Building2, ArrowRight, ArrowUpRight, Clock3 } from 'lucide-react';
import type { Job } from '@workspace/api-client-react';

export interface SectionDisplayConfig {
  id: string;
  name: string;
  code: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  badgeTone: string;
  keywords: string[];
}

export interface SectionOrderPreview {
  id: string;
  jobNumber?: string;
  companyName: string;
  item: string;
  quantity: string;
  deliveryDate?: string;
  status: string;
}

interface ProductionSectionCardProps {
  config: SectionDisplayConfig;
  orders: SectionOrderPreview[];
  totalJobsCount: number;
}

export function ProductionSectionCard({ config, orders, totalJobsCount }: ProductionSectionCardProps) {
  const Icon = config.icon;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.iconBg} shadow-sm`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">
                {config.name}
              </h3>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs font-semibold text-slate-400">
              {config.code} · {config.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {totalJobsCount} Orders Total
          </span>
          <Link
            href={`/reception/jobs?section=${config.id}`}
            className="inline-flex items-center gap-1 rounded-xl bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-600 hover:bg-sky-100 transition-colors"
          >
            <span>View All Section Orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 3 to 4 Orders List */}
      <div className="mt-4">
        <div className="mb-2.5 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-slate-400" />
            Active Floor Orders (চলমান কাজ)
          </span>
          <span>Qty & Status</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {orders.slice(0, 4).map((order) => (
            <Link
              key={order.id}
              href={`/reception/jobs/${order.id.startsWith('dummy') ? '' : order.id}`}
              className="group rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <p className="truncate text-xs font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                      {order.companyName}
                    </p>
                  </div>
                  <p className="mt-1 truncate text-xs font-semibold text-slate-600">
                    {order.item}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <span className="inline-block rounded-md bg-white px-2 py-0.5 text-xs font-black text-slate-900 border border-slate-200/80 shadow-2xs">
                    {order.quantity}
                  </span>
                  <p className="mt-1 text-[10px] font-bold text-emerald-600">
                    {order.status}
                  </p>
                </div>
              </div>

              {order.deliveryDate && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>Delivery Promise: <strong className="text-slate-600 font-bold">{order.deliveryDate}</strong></span>
                  <span className="text-sky-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Job Card <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
