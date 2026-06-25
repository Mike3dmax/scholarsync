import { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Sun, Moon, BookOpen, CheckCircle2, Timer, X } from 'lucide-react';
import { useUserStore } from '../../store';
import PropTypes from 'prop-types';

const mockNotifications = [
  { id: 1, icon: CheckCircle2, text: 'Task "Math HW" moved to Done', time: '5 min ago', color: 'text-scholar-accent' },
  { id: 2, icon: Timer, text: 'Focus session completed — 25 min', time: '1 hr ago', color: 'text-blue-500' },
  { id: 3, icon: BookOpen, text: 'Upcoming: CS 101 exam tomorrow', time: '3 hr ago', color: 'text-amber-500' },
];

export default function Header({ onMenuClick }) {
  const { user, setTheme } = useUserStore();
  const isDark = user?.theme === 'dark';
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    }
    if (showNotif) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNotif]);

  return (
    <header className="sticky top-0 z-30 glass border-b border-scholar-border dark:border-scholar-border-dark">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <button onClick={onMenuClick} className="lg:hidden btn-ghost -ml-2"><Menu size={20} /></button>
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-sm text-scholar-muted dark:text-scholar-muted-dark">Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'},</span>
          <span className="text-sm font-semibold">{user?.name?.split(' ')[0] || 'Student'}</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="btn-ghost" aria-label="Toggle theme">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="relative" ref={notifRef}>
            <button onClick={() => setShowNotif(v => !v)} className="btn-ghost relative" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-scholar-accent rounded-full" />
            </button>
            {showNotif && (
              <div className="absolute right-0 top-full mt-2 w-80 card p-0 overflow-hidden shadow-card-hover border border-scholar-border dark:border-scholar-border-dark">
                <div className="flex items-center justify-between px-4 py-3 border-b border-scholar-border dark:border-scholar-border-dark">
                  <span className="text-sm font-bold">Notifications</span>
                  <button onClick={() => setShowNotif(false)} className="text-scholar-muted hover:text-scholar-text dark:hover:text-scholar-text-dark"><X size={16} /></button>
                </div>
                <div className="p-2">
                  {mockNotifications.map(n => (
                    <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-scholar-surface dark:bg-scholar-surface-dark flex items-center justify-center flex-shrink-0">
                        <n.icon size={15} className={n.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{n.text}</p>
                        <p className="text-xs text-scholar-muted mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-scholar-accent to-scholar-secondary flex items-center justify-center text-white text-xs font-bold ml-1">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S'}
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = { onMenuClick: PropTypes.func.isRequired };
