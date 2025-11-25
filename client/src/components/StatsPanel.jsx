import { useMemo } from 'react';
import {
  CheckCircle2,
  ListTodo,
  CalendarDays,
  AlertTriangle,
  Repeat,
  BarChart3,
} from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon }) => (
  <div className="bg-white rounded-2xl shadow-sm border p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
      <Icon className="w-6 h-6" />
    </div>
    <div className="min-w-0">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold truncate">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

export default ({ tasks = [] }) => {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;

    const today = new Date();
    const toLocalDate = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;

    const todayStr = toLocalDate(today);

    const dueToday = tasks.filter((t) => {
      if (!t.dueDate) return false;
      return t.dueDate.slice(0, 10) === todayStr;
    }).length;

    const overdue = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      return !t.completed && due < new Date(todayStr);
    }).length;

    const completionRate =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    const priorityCounts = tasks.reduce(
      (acc, t) => {
        acc[t.priority || 'medium']++;
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );

    const recurring = tasks.filter((t) => t.isRecurring).length;

    const next7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const key = toLocalDate(d);
      const count = tasks.filter((t) => t.dueDate?.slice(0, 10) === key).length;
      return { date: key, count };
    });

    return {
      total,
      completed,
      pending,
      dueToday,
      overdue,
      completionRate,
      priorityCounts,
      recurring,
      next7,
    };
  }, [tasks]);

  return (
    <div className="mt-8 space-y-6">
      {/* Top stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total tasks" value={stats.total} icon={ListTodo} />
        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle={`${stats.completionRate}% completion`}
          icon={CheckCircle2}
        />
        <StatCard
          title="Due today"
          value={stats.dueToday}
          icon={CalendarDays}
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          subtitle={stats.overdue ? 'Needs attention' : "You're good 😌"}
          icon={AlertTriangle}
        />
      </div>

      {/* Second row: priorities + recurring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Priority breakdown</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">Low</p>
              <p className="text-2xl font-semibold">
                {stats.priorityCounts.low}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">Medium</p>
              <p className="text-2xl font-semibold">
                {stats.priorityCounts.medium}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">High</p>
              <p className="text-2xl font-semibold">
                {stats.priorityCounts.high}
              </p>
            </div>
          </div>
        </div>

        <StatCard
          title="Recurring tasks"
          value={stats.recurring}
          subtitle="Tasks that repeat"
          icon={Repeat}
        />
      </div>

      {/* Next 7 days mini grid */}
      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5" />
          <h3 className="font-semibold text-lg">Next 7 days</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {stats.next7.map((day) => (
            <div
              key={day.date}
              className="rounded-xl bg-gray-50 p-3 text-center"
            >
              <p className="text-xs text-gray-500">{day.date.slice(5)}</p>
              <p className="text-xl font-semibold">{day.count}</p>
              <p className="text-[11px] text-gray-400">due</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
