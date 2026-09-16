import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface DashboardJobDistributionChartProps {
  totalOrders?: number;
  completed?: number;
  inProduction?: number;
}

export function DashboardJobDistributionChart({
  totalOrders = 128,
  completed = 76,
  inProduction = 45,
}: DashboardJobDistributionChartProps) {
  // Other / Queue jobs = total - (completed + inProduction)
  const remaining = Math.max(0, totalOrders - (completed + inProduction));

  const data = [
    { name: 'Completed Orders', value: completed, color: '#10b981' },       // Emerald
    { name: 'In Production', value: inProduction, color: '#0ea5e9' },       // Sky blue
    { name: 'Queue / Pending', value: remaining > 0 ? remaining : 7, color: '#f59e0b' }, // Amber
  ];

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-50 text-sky-600">
              <PieChartIcon className="h-4 w-4" />
            </span>
            <h2 className="text-base font-black text-slate-900">Job Distribution</h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            Total: {totalOrders}
          </span>
        </div>
        <p className="text-xs font-medium text-slate-400 mt-0.5">
          Live breakdown of current orders
        </p>
      </div>

      {/* Donut Chart with Center Stat */}
      <div className="relative my-2 h-[180px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text inside Donut */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-slate-900">{totalOrders}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jobs</span>
        </div>
      </div>

      {/* Custom Bottom Legend with Counts */}
      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
        <div className="rounded-xl bg-emerald-50/50 p-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Completed</span>
          </div>
          <p className="text-sm font-black text-slate-900 mt-0.5">{completed}</p>
        </div>

        <div className="rounded-xl bg-sky-50/50 p-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-sky-700">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            <span>Production</span>
          </div>
          <p className="text-sm font-black text-slate-900 mt-0.5">{inProduction}</p>
        </div>

        <div className="rounded-xl bg-amber-50/50 p-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-amber-700">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Pending</span>
          </div>
          <p className="text-sm font-black text-slate-900 mt-0.5">{remaining > 0 ? remaining : 7}</p>
        </div>
      </div>
    </div>
  );
}
