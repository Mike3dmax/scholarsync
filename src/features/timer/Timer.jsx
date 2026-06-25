import { useState, useEffect } from 'react';
import { useTimerStore, useTaskStore } from '../../store';
import { formatTime } from '../../utils/helpers';
import { Play, Pause, RotateCcw, Timer as TimerIcon, Coffee, BookOpen } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

export default function Timer() {
  const { isRunning, seconds, focusDuration, breakDuration, sessionType, setFocusDuration, setBreakDuration, start, pause, reset, logSession } = useTimerStore();
  const { subjects, tasks } = useTaskStore();
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || '');
  const [selectedTask, setSelectedTask] = useState('');

  const progress = sessionType === 'focus'
    ? ((focusDuration - seconds) / focusDuration) * 100
    : ((breakDuration - seconds) / breakDuration) * 100;

  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (progress / 100) * circumference;

  // Log session when timer completes naturally
  useEffect(() => {
    if (seconds === 0 && sessionType === 'break' && focusDuration > 0) {
      logSession(selectedSubject || undefined, selectedTask || undefined);
    }
  }, [seconds, sessionType]);

  const subjectTasks = tasks.filter(t => t.subjectId === selectedSubject && t.status !== 'done');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Focus Timer</h1>
        <p className="text-sm text-scholar-muted dark:text-scholar-muted-dark mt-0.5">Stay in the zone with Pomodoro sessions.</p>
      </div>

      {/* Timer Display */}
      <Card className="p-8 flex flex-col items-center">
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="6" className="text-scholar-border dark:text-scholar-border-dark" />
            <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={offset} className={`transition-all duration-1000 ${sessionType === 'focus' ? 'text-scholar-accent' : 'text-amber-400'}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-5xl font-bold font-mono tracking-tight">{formatTime(seconds)}</span>
            <span className="text-xs text-scholar-muted mt-1 capitalize">{sessionType === 'focus' ? 'Focus' : 'Break'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isRunning ? (
            <Button variant="secondary" size="lg" onClick={pause}><Pause size={18} /> Pause</Button>
          ) : (
            <Button size="lg" onClick={start}><Play size={18} /> {seconds === focusDuration || seconds === breakDuration ? 'Start' : 'Resume'}</Button>
          )}
          <Button variant="ghost" size="lg" onClick={reset}><RotateCcw size={18} /></Button>
        </div>
      </Card>

      {/* Settings + Task Link */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-bold text-sm mb-3">Duration</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-scholar-muted">Focus (min)</label>
              <input type="number" value={focusDuration / 60} onChange={e => { const v = parseInt(e.target.value) * 60 || 1500; if (!isRunning) { reset(); setFocusDuration(v); } }} className="input-field text-sm py-1.5" min="1" max="120" />
            </div>
            <div>
              <label className="text-xs text-scholar-muted">Break (min)</label>
              <input type="number" value={breakDuration / 60} onChange={e => { const v = parseInt(e.target.value) * 60 || 300; if (!isRunning) { reset(); setBreakDuration(v); } }} className="input-field text-sm py-1.5" min="1" max="30" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold text-sm mb-3">Link to Subject</h3>
          <div className="space-y-3">
            <select value={selectedSubject} onChange={e => { setSelectedSubject(e.target.value); setSelectedTask(''); }} className="input-field text-sm py-1.5">
              <option value="">No subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {subjectTasks.length > 0 && (
              <select value={selectedTask} onChange={e => setSelectedTask(e.target.value)} className="input-field text-sm py-1.5">
                <option value="">No specific task</option>
                {subjectTasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="p-5">
        <h3 className="font-bold text-sm mb-3">Recent Sessions</h3>
        {useTimerStore.getState().sessions.length === 0 ? (
          <p className="text-sm text-scholar-muted py-4 text-center">No sessions yet. Start your first focus session!</p>
        ) : (
          <div className="space-y-2">
            {useTimerStore.getState().sessions.slice(-5).reverse().map(s => {
              const subj = subjects.find(sb => sb.id === s.subjectId);
              const task = tasks.find(t => t.id === s.taskId);
              return (
                <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                  <div className="w-8 h-8 rounded-lg bg-scholar-accent/10 flex items-center justify-center"><TimerIcon size={15} className="text-scholar-accent" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{subj?.name || 'General'}{task ? ` — ${task.title}` : ''}</p>
                    <p className="text-xs text-scholar-muted">{Math.floor(s.duration / 60)} min focused</p>
                  </div>
                  <span className="text-xs text-scholar-muted">{new Date(s.date).toLocaleDateString()}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
