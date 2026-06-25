import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore, useUserStore } from '../../store';
import { isToday, isPast, format, addDays, getSubjectColor, getSubjectBadgeColor } from '../../utils/helpers';
import { Plus, Flame, ArrowRight, CheckSquare, BookOpen, Calendar, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const navigate = useNavigate();
  const { tasks, subjects, addTask } = useTaskStore();
  const { user } = useUserStore();
  const [quickAdd, setQuickAdd] = useState('');

  const todayTasks = tasks.filter(t => isToday(new Date(t.dueDate)) || isPast(new Date(t.dueDate))).slice(0, 3);
  const upcoming = tasks.filter(t => !isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);
  const pendingCount = tasks.filter(t => t.status !== 'done').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;

  function getSubject(id) {
    return subjects.find(s => s.id === id);
  }

  function handleQuickAdd(e) {
    e.preventDefault();
    if (!quickAdd.trim()) return;
    addTask({ title: quickAdd, subjectId: subjects[0]?.id, priority: 'medium', dueDate: addDays(new Date(), 3).toISOString(), status: 'todo', description: '' });
    setQuickAdd('');
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-scholar-muted dark:text-scholar-muted-dark mt-0.5">Here's your academic snapshot.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium">
          <Flame size={16} /> {user?.streak || 0} day streak
        </div>
      </div>

      {/* Quick Add */}
      <form onSubmit={handleQuickAdd} className="card p-4 flex items-center gap-3">
        <Plus size={18} className="text-scholar-muted flex-shrink-0" />
        <input value={quickAdd} onChange={e => setQuickAdd(e.target.value)} placeholder="Quick add a task..." className="flex-1 bg-transparent border-none outline-none text-sm placeholder-scholar-muted dark:placeholder-scholar-muted-dark" />
        <Button type="submit" size="sm" disabled={!quickAdd.trim()}>Add</Button>
      </form>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: tasks.length, icon: CheckSquare, color: 'text-scholar-accent bg-scholar-accent-light dark:bg-scholar-accent/20' },
          { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, icon: BookOpen, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
          { label: 'Completed', value: doneCount, icon: CheckSquare, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.color.split(' ').slice(1).join(' ')} flex items-center justify-center`}><s.icon size={18} className={s.color.split(' ')[0]} /></div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-scholar-muted dark:text-scholar-muted-dark">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Focus + Upcoming */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Today's Focus</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>View all <ArrowRight size={14} /></Button>
          </div>
          {todayTasks.length === 0 ? (
            <p className="text-sm text-scholar-muted py-6 text-center">No tasks due today. Enjoy your day!</p>
          ) : (
            <div className="space-y-2">
              {todayTasks.map((t, i) => {
                const subj = getSubject(t.subjectId);
                return (
                  <motion.div key={t.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate('/tasks')}>
                    <div className={`w-2 h-2 rounded-full ${getSubjectColor(subj?.color)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.title}</p>
                      <p className="text-xs text-scholar-muted">{subj?.name}</p>
                    </div>
                    <Badge variant={t.priority === 'high' ? 'red' : t.priority === 'medium' ? 'amber' : 'blue'}>{t.priority}</Badge>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Upcoming Deadlines</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')}>View all <ArrowRight size={14} /></Button>
          </div>
          <div className="overflow-x-auto scrollbar-hide -mx-1">
            <div className="flex gap-3 px-1 pb-1" style={{ minWidth: 'max-content' }}>
              {upcoming.map((t, i) => {
                const subj = getSubject(t.subjectId);
                return (
                  <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-hover p-4 min-w-[200px] cursor-pointer" onClick={() => navigate('/tasks')}>
                    <div className={`w-full h-1 rounded-full mb-3 ${getSubjectColor(subj?.color)}`} />
                    <p className="text-sm font-semibold line-clamp-2">{t.title}</p>
                    <p className="text-xs text-scholar-muted mt-1">{subj?.name}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-scholar-muted">
                      <Calendar size={12} /> {format(new Date(t.dueDate), 'MMM d')}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
