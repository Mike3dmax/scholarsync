import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Calendar, Timer, BarChart3, Settings, X, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: ListTodo, label: 'Tasks' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/timer', icon: Timer, label: 'Focus' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <AnimatePresence>
        {isOpen && <motion.div className="fixed inset-0 z-40 bg-black/30 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />}
      </AnimatePresence>
      <aside className={`fixed top-0 left-0 z-50 h-full w-60 bg-scholar-surface dark:bg-scholar-surface-dark border-r flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 h-16 border-b">
          <NavLink to="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-scholar-accent to-scholar-secondary flex items-center justify-center"><GraduationCap size={18} className="text-white" /></div>
            <span className="font-display font-bold text-lg">Scholar<span className="text-scholar-accent">Sync</span></span>
          </NavLink>
          <button onClick={onClose} className="lg:hidden btn-ghost"><X size={18} /></button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-scholar-accent/10 text-scholar-accent' : 'text-scholar-muted dark:text-scholar-muted-dark hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t">
          <p className="text-[11px] text-scholar-muted dark:text-scholar-muted-dark font-medium uppercase tracking-wider">ScholarSync v1.0</p>
        </div>
      </aside>
    </>
  );
}

Sidebar.propTypes = { isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired };
