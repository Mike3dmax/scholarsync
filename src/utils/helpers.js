import { format, formatDistanceToNow, isToday, isTomorrow, isPast, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, getHours, isSameMonth, isSameDay, setHours, setMinutes } from 'date-fns';

export { format, formatDistanceToNow, isToday, isTomorrow, isPast, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, getHours, isSameMonth, isSameDay, setHours, setMinutes };

export function formatDate(date) {
  return format(new Date(date), 'MMM d, yyyy');
}

export function formatTime(date) {
  return format(new Date(date), 'h:mm a');
}

export function formatDateTime(date) {
  return format(new Date(date), 'MMM d, h:mm a');
}

export function getRelativeTime(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getInitials(name) {
  return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
}

export function getPriorityColor(priority) {
  const map = { low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' };
  return map[priority] || map.low;
}

export function getSubjectColor(color) {
  const map = { emerald: 'bg-emerald-500', blue: 'bg-blue-500', purple: 'bg-purple-500', pink: 'bg-pink-500', amber: 'bg-amber-500', rose: 'bg-rose-500', cyan: 'bg-cyan-500', indigo: 'bg-indigo-500' };
  return map[color] || map.emerald;
}

export function getSubjectBadgeColor(color) {
  const map = { emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300', amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300', cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300', indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' };
  return map[color] || map.emerald;
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
