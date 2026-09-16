import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDown } from 'lucide-react';

interface OrderOverviewDataPoint {
  day: string;
  totalOrders: number;
  completed: number;
}

const defaultChartData: OrderOverviewDataPoint[] = [
  { day: '07 Sep', totalOrders: 14, completed: 8 },
  { day: '08 Sep', totalOrders: 22, completed: 15 },
  { day: '09 Sep', totalOrders: 21, completed: 14 },
  { day: '10 Sep', totalOrders: 28, completed: 21 },
  { day: '11 Sep', totalOrders: 35, completed: 28 },
  { day: '12 Sep', totalOrders: 37, completed: 30 },
  { day: '13 Sep', totalOrders: 42, completed: 33 },
];

export function DashboardOrderOverviewChart() {
  const [timeRange, setTimeRange] = useState('7 Days');

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm h-full">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              📊
            </span>
            <h2 className="text-base font-black text-slate-900">Order Overview</h2>
          </div>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Last 7 Days</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
              <span>Total Orders</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Completed</span>
            </div>
          </div>

          {/* Timeframe dropdown selector */}
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-bold text-slate-700 outline-none hover:border-slate-300 focus:border-sky-500"
            >
              <option value="7 Days">7 Days</option>
              <option value="15 Days">15 Days</option>
              <option value="30 Days">30 Days</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    </div>

      {/* Area Chart Container */}
      <div className="mt-4 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={defaultChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
              domain={[0, 50]}
              ticks={[0, 10, 20, 30, 40, 50]}
            />
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
            <Area
              type="monotone"
              dataKey="totalOrders"
              stroke="#0ea5e9"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorTotal)"
              dot={{ r: 3, fill: '#0ea5e9', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#0284c7' }}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorCompleted)"
              dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#059669' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
