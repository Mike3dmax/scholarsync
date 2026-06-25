import { useState } from 'react';
import { useTaskStore } from '../../store';
import { formatDate, getSubjectColor, getSubjectBadgeColor, getPriorityColor } from '../../utils/helpers';
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor, useDraggable, useDroppable } from '@dnd-kit/core';
import { Plus, GripVertical, List, Columns, Trash2, CheckCircle2, Circle, ChevronDown } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

const columns = [
  { id: 'todo', label: 'To Do', color: 'bg-blue-500' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-amber-500' },
  { id: 'review', label: 'Review', color: 'bg-purple-500' },
  { id: 'done', label: 'Done', color: 'bg-emerald-500' },
];

/* Draggable card */
function TaskCard({ task, onClick }) {
  const { subjects } = useTaskStore();
  const subj = subjects.find(s => s.id === task.subjectId);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id, data: { task, status: task.status } });

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 } : {};

  return (
    <div ref={setNodeRef} style={style} className={`card-hover p-3 cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50 ring-2 ring-scholar-accent' : ''}`} onClick={() => onClick(task)}>
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="mt-0.5 text-scholar-muted"><GripVertical size={14} /></div>
        <div className="flex-1 min-w-0">
          <span className={`badge-subject ${getSubjectBadgeColor(subj?.color)}`}>{subj?.name || 'General'}</span>
          <p className="text-sm font-semibold mt-1.5">{task.title}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-scholar-muted">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${getPriorityColor(task.priority)}`}>{task.priority}</span>
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Column drop zone */
function Column({ column, tasks, onTaskClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div ref={setNodeRef} className={`flex-1 min-w-[260px] rounded-2xl p-3 transition-colors ${isOver ? 'bg-scholar-accent/5 ring-1 ring-scholar-accent/30' : 'bg-black/[0.02] dark:bg-white/[0.02]'}`}>
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
        <span className="text-sm font-bold">{column.label}</span>
        <span className="text-xs text-scholar-muted ml-auto">{tasks.length}</span>
      </div>
      <div className="space-y-2 min-h-[200px]">
        <AnimatePresence>
          {tasks.map(t => (
            <motion.div key={t.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <TaskCard task={t} onClick={onTaskClick} />
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && <p className="text-xs text-scholar-muted text-center py-8">Drop tasks here</p>}
      </div>
    </div>
  );
}

/* Main page */
export default function Tasks() {
  const { tasks, subjects, filterSubject, filterPriority, setFilterSubject, setFilterPriority, viewMode, setViewMode, updateTask, deleteTask, addSubtask, toggleSubtask, addTask } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState(null);
  const [newSubtask, setNewSubtask] = useState('');
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', subjectId: subjects[0]?.id || '', priority: 'medium', dueDate: '', description: '' });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const taskId = active.id;
    const task = tasks.find(t => t.id === taskId);
    if (task && over.id !== task.status && columns.some(c => c.id === over.id)) {
      updateTask(taskId, { status: over.id });
    }
  }

  function handleCreateTask() {
    if (!newTask.title.trim()) return;
    addTask({ ...newTask, dueDate: newTask.dueDate || new Date().toISOString(), status: 'todo' });
    setNewTask({ title: '', subjectId: subjects[0]?.id || '', priority: 'medium', dueDate: '', description: '' });
    setShowNewTask(false);
  }

  const filtered = tasks.filter(t => {
    if (filterSubject !== 'all' && t.subjectId !== filterSubject) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="max-w-6xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-sm text-scholar-muted mt-0.5">{filtered.length} tasks</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-black/5 dark:bg-white/5 rounded-xl p-0.5">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-white dark:bg-scholar-surface-dark shadow-sm' : 'text-scholar-muted'}`}><List size={16} /></button>
            <button onClick={() => setViewMode('kanban')} className={`p-2 rounded-lg text-xs font-medium transition-all ${viewMode === 'kanban' ? 'bg-white dark:bg-scholar-surface-dark shadow-sm' : 'text-scholar-muted'}`}><Columns size={16} /></button>
          </div>
          <Button size="sm" onClick={() => setShowNewTask(true)}><Plus size={14} /> New Task</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="input-field w-auto text-xs py-1.5 px-3">
          <option value="all">All Subjects</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="input-field w-auto text-xs py-1.5 px-3">
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide" style={{ minHeight: '60vh' }}>
            {columns.map(col => (
              <Column key={col.id} column={col} tasks={filtered.filter(t => t.status === col.id)} onTaskClick={setSelectedTask} />
            ))}
          </div>
        </DndContext>
      ) : (
        /* List View */
        <div className="space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-scholar-muted"><p>No tasks match your filters.</p></div>
          ) : (
            filtered.map((t, i) => {
              const subj = subjects.find(s => s.id === t.subjectId);
              return (
                <motion.div key={t.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => setSelectedTask(t)}>
                  <div className={`w-2 h-2 rounded-full ${getSubjectColor(subj?.color)} flex-shrink-0`} />
                  <span className={`text-xs font-medium ${getSubjectBadgeColor(subj?.color)} px-2 py-0.5 rounded-full flex-shrink-0`}>{subj?.name}</span>
                  <span className="flex-1 text-sm font-medium truncate">{t.title}</span>
                  <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${getPriorityColor(t.priority)}`}>{t.priority}</span>
                  <span className="text-xs text-scholar-muted hidden sm:block">{columns.find(c => c.id === t.status)?.label}</span>
                  <span className="text-xs text-scholar-muted">{formatDate(t.dueDate)}</span>
                  <button onClick={(e) => { e.stopPropagation(); deleteTask(t.id); }} className="btn-ghost opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* Task Detail Modal */}
      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Task Details" size="lg">
        {selectedTask && (() => {
          const t = tasks.find(tt => tt.id === selectedTask.id);
          if (!t) return null;
          const subj = subjects.find(s => s.id === t.subjectId);

          return (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`badge-subject ${getSubjectBadgeColor(subj?.color)}`}>{subj?.name}</span>
                  <h3 className="text-xl font-bold mt-2">{t.title}</h3>
                </div>
                <div className="flex gap-1">
                  <select value={t.status} onChange={e => updateTask(t.id, { status: e.target.value })} className="input-field w-auto text-xs py-1.5">
                    {columns.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                  <button onClick={() => { deleteTask(t.id); setSelectedTask(null); }} className="btn-ghost text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
              {t.description && <p className="text-sm text-scholar-muted">{t.description}</p>}
              <div className="flex gap-4 text-sm text-scholar-muted">
                <span>Due: {formatDate(t.dueDate)}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(t.priority)}`}>{t.priority}</span>
              </div>

              {/* Subtasks */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Subtasks ({t.subtasks.filter(st => st.done).length}/{t.subtasks.length})</h4>
                <div className="space-y-1">
                  {t.subtasks.map(st => (
                    <div key={st.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" onClick={() => toggleSubtask(t.id, st.id)}>
                      {st.done ? <CheckCircle2 size={16} className="text-scholar-accent" /> : <Circle size={16} className="text-scholar-muted" />}
                      <span className={`text-sm ${st.done ? 'line-through text-scholar-muted' : ''}`}>{st.title}</span>
                    </div>
                  ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); if (newSubtask.trim()) { addSubtask(t.id, newSubtask); setNewSubtask(''); } }} className="flex gap-2 mt-2">
                  <input value={newSubtask} onChange={e => setNewSubtask(e.target.value)} placeholder="Add subtask..." className="input-field text-xs py-1.5" />
                  <Button type="submit" size="sm" variant="ghost"><Plus size={14} /></Button>
                </form>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* New Task Modal */}
      <Modal isOpen={showNewTask} onClose={() => setShowNewTask(false)} title="New Task">
        <div className="space-y-4">
          <input value={newTask.title} onChange={e => setNewTask(t => ({ ...t, title: e.target.value }))} placeholder="Task title" className="input-field" autoFocus />
          <textarea value={newTask.description} onChange={e => setNewTask(t => ({ ...t, description: e.target.value }))} placeholder="Description (optional)" className="input-field min-h-[80px]" />
          <div className="grid grid-cols-2 gap-3">
            <select value={newTask.subjectId} onChange={e => setNewTask(t => ({ ...t, subjectId: e.target.value }))} className="input-field">
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={newTask.priority} onChange={e => setNewTask(t => ({ ...t, priority: e.target.value }))} className="input-field">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
          </div>
          <input type="date" value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : ''} onChange={e => setNewTask(t => ({ ...t, dueDate: new Date(e.target.value).toISOString() }))} className="input-field" />
          <Button onClick={handleCreateTask} className="w-full" disabled={!newTask.title.trim()}><Plus size={16} /> Create Task</Button>
        </div>
      </Modal>
    </div>
  );
}
