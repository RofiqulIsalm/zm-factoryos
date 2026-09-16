import React from 'react';
import { Link } from 'wouter';
import { 
  Star, 
  ArrowRight, 
  Tv, 
  Image as ImageIcon, 
  Layers, 
  SquareAsterisk 
} from 'lucide-react';

interface ProductItem {
  id: number;
  name: string;
  totalOrders: number;
  status: 'Active' | 'Inactive';
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const products: ProductItem[] = [
  {
    id: 1,
    name: 'Screen Printing',
    totalOrders: 52,
    status: 'Active',
    icon: Tv,
    iconBg: 'bg-indigo-500',
    iconColor: 'text-white',
  },
  {
    id: 2,
    name: 'Sublimation Printing',
    totalOrders: 38,
    status: 'Active',
    icon: ImageIcon,
    iconBg: 'bg-sky-500',
    iconColor: 'text-white',
  },
  {
    id: 3,
    name: 'Silicon Badge',
    totalOrders: 26,
    status: 'Active',
    icon: Layers,
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
  },
  {
    id: 4,
    name: 'PVC Badge',
    totalOrders: 18,
    status: 'Active',
    icon: SquareAsterisk,
    iconBg: 'bg-emerald-500',
    iconColor: 'text-white',
  },
];

export function DashboardTopProducts() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-sky-500">
            <Star className="h-3.5 w-3.5 fill-sky-500" />
          </span>
          <h2 className="text-base font-black text-slate-900">Top Products</h2>
        </div>
        <Link
          href="/settings"
          className="group inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Table */}
      <div className="mt-2 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400">
              <th className="pb-2.5 font-bold w-8">#</th>
              <th className="pb-2.5 font-bold">Product</th>
              <th className="pb-2.5 font-bold text-center">Total Orders</th>
              <th className="pb-2.5 font-bold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((item) => {
              const Icon = item.icon;
              return (
                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 font-semibold text-slate-400">
                    {item.id}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${item.iconBg} ${item.iconColor} shadow-xs`}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <span className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-center font-bold text-slate-600">
                    {item.totalOrders}
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
