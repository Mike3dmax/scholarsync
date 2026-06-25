import { create } from 'zustand';
import { mockTasks, mockSubjects, mockEvents, mockTimerSessions, mockUser } from '../services/mockData';
import { generateId } from '../utils/helpers';

/* Tasks store — manages tasks, subjects, and calendar events */
export const useTaskStore = create((set, get) => ({
  tasks: mockTasks,
  subjects: mockSubjects,
  events: mockEvents,
  filterSubject: 'all',
  filterPriority: 'all',
  viewMode: 'list', // 'list' | 'kanban'

  setFilterSubject: (id) => set({ filterSubject: id }),
  setFilterPriority: (p) => set({ filterPriority: p }),
  setViewMode: (mode) => set({ viewMode: mode }),

  addTask: (task) => set((s) => ({ tasks: [{ ...task, id: generateId(), createdAt: new Date().toISOString(), subtasks: [] }, ...s.tasks] })),

  updateTask: (id, updates) => set((s) => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates } : t) })),

  deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter(t => t.id !== id) })),

  moveTask: (id, newStatus) => set((s) => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, status: newStatus } : t) })),

  addSubtask: (taskId, title) => set((s) => ({ tasks: s.tasks.map(t => t.id === taskId ? { ...t, subtasks: [...t.subtasks, { id: generateId(), title, done: false }] } : t) })),

  toggleSubtask: (taskId, subtaskId) => set((s) => ({ tasks: s.tasks.map(t => t.id === taskId ? { ...t, subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, done: !st.done } : st) } : t) })),

  addSubject: (subject) => set((s) => ({ subjects: [...s.subjects, { ...subject, id: generateId() }] })),

  updateSubject: (id, updates) => set((s) => ({ subjects: s.subjects.map(sb => sb.id === id ? { ...sb, ...updates } : sb) })),

  deleteSubject: (id) => set((s) => ({ subjects: s.subjects.filter(sb => sb.id !== id) })),

  addEvent: (event) => set((s) => ({ events: [...s.events, { ...event, id: generateId() }] })),

  updateEvent: (id, updates) => set((s) => ({ events: s.events.map(e => e.id === id ? { ...e, ...updates } : e) })),

  deleteEvent: (id) => set((s) => ({ events: s.events.filter(e => e.id !== id) })),

  getFilteredTasks: () => {
    const { tasks, filterSubject, filterPriority } = get();
    return tasks.filter(t => {
      if (filterSubject !== 'all' && t.subjectId !== filterSubject) return false;
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
      return true;
    });
  },
}));

/* Timer store — manages Pomodoro sessions */
export const useTimerStore = create((set, get) => ({
  isRunning: false,
  seconds: 0,
  focusDuration: 1500, // 25 min
  breakDuration: 300,  // 5 min
  sessionType: 'focus',
  sessions: mockTimerSessions,
  intervalId: null,

  setFocusDuration: (d) => set({ focusDuration: d }),
  setBreakDuration: (d) => set({ breakDuration: d }),

  start: () => {
    const id = setInterval(() => {
      set((s) => {
        if (s.seconds <= 0) {
          clearInterval(s.intervalId);
          const newType = s.sessionType === 'focus' ? 'break' : 'focus';
          const newDuration = newType === 'focus' ? s.focusDuration : s.breakDuration;
          return { isRunning: false, seconds: newDuration, sessionType: newType, intervalId: null };
        }
        return { seconds: s.seconds - 1 };
      });
    }, 1000);
    set({ isRunning: true, intervalId: id });
  },

  pause: () => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({ isRunning: false, intervalId: null });
  },

  reset: () => {
    const { intervalId, focusDuration } = get();
    if (intervalId) clearInterval(intervalId);
    set({ isRunning: false, seconds: focusDuration, sessionType: 'focus', intervalId: null });
  },

  logSession: (subjectId, taskId) => {
    const { focusDuration, seconds } = get();
    const elapsed = focusDuration - seconds;
    if (elapsed > 0) {
      set((s) => ({ sessions: [...s.sessions, { id: generateId(), date: new Date().toISOString(), duration: elapsed, subjectId, taskId }] }));
    }
  },

  getTotalMinutes: () => {
    return get().sessions.reduce((acc, s) => acc + s.duration, 0) / 60;
  },
}));

/* User store — manages auth and preferences */
export const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: (email, password) => {
    set({ user: { ...mockUser, email }, isAuthenticated: true });
  },

  signup: (name, email) => {
    set({ user: { ...mockUser, name, email }, isAuthenticated: true });
  },

  logout: () => set({ user: null, isAuthenticated: false }),

  updateProfile: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),

  setTheme: (theme) => set((s) => ({ user: { ...s.user, theme } })),

  incrementStreak: () => set((s) => ({ user: { ...s.user, streak: (s.user?.streak || 0) + 1 } })),
}));
