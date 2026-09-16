import React from 'react';
import { Link } from 'wouter';
import { 
  ClipboardList, 
  Users, 
  CreditCard, 
  TrendingUp, 
  CircleDollarSign,
  CalendarDays
} from 'lucide-react';

interface DashboardKpiCardsProps {
  totalOrders?: number;
  todayWorkers?: number;
  todayPayable?: number;
  todayRevenue?: number;
  monthlyRevenue?: number;
}

export function DashboardKpiCards({
  totalOrders = 128,
  todayWorkers = 18,
  todayPayable = 24500,
  todayRevenue = 42000,
  monthlyRevenue = 245000,
}: DashboardKpiCardsProps) {
  const formatMoney = (val: number) => `৳ ${(val ?? 0).toLocaleString('en-IN')}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* 1. Total Orders */}
      <Link
        href="/reception/jobs"
        className="group block rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <ClipboardList className="h-5 w-5" />
          </div>
          <span className="text-[12px] font-semibold text-slate-500">
            Total Orders
          </span>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
            {totalOrders}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600 font-bold">
            <TrendingUp className="h-3 w-3 mr-0.5" />
            ↑ 12% <span className="text-slate-400 font-normal">vs. last month</span>
          </div>
        </div>
      </Link>

      {/* 2. Today's Present Worker */}
      <Link
        href="/admin/users"
        className="group block rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Users className="h-5 w-5" />
          </div>
          <span className="text-[12px] font-semibold text-slate-500">
            Present Worker
          </span>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
            {todayWorkers}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Today <span className="text-slate-400 font-normal">on floor</span>
          </div>
        </div>
      </Link>

      {/* 3. Today Payable Amount */}
      <Link
        href="/accounting"
        className="group block rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <CircleDollarSign className="h-5 w-5" />
          </div>
          <span className="text-[12px] font-semibold text-slate-500">
            Today Payable
          </span>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
            {formatMoney(todayPayable)}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-400">
            Due & expense payment today
          </div>
        </div>
      </Link>

      {/* 4. Today Revenue */}
      <Link
        href="/billing/payments"
        className="group block rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <CreditCard className="h-5 w-5" />
          </div>
          <span className="text-[12px] font-semibold text-slate-500">
            Today Revenue
          </span>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
            {formatMoney(todayRevenue)}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600 font-bold">
            <TrendingUp className="h-3 w-3 mr-0.5" />
            Received today
          </div>
        </div>
      </Link>

      {/* 5 & 6. Total Month Revenue (Takes 2 Columns: xl:col-span-2) */}
      <Link
        href="/md/kpi/revenue"
        className="group block xl:col-span-2 rounded-2xl border border-teal-100 bg-gradient-to-br from-white via-white to-teal-50/40 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-slate-800">
                Total Month Revenue
              </span>
              <p className="text-[10px] font-medium text-slate-400">Current Billing Cycle</p>
            </div>
          </div>
          <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-black text-teal-700">
            <TrendingUp className="mr-1 h-3 w-3" />
            ↑ 20%
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <p className="text-3xl font-black tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors">
            {formatMoney(monthlyRevenue)}
          </p>
          <span className="text-xs font-semibold text-slate-400">
            vs. last month
          </span>
        </div>
      </Link>
    </div>
  );
}
