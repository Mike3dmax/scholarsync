import { useState, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from './store';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import { motion, AnimatePresence } from 'framer-motion';

const Login = lazy(() => import('./features/auth/Login'));
const Signup = lazy(() => import('./features/auth/Signup'));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));
const Tasks = lazy(() => import('./features/tasks/Tasks'));
const CalendarPage = lazy(() => import('./features/calendar/CalendarPage'));
const Timer = lazy(() => import('./features/timer/Timer'));
const Analytics = lazy(() => import('./features/analytics/Analytics'));
const Settings = lazy(() => import('./features/settings/Settings'));
const Landing = lazy(() => import('./features/landing/Landing'));

function Loader() {
  return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-6 h-6 border-2 border-scholar-accent border-t-transparent rounded-full animate-spin" /></div>;
}

function ProtectedLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <Suspense fallback={<Loader />}>{children}</Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function ThemeApplier({ children }) {
  const { user } = useUserStore();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', user?.theme === 'dark');
  }, [user?.theme]);
  return children;
}

export default function App() {
  const { isAuthenticated } = useUserStore();

  return (
    <BrowserRouter>
      <ThemeApplier>
        <Routes>
          <Route path="/auth/login" element={!isAuthenticated ? <Suspense><Login /></Suspense> : <Navigate to="/dashboard" />} />
          <Route path="/auth/signup" element={!isAuthenticated ? <Suspense><Signup /></Suspense> : <Navigate to="/dashboard" />} />
          <Route path="/" element={<Suspense><Landing /></Suspense>} />
          <Route path="/dashboard" element={isAuthenticated ? <ProtectedLayout><Dashboard /></ProtectedLayout> : <Navigate to="/auth/login" />} />
          <Route path="/tasks" element={isAuthenticated ? <ProtectedLayout><Tasks /></ProtectedLayout> : <Navigate to="/auth/login" />} />
          <Route path="/calendar" element={isAuthenticated ? <ProtectedLayout><CalendarPage /></ProtectedLayout> : <Navigate to="/auth/login" />} />
          <Route path="/timer" element={isAuthenticated ? <ProtectedLayout><Timer /></ProtectedLayout> : <Navigate to="/auth/login" />} />
          <Route path="/analytics" element={isAuthenticated ? <ProtectedLayout><Analytics /></ProtectedLayout> : <Navigate to="/auth/login" />} />
          <Route path="/settings" element={isAuthenticated ? <ProtectedLayout><Settings /></ProtectedLayout> : <Navigate to="/auth/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ThemeApplier>
    </BrowserRouter>
  );
}


