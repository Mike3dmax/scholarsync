import { useState } from 'react';
import { useTaskStore, useUserStore } from '../../store';
import { Download, LogOut, Plus, Trash2, Palette, Sun, Moon } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';

const colorOptions = ['emerald', 'blue', 'purple', 'pink', 'amber', 'rose', 'cyan', 'indigo'];

export default function Settings() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useTaskStore();
  const { user, updateProfile, logout, setTheme } = useUserStore();
  const navigate = useNavigate();
  const [showNewSubject, setShowNewSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', color: 'emerald' });
  const [saved, setSaved] = useState(false);

  function handleExport() {
    const data = { user, tasks: useTaskStore.getState().tasks, subjects: useTaskStore.getState().subjects, events: useTaskStore.getState().events };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scholarsync-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleLogout() {
    logout();
    navigate('/auth/login');
  }

  const isDark = user?.theme === 'dark';

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-scholar-muted mt-0.5">Customize your experience.</p>
      </div>

      {/* Profile */}
      <Card className="p-5">
        <h3 className="font-bold text-sm mb-4">Profile</h3>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-scholar-accent to-scholar-secondary flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S'}
          </div>
          <div>
            <p className="font-bold text-lg">{user?.name}</p>
            <p className="text-sm text-scholar-muted">{user?.email}</p>
            <p className="text-xs text-scholar-muted mt-0.5">{user?.major} · {user?.academicLevel}</p>
          </div>
        </div>
      </Card>

      {/* Theme */}
      <Card className="p-5">
        <h3 className="font-bold text-sm mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? <Moon size={18} className="text-scholar-muted" /> : <Sun size={18} className="text-amber-500" />}
            <span className="text-sm">Theme</span>
          </div>
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={`relative w-11 h-6 rounded-full transition-colors ${isDark ? 'bg-scholar-accent' : 'bg-scholar-border'}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isDark ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </Card>

      {/* Subjects */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm">Subjects</h3>
          <Button size="sm" variant="secondary" onClick={() => setShowNewSubject(true)}><Plus size={14} /> Add</Button>
        </div>
        <div className="space-y-2">
          {subjects.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5">
              <div className={`w-3 h-3 rounded-full ${s.color === 'emerald' ? 'bg-emerald-500' : s.color === 'blue' ? 'bg-blue-500' : s.color === 'purple' ? 'bg-purple-500' : s.color === 'pink' ? 'bg-pink-500' : s.color === 'amber' ? 'bg-amber-500' : s.color === 'rose' ? 'bg-rose-500' : s.color === 'cyan' ? 'bg-cyan-500' : 'bg-indigo-500'}`} />
              <span className="flex-1 text-sm font-medium">{s.name}</span>
              <span className="text-xs text-scholar-muted">{s.semester}</span>
              <button onClick={() => deleteSubject(s.id)} className="btn-ghost text-red-400 opacity-0 hover:opacity-100"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </Card>

      {/* Data */}
      <Card className="p-5">
        <h3 className="font-bold text-sm mb-4">Data</h3>
        <Button variant="secondary" onClick={handleExport}><Download size={16} /> {saved ? 'Exported!' : 'Export Data (JSON)'}</Button>
      </Card>

      {/* Logout */}
      <Card className="p-5">
        <Button variant="danger" onClick={handleLogout}><LogOut size={16} /> Sign Out</Button>
      </Card>

      {/* New Subject Modal */}
      <Modal isOpen={showNewSubject} onClose={() => setShowNewSubject(false)} title="Add Subject">
        <div className="space-y-4">
          <input value={newSubject.name} onChange={e => setNewSubject(s => ({ ...s, name: e.target.value }))} placeholder="Subject name" className="input-field" autoFocus />
          <div>
            <label className="text-xs text-scholar-muted block mb-2">Color</label>
            <div className="flex gap-2">
              {colorOptions.map(c => (
                <button key={c} onClick={() => setNewSubject(s => ({ ...s, color: c }))} className={`w-8 h-8 rounded-full ${c === 'emerald' ? 'bg-emerald-500' : c === 'blue' ? 'bg-blue-500' : c === 'purple' ? 'bg-purple-500' : c === 'pink' ? 'bg-pink-500' : c === 'amber' ? 'bg-amber-500' : c === 'rose' ? 'bg-rose-500' : c === 'cyan' ? 'bg-cyan-500' : 'bg-indigo-500'} ${newSubject.color === c ? 'ring-2 ring-offset-2 ring-offset-scholar-surface dark:ring-offset-scholar-surface-dark' : ''}`} />
              ))}
            </div>
          </div>
          <Button onClick={() => { if (newSubject.name.trim()) { addSubject({ name: newSubject.name, color: newSubject.color, semester: 'Fall 2026' }); setShowNewSubject(false); setNewSubject({ name: '', color: 'emerald' }); } }} className="w-full"><Plus size={16} /> Add Subject</Button>
        </div>
      </Modal>
    </div>
  );
}
