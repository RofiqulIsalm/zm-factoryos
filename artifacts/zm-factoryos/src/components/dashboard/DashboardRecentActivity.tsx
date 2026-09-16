import React from 'react';
import { Link } from 'wouter';
import { 
  Bell, 
  ArrowRight,
  ClipboardList,
  PlayCircle,
  CreditCard,
  CheckCircle2,
  UserPlus
} from 'lucide-react';
import type { Activity as ActivityType } from '@workspace/api-client-react';

interface DashboardRecentActivityProps {
  items?: ActivityType[];
}

interface ActivityDisplayItem {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

export function DashboardRecentActivity({ items }: DashboardRecentActivityProps) {
  // If backend has real activity records, map them; otherwise use the realistic mockup activity
  const defaultActivities: ActivityDisplayItem[] = [
    {
      id: '1',
      title: 'New Order Received',
      subtitle: 'Order #1025 from Target',
      timeAgo: '2 hours ago',
      icon: ClipboardList,
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white',
    },
    {
      id: '2',
      title: 'Production Started',
      subtitle: 'Screen Printing - Order #1023',
      timeAgo: '4 hours ago',
      icon: PlayCircle,
      iconBg: 'bg-sky-500',
      iconColor: 'text-white',
    },
    {
      id: '3',
      title: 'Payment Received',
      subtitle: '৳ 45,000 from Walmart',
      timeAgo: '6 hours ago',
      icon: CreditCard,
      iconBg: 'bg-indigo-500',
      iconColor: 'text-white',
    },
    {
      id: '4',
      title: 'Order Completed',
      subtitle: 'Order #1018 from New Era',
      timeAgo: '8 hours ago',
      icon: CheckCircle2,
      iconBg: 'bg-amber-500',
      iconColor: 'text-white',
    },
    {
      id: '5',
      title: 'New Customer Added',
      subtitle: 'Perry Ellis',
      timeAgo: '1 day ago',
      icon: UserPlus,
      iconBg: 'bg-rose-500',
      iconColor: 'text-white',
    },
  ];

  const activities = (items && items.length > 0)
    ? items.slice(0, 5).map((item, idx) => {
        const icons = [ClipboardList, PlayCircle, CreditCard, CheckCircle2, UserPlus];
        const colors = [
          'bg-emerald-500',
          'bg-sky-500',
          'bg-indigo-500',
          'bg-amber-500',
          'bg-rose-500'
        ];
        return {
          id: item.id,
          title: item.title,
          subtitle: item.description,
          timeAgo: new Date(item.createdAt).toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          icon: icons[idx % icons.length],
          iconBg: colors[idx % colors.length],
          iconColor: 'text-white',
        };
      })
    : defaultActivities;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
            <Bell className="h-3.5 w-3.5" />
          </span>
          <h2 className="text-base font-black text-slate-900">Recent Activity</h2>
        </div>
        <Link
          href="/admin/audit-logs"
          className="group inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Activity Timeline List */}
      <div className="mt-2 divide-y divide-slate-100">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="flex items-start gap-3.5 py-3 first:pt-1 last:pb-0">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${act.iconBg} ${act.iconColor} shadow-sm mt-0.5`}>
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-xs font-black text-slate-900">
                    {act.title}
                  </p>
                  <span className="shrink-0 text-[10px] font-semibold text-slate-400">
                    {act.timeAgo}
                  </span>
                </div>
                <p className="truncate text-[11px] font-medium text-slate-500 mt-0.5">
                  {act.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
