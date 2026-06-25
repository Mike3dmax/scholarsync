import { useState, useMemo } from 'react';
import { useTaskStore } from '../../store';
import { startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, format, isSameMonth, isSameDay, isToday, getHours, setHours, setMinutes, addDays } from '../../utils/helpers';
import { ChevronLeft, ChevronRight, Plus, CalendarDays, Calendar as CalendarIcon } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { getSubjectColor, getSubjectBadgeColor } from '../../utils/helpers';
import { motion } from 'framer-motion';

const views = ['monthly', 'weekly', 'daily'];

export default function CalendarPage() {
  const { events, subjects, addEvent, tasks } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('monthly');
  const [showNew, setShowNew] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', subjectId: subjects[0]?.id, type: 'study', start: '', end: '', date: format(new Date(), 'yyyy-MM-dd') });

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  function getEventsForDay(day) {
    return events.filter(e => isSameDay(new Date(e.start), day));
  }

  function getTasksForDay(day) {
    return tasks.filter(t => isSameDay(new Date(t.dueDate), day));
  }

  function handleCreateEvent() {
    if (!newEvent.title.trim()) return;
    const start = new Date(`${newEvent.date}T09:00`);
    const end = new Date(`${newEvent.date}T10:00`);
    addEvent({ ...newEvent, start: start.toISOString(), end: end.toISOString(), recurring: false });
    setShowNew(false);
    setNewEvent({ title: '', subjectId: subjects[0]?.id, type: 'study', start: '', end: '', date: format(new Date(), 'yyyy-MM-dd') });
  }

  function getSubject(id) { return subjects.find(s => s.id === id); }

  const hours = Array.from({ length: 10 }, (_, i) => i + 7); // 7 AM - 4 PM

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h1>
          <div className="flex gap-1">
            <button onClick={() => setCurrentDate(d => addDays(d, -30))} className="btn-ghost"><ChevronLeft size={18} /></button>
            <button onClick={() => setCurrentDate(new Date())} className="btn-ghost text-xs font-medium">Today</button>
            <button onClick={() => setCurrentDate(d => addDays(d, 30))} className="btn-ghost"><ChevronRight size={18} /></button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-black/5 dark:bg-white/5 rounded-xl p-0.5">
            {views.map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${view === v ? 'bg-white dark:bg-scholar-surface-dark shadow-sm' : 'text-scholar-muted'}`}>{v}</button>
            ))}
          </div>
          <Button size="sm" onClick={() => setShowNew(true)}><Plus size={14} /> Event</Button>
        </div>
      </div>

      {/* Monthly View */}
      {view === 'monthly' && (
        <Card className="p-4 overflow-hidden">
          <div className="grid grid-cols-7 gap-px">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-medium text-scholar-muted py-2">{d}</div>
            ))}
            {monthDays.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              const dayTasks = getTasksForDay(day);
              const inMonth = isSameMonth(day, currentDate);
              return (
                <div key={i} className={`min-h-[80px] p-1.5 border-t border-l first:border-l-0 ${inMonth ? '' : 'opacity-30'}`}>
                  <span className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded-full ${isToday(day) ? 'bg-scholar-accent text-white font-bold' : 'font-medium'}`}>
                    {format(day, 'd')}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 2).map(e => {
                      const subj = getSubject(e.subjectId);
                      return <div key={e.id} className={`text-[10px] px-1.5 py-0.5 rounded ${getSubjectBadgeColor(subj?.color)} truncate`}>{e.title}</div>;
                    })}
                    {dayTasks.filter(t => t.status !== 'done').slice(0, 1).map(t => (
                      <div key={t.id} className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 truncate">📌 {t.title}</div>
                    ))}
                    {(dayEvents.length > 2 || dayTasks.length > 1) && <div className="text-[10px] text-scholar-muted pl-1">+{dayEvents.length + dayTasks.length - 3} more</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Weekly View */}
      {view === 'weekly' && (
        <Card className="p-4 overflow-x-auto">
          <div className="grid grid-cols-7 gap-px min-w-[600px]">
            {weekDays.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              const dayTasks = getTasksForDay(day);
              return (
                <div key={i} className="border-r last:border-r-0">
                  <div className={`text-center py-2 ${isToday(day) ? 'bg-scholar-accent/10 rounded-lg' : ''}`}>
                    <p className="text-xs text-scholar-muted">{format(day, 'EEE')}</p>
                    <span className={`inline-flex items-center justify-center w-7 h-7 text-sm rounded-full mt-0.5 ${isToday(day) ? 'bg-scholar-accent text-white font-bold' : 'font-medium'}`}>{format(day, 'd')}</span>
                  </div>
                  <div className="space-y-1 p-1 min-h-[200px]">
                    {hours.map(h => {
                      const hourEvents = dayEvents.filter(e => getHours(new Date(e.start)) === h);
                      return (
                        <div key={h} className="h-8 border-t border-dashed border-scholar-border dark:border-scholar-border-dark relative group">
                          {hourEvents.map(e => {
                            const subj = getSubject(e.subjectId);
                            return <div key={e.id} className={`absolute inset-x-0 top-0 text-[10px] px-1 py-0.5 rounded truncate ${getSubjectBadgeColor(subj?.color)}`}>{e.title}</div>;
                          })}
                          {dayTasks.filter(t => t.status !== 'done' && getHours(new Date(t.dueDate)) === h).map(t => (
                            <div key={t.id} className="absolute inset-x-0 top-0 text-[10px] px-1 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 truncate">📌 {t.title}</div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Daily View */}
      {view === 'daily' && (
        <Card className="p-4">
          <h3 className="font-bold mb-4 text-center">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h3>
          <div className="space-y-0">
            {hours.map(h => {
              const dayEvents = getEventsForDay(currentDate).filter(e => getHours(new Date(e.start)) === h);
              const dayTasks = getTasksForDay(currentDate).filter(t => t.status !== 'done' && getHours(new Date(t.dueDate)) === h);
              return (
                <div key={h} className="flex gap-3 py-2 border-t border-dashed border-scholar-border dark:border-scholar-border-dark min-h-[48px]">
                  <span className="text-xs text-scholar-muted w-12 text-right pt-0.5">{h > 12 ? h - 12 : h}{h >= 12 ? 'p' : 'a'}</span>
                  <div className="flex-1 space-y-1">
                    {dayEvents.map(e => {
                      const subj = getSubject(e.subjectId);
                      return <div key={e.id} className={`text-xs px-2 py-1 rounded ${getSubjectBadgeColor(subj?.color)}`}>{e.title}</div>;
                    })}
                    {dayTasks.map(t => (
                      <div key={t.id} className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-600">📌 {t.title}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* New Event Modal */}
      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="New Event">
        <div className="space-y-4">
          <input value={newEvent.title} onChange={e => setNewEvent(ev => ({ ...ev, title: e.target.value }))} placeholder="Event title" className="input-field" />
          <select value={newEvent.subjectId} onChange={e => setNewEvent(ev => ({ ...ev, subjectId: e.target.value }))} className="input-field">
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={newEvent.type} onChange={e => setNewEvent(ev => ({ ...ev, type: e.target.value }))} className="input-field">
            <option value="class">Class</option><option value="study">Study</option><option value="office_hours">Office Hours</option><option value="exam">Exam</option>
          </select>
          <input type="date" value={newEvent.date} onChange={e => setNewEvent(ev => ({ ...ev, date: e.target.value }))} className="input-field" />
          <Button onClick={handleCreateEvent} className="w-full"><Plus size={16} /> Create Event</Button>
        </div>
      </Modal>
    </div>
  );
}
