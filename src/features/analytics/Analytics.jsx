import { useMemo } from 'react';
import { useTaskStore, useTimerStore, useUserStore } from '../../store';
import { getSubjectColor } from '../../utils/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, BarChart, Bar } from 'recharts';
import Card from '../../components/ui/Card';
import { BarChart3, Clock, CheckCircle2, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, eachDayOfInterval, subDays, isSameDay } from 'date-fns';

export default function Analytics() {
  const { tasks, subjects } = useTaskStore();
  const { sessions } = useTimerStore();
  const { user } = useUserStore();

  // Subject distribution (tasks)
  const subjectDist = useMemo(() => {
    return subjects.map(s => {
      const count = tasks.filter(t => t.subjectId === s.id).length;
      return { name: s.name, value: count, color: s.color === 'emerald' ? '#10B981' : s.color === 'blue' ? '#3B82F6' : s.color === 'purple' ? '#8B5CF6' : s.color === 'pink' ? '#EC4899' : s.color === 'amber' ? '#F59E0B' : s.color === 'rose' ? '#F43F5E' : s.color === 'cyan' ? '#06B6D4' : '#6366F1' };
    }).filter(s => s.value > 0);
  }, [tasks, subjects]);

  // Completion rate over time (last 14 days)
  const completionData = useMemo(() => {
    const days = eachDayOfInterval({ start: subDays(new Date(), 13), end: new Date() });
    return days.map(day => {
      const dayStr = format(day, 'MMM d');
      const done = tasks.filter(t => isSameDay(new Date(t.createdAt), day) && t.status === 'done').length;
      const total = tasks.filter(t => isSameDay(new Date(t.createdAt), day)).length;
      return { day: dayStr, rate: total > 0 ? Math.round((done / total) * 100) : 0 };
    });
  }, [tasks]);

  // Focus time distribution
  const focusBySubject = useMemo(() => {
    return subjects.map(s => {
      const mins = sessions.filter(se => se.subjectId === s.id).reduce((acc, se) => acc + se.duration / 60, 0);
      return { name: s.name, minutes: Math.round(mins) };
    }).filter(s => s.minutes > 0);
  }, [sessions, subjects]);

  const totalFocusMinutes = sessions.reduce((acc, s) => acc + s.duration / 60, 0);
  const completionRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-scholar-muted mt-0.5">Track your productivity trends.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: tasks.length, icon: BarChart3, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Completion Rate', value: `${completionRate}%`, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
          { label: 'In Progress', value: inProgress, icon: Target, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
          { label: 'Focus Hours', value: Math.round(totalFocusMinutes / 60 * 10) / 10, icon: Clock, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.color.split(' ').slice(1).join(' ')} flex items-center justify-center`}><s.icon size={18} className={s.color.split(' ')[0]} /></div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-scholar-muted">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject Distribution (Pie) */}
        <Card className="p-5">
          <h3 className="font-bold text-sm mb-4">Tasks by Subject</h3>
          {subjectDist.length === 0 ? (
            <p className="text-sm text-scholar-muted py-8 text-center">No data yet.</p>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={subjectDist} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                    {subjectDist.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '13px', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {subjectDist.map(s => (
                  <div key={s.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-scholar-muted">{s.name}</span>
                    <span className="font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Focus Time by Subject (Bar) */}
        <Card className="p-5">
          <h3 className="font-bold text-sm mb-4">Focus Time by Subject</h3>
          {focusBySubject.length === 0 ? (
            <p className="text-sm text-scholar-muted py-8 text-center">Use the timer to log focus time.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={focusBySubject} layout="vertical">
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717A' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717A' }} width={80} />
                <Tooltip contentStyle={{ fontSize: '13px', borderRadius: '8px' }} formatter={v => [`${v} min`, 'Focus Time']} />
                <Bar dataKey="minutes" fill="#10B981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Completion Rate Trend */}
      <Card className="p-5">
        <h3 className="font-bold text-sm mb-4">Task Completion Rate (14 days)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={completionData}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717A' }} interval={1} />
            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717A' }} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={{ fontSize: '13px', borderRadius: '8px' }} formatter={v => [`${v}%`, 'Completion']} />
            <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={2.5} dot={{ fill: '#10B981', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
