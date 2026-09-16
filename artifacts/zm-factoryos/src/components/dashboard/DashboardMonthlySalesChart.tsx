import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDown, TrendingUp } from 'lucide-react';

interface WeeklySalesPoint {
  week: string;
  sales: number; // in Lakhs
}

const defaultWeeklyData: WeeklySalesPoint[] = [
  { week: 'W1', sales: 0.8 },
  { week: 'W2', sales: 1.8 },
  { week: 'W3', sales: 2.2 },
  { week: 'W4', sales: 2.45 },
];

export function DashboardMonthlySalesChart() {
  const [period, setPeriod] = useState('This Month');

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm h-full">
      <div>
        {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
            📊
          </span>
          <h2 className="text-base font-black text-slate-900">Monthly Sales</h2>
        </div>

        {/* Dropdown */}
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-sky-500"
          >
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="This Year">This Year</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      {/* Sales Number & Growth */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-black tracking-tight text-slate-900">
          ৳ 2,45,000
        </span>
        <span className="inline-flex items-center text-xs font-bold text-emerald-600">
          <TrendingUp className="mr-0.5 h-3.5 w-3.5" />
          ↑ 20%
        </span>
        <span className="text-xs font-medium text-slate-400">vs. last month</span>
      </div>

      {/* Bar Chart Container */}
      <div className="mt-4 h-[160px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={defaultWeeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
              dy={5}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
              domain={[0, 3]}
              ticks={[0, 1, 2, 3]}
              tickFormatter={(v) => (v === 0 ? '0' : `${v}L`)}
            />
            <Tooltip
              formatter={(val: number | string | undefined) => [`৳ ${(Number(val || 0) * 100000).toLocaleString('en-IN')}`, 'Sales']}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            />
            <Bar
              dataKey="sales"
              fill="#0ea5e9"
              radius={[6, 6, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>
    </div>
  );
}
