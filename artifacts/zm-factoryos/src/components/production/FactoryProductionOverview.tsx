import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  CalendarDays,
  Plus,
  ClipboardList,
  Play,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  FileText,
  PenTool,
  ClipboardCheck,
  Factory,
  ShieldCheck,
  PackageCheck,
  ArrowRight,
  Tv,
  Layers,
  Sparkles,
  Box,
  Palette,
  ArrowLeftRight,
  Clock,
  Ticket,
} from 'lucide-react';
import type { Job } from '@workspace/api-client-react';

interface FactoryProductionOverviewProps {
  jobs?: Job[];
  onSelectSection?: (sectionId: string) => void;
}

export function FactoryProductionOverview({ jobs = [], onSelectSection }: FactoryProductionOverviewProps) {
  // Format today's date or static date matching mockup
  const currentDateFormatted = '16 Sep 2026';

  // Section configs matching mockup
  const sections = [
    {
      id: 'printing',
      title: 'Printing',
      status: 'Running',
      statusType: 'running',
      subtitle: 'Screen Print · Chest · Sleeve · Pigment',
      icon: Tv,
      iconBg: 'bg-blue-500',
      activeJobs: 12,
      totalPcs: '45,200 pcs',
      dueToday: 3,
      progress: 78,
      progressColor: 'bg-indigo-600',
    },
    {
      id: 'sublimation',
      title: 'Sublimation',
      status: 'Running',
      statusType: 'running',
      subtitle: 'Heat Transfer · All-over print · Sports tape',
      icon: Layers,
      iconBg: 'bg-purple-500',
      activeJobs: 8,
      totalPcs: '21,400 pcs',
      dueToday: 2,
      progress: 64,
      progressColor: 'bg-purple-600',
    },
    {
      id: 'sonic',
      title: 'Sonic',
      status: 'Running',
      statusType: 'running',
      subtitle: 'Ultrasonic · High-frequency welding · & cut',
      icon: Sparkles,
      iconBg: 'bg-sky-500',
      activeJobs: 6,
      totalPcs: '18,200 pcs',
      dueToday: 1,
      progress: 71,
      progressColor: 'bg-sky-500',
    },
    {
      id: 'silicon',
      title: 'Silicon',
      status: 'Running',
      statusType: 'running',
      subtitle: 'Rubber · 3D Badge · High density molding',
      icon: Box,
      iconBg: 'bg-emerald-500',
      activeJobs: 9,
      totalPcs: '26,800 pcs',
      dueToday: 2,
      progress: 58,
      progressColor: 'bg-emerald-500',
    },
    {
      id: 'painting',
      title: 'Painting',
      status: 'Running',
      statusType: 'running',
      subtitle: 'Water-base · Chest Print · Pigment',
      icon: Palette,
      iconBg: 'bg-amber-500',
      activeJobs: 7,
      totalPcs: '16,500 pcs',
      dueToday: 1,
      progress: 52,
      progressColor: 'bg-amber-500',
    },
    {
      id: 'transfer',
      title: 'Transfer',
      status: 'Idle',
      statusType: 'idle',
      subtitle: 'DTF · Heat Transfer · Fixing',
      icon: ArrowLeftRight,
      iconBg: 'bg-indigo-600',
      activeJobs: 4,
      totalPcs: '12,300 pcs',
      dueToday: 0,
      progress: 38,
      progressColor: 'bg-indigo-500',
    },
  ];

  // Pipeline stages
  const flowStages = [
    { label: 'Received', count: 14, icon: FileText, color: 'bg-blue-50 text-blue-500 border-blue-100' },
    { label: 'Design', count: 6, icon: PenTool, color: 'bg-purple-50 text-purple-500 border-purple-100' },
    { label: 'Sample', count: 9, icon: ClipboardCheck, color: 'bg-teal-50 text-teal-500 border-teal-100' },
    { label: 'Production', count: 45, icon: Factory, color: 'bg-emerald-50 text-emerald-500 border-emerald-100' },
    { label: 'QC', count: 8, icon: ShieldCheck, color: 'bg-amber-50 text-amber-500 border-amber-100' },
    { label: 'Completed', count: 76, icon: PackageCheck, color: 'bg-slate-100 text-slate-700 border-slate-200' },
  ];

  // Recent orders list
  const recentOrders = [
    {
      id: '#1024',
      client: 'Apex Holdings Ltd.',
      details: 'Printing · 4,500 pcs',
      status: 'In Production',
      statusColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
      iconColor: 'bg-blue-500 text-white',
    },
    {
      id: '#1025',
      client: 'Target Garments',
      details: 'Sublimation · 2,800 pcs',
      status: 'Due Soon',
      statusColor: 'bg-amber-50 text-amber-600 border border-amber-200/60',
      iconColor: 'bg-purple-500 text-white',
    },
    {
      id: '#1026',
      client: 'Square Fashions',
      details: 'Printing · 3,600 pcs',
      status: 'In Production',
      statusColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
      iconColor: 'bg-blue-500 text-white',
    },
    {
      id: '#1027',
      client: 'Walmart Global',
      details: 'Sonic · 12,000 pcs',
      status: 'Waiting',
      statusColor: 'bg-sky-50 text-sky-600 border border-sky-200/60',
      iconColor: 'bg-sky-500 text-white',
    },
    {
      id: '#1028',
      client: 'Pery Ellis BD',
      details: 'Silicon · 6,200 pcs',
      status: 'Delayed',
      statusColor: 'bg-rose-50 text-rose-600 border border-rose-200/60',
      iconColor: 'bg-amber-500 text-white',
    },
  ];

  // Latest activities
  const activities = [
    {
      title: 'Job #1025 moved to Production',
      subtitle: 'Target Garments',
      time: '10:42 AM',
      dotColor: 'bg-emerald-500 ring-4 ring-emerald-50',
    },
    {
      title: 'Job #1026 completed',
      subtitle: 'Square Fashions',
      time: '09:30 AM',
      dotColor: 'bg-blue-500 ring-4 ring-blue-50',
    },
    {
      title: 'New job received',
      subtitle: 'Apex Holdings Ltd.',
      time: '08:15 AM',
      dotColor: 'bg-teal-500 ring-4 ring-teal-50',
    },
    {
      title: 'Job #1027 is delayed',
      subtitle: 'Walmart Global',
      time: '07:50 AM',
      dotColor: 'bg-rose-500 ring-4 ring-rose-50',
    },
    {
      title: 'Stock updated',
      subtitle: 'Silicon material - 50 pcs',
      time: '06:20 AM',
      dotColor: 'bg-amber-500 ring-4 ring-amber-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── 1. Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            WELCOME BACK,
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Factory Production Overview
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Track your production flow, section wise progress and manage all orders in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            <span>{currentDateFormatted}</span>
          </div>

          <Link
            href="/reception/jobs/new"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-sm transition hover:bg-amber-600 active:translate-y-px"
          >
            <Plus className="h-4 w-4" />
            <span>New Job Order</span>
          </Link>
        </div>
      </div>

      {/* ── 2. Top 4 KPI Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Factory Jobs */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-500">Total Factory Jobs</span>
            <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">76</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>12% vs last week</span>
            </div>
          </div>
        </div>

        {/* In Production */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-2xs">
              <Play className="h-5 w-5 fill-current ml-0.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-500">In Production</span>
            <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">45</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>8% vs last week</span>
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-2xs">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-500">Completed Orders</span>
            <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">28</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>5% vs last week</span>
            </div>
          </div>
        </div>

        {/* Delayed Orders */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500 text-white shadow-2xs">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-500">Delayed Orders</span>
            <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">2</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-rose-500">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>50% vs last week</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Main Grid (Left 2 cols, Right 1 col) ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Production Flow Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-xs">
            <div className="mb-5">
              <h2 className="text-base font-bold text-slate-900">Production Flow</h2>
              <p className="text-xs text-slate-400 font-medium">Current order movement</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 overflow-x-auto pb-2">
              {flowStages.map((stage, idx) => {
                const Icon = stage.icon;
                return (
                  <React.Fragment key={stage.label}>
                    <div className="flex flex-col items-center min-w-[72px] text-center">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${stage.color} mb-2 shadow-2xs transition-transform hover:scale-105`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500">{stage.label}</span>
                      <span className="text-sm font-black text-slate-900 mt-0.5">{stage.count}</span>
                    </div>

                    {idx < flowStages.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-slate-300 shrink-0 hidden sm:block" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Production Sections Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Production Sections</h2>
                <p className="text-xs text-slate-400 font-medium">Quick overview of all production areas</p>
              </div>

              <Link
                href="/reception/jobs?view=all"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
              >
                <span>View All Sections</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <div
                    key={sec.id}
                    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      {/* Section Top Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${sec.iconBg} text-white shadow-2xs`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">{sec.title}</h3>
                            <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                              {sec.subtitle}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            sec.statusType === 'running'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {sec.status}
                        </span>
                      </div>

                      {/* Stats Row */}
                      <div className="mt-4 flex items-center justify-between text-xs text-slate-600 font-semibold border-t border-slate-50 pt-3">
                        <span>{sec.activeJobs} Active Jobs</span>
                        <span>{sec.totalPcs}</span>
                        <span>{sec.dueToday} Due Today</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${sec.progressColor}`}
                            style={{ width: `${sec.progress}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 w-7 text-right">
                          {sec.progress}%
                        </span>
                      </div>
                    </div>

                    {/* View Button */}
                    <div className="mt-4 pt-2 flex justify-end">
                      <Link
                        href={`/reception/jobs?section=${sec.id}`}
                        onClick={() => onSelectSection?.(sec.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 transition"
                      >
                        <span>View</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Orders Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
              <Link
                href="/reception/jobs"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
              >
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${order.iconColor} shadow-2xs`}>
                      <Ticket className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-900">{order.id}</span>
                        <span className="text-xs font-bold text-slate-800 truncate">{order.client}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                        {order.details}
                      </p>
                    </div>
                  </div>

                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${order.statusColor}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Activity Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Latest Activity</h2>
              <Link
                href="/admin/audit-logs"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
              >
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {activities.map((act, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1.5 ${act.dotColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 leading-snug">{act.title}</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{act.subtitle}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 shrink-0">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
