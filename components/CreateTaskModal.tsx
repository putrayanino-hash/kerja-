import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { User, TaskStatus, Task, Comment, Event, Subtask, KanbanColumn } from '../types';
import { Link as LinkIcon, Clock, FileText, Calendar, Send, CheckCircle, Circle, Plus, X, CheckSquare, Square, Layers, Zap, Trash2, Activity, Flag } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUser: User;
  events: Event[];
  columns?: KanbanColumn[]; 
  onSave: (task: Omit<Task, 'id' | 'teamId'>) => void;
  onDelete?: (taskId: string) => void;
  initialStatus?: TaskStatus;
  taskToEdit?: Task | null;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, users, currentUser, events, columns = [], onSave, onDelete, initialStatus = 'todo', taskToEdit }) => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventName: '',
    duration: '',
    assigneeId: '',
    assetLink: '',
    projectLink: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: initialStatus,
  });

  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setIsDeleteConfirm(false);
        if (taskToEdit) {
            setFormData({
                title: taskToEdit.title,
                description: taskToEdit.description,
                eventName: taskToEdit.eventName || '',
                duration: taskToEdit.duration || '',
                assigneeId: taskToEdit.assigneeId,
                assetLink: taskToEdit.assetLink || '',
                projectLink: taskToEdit.projectLink || '',
                dueDate: taskToEdit.dueDate,
                priority: taskToEdit.priority,
                status: taskToEdit.status,
            });
            setSubtasks(taskToEdit.subtasks || []);
        } else {
            setFormData({
                title: '',
                description: '',
                eventName: '',
                duration: '',
                assigneeId: users[0]?.id || '',
                assetLink: '',
                projectLink: '',
                dueDate: new Date().toISOString().split('T')[0],
                priority: 'medium',
                status: initialStatus,
            });
            setSubtasks([]);
        }
    }
  }, [isOpen, taskToEdit, users, initialStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
        ...formData, 
        subtasks 
    });
  };

  const handleAddSubtask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newSubtask: Subtask = {
        id: `st-${Date.now()}`,
        title: e.currentTarget.value.trim(),
        isCompleted: false
      };
      setSubtasks([...subtasks, newSubtask]);
      e.currentTarget.value = '';
    }
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(st => 
      st.id === id ? { ...st, isCompleted: !st.isCompleted } : st
    ));
  };

  const deleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  const isUrl = (str: string) => {
      if (!str) return false;
      return str.includes('.') && (str.startsWith('http') || str.length > 5);
  };

  const formatUrl = (str: string) => str.startsWith('http') ? str : `https://${str}`;

  const getStatusLabel = (colId: string, colTitle: string) => {
      if (colId === 'todo') return t.kanban.todo;
      if (colId === 'in-progress') return t.kanban.inProgress;
      if (colId === 'done') return t.kanban.done;
      return colTitle;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={taskToEdit ? t.modal.editTask : t.modal.createTask}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">{t.modal.taskName}</label>
          <input required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" placeholder="e.g. Design Banner" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">{t.modal.desc}</label>
          <textarea rows={2} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" placeholder="..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t.modal.assignedTo}</label>
                <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" value={formData.assigneeId} onChange={e => setFormData({...formData, assigneeId: e.target.value})}>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t.modal.dueDate}</label>
                <input type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                <div className="relative">
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 uppercase" 
                        value={formData.status} 
                        onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                        {columns.map(col => (
                            <option key={col.id} value={col.id}>{getStatusLabel(col.id, col.title)}</option>
                        ))}
                    </select>
                </div>
            </div>
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Priority</label>
                <div className="relative">
                    <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 capitalize" 
                        value={formData.priority} 
                        onChange={e => setFormData({...formData, priority: e.target.value as any})}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Subtasks Section */}
        <div className="pt-2 border-t border-slate-100">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Checklist</h4>
            
            <div className="space-y-2 mb-3">
                {subtasks.map(st => (
                    <div key={st.id} className="flex items-center gap-2 group">
                        <button type="button" onClick={() => toggleSubtask(st.id)} className={`text-slate-400 hover:text-primary-600 ${st.isCompleted ? 'text-primary-600' : ''}`}>
                             {st.isCompleted ? <CheckSquare size={16} /> : <Square size={16} />}
                        </button>
                        <span className={`text-sm flex-1 ${st.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>{st.title}</span>
                        <button type="button" onClick={() => deleteSubtask(st.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="relative">
                <Plus className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-primary-500" 
                    placeholder="Add item (Press Enter)" 
                    onKeyDown={handleAddSubtask}
                />
            </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.modal.links}</h4>
            <div className="relative">
                <FileText className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input type="text" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-primary-500" placeholder={t.modal.assetLink} value={formData.assetLink} onChange={e => setFormData({...formData, assetLink: e.target.value})} />
                {isUrl(formData.assetLink) && (
                    <a href={formatUrl(formData.assetLink)} target="_blank" rel="noreferrer" className="absolute right-3 top-2.5 text-[10px] font-bold text-primary-600 hover:underline flex items-center gap-1 bg-primary-50 px-2 py-0.5 rounded transition-all">
                        {t.modal.open} ↗
                    </a>
                )}
            </div>
            <div className="relative">
                <LinkIcon className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input type="text" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-primary-500" placeholder={t.modal.projectLink} value={formData.projectLink} onChange={e => setFormData({...formData, projectLink: e.target.value})} />
                {isUrl(formData.projectLink) && (
                    <a href={formatUrl(formData.projectLink)} target="_blank" rel="noreferrer" className="absolute right-3 top-2.5 text-[10px] font-bold text-primary-600 hover:underline flex items-center gap-1 bg-primary-50 px-2 py-0.5 rounded transition-all">
                         {t.modal.open} ↗
                    </a>
                )}
            </div>
        </div>

        <div className="pt-6 flex justify-between items-center border-t border-slate-100">
            {taskToEdit && onDelete ? (
                isDeleteConfirm ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                        <button type="button" onClick={(e) => { e.preventDefault(); onDelete(taskToEdit.id); }} 
                            className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold shadow-md transition-all">
                            <Trash2 size={16} /> Confirm
                        </button>
                         <button type="button" onClick={(e) => { e.preventDefault(); setIsDeleteConfirm(false); }}
                            className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                ) : (
                    <button type="button" onClick={(e) => { e.preventDefault(); setIsDeleteConfirm(true); }} 
                        className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold border border-red-100 transition-all">
                        <Trash2 size={16} /> {t.common.delete}
                    </button>
                )
            ) : <div></div>}
            
            <div className="flex gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 text-sm font-bold hover:bg-slate-50 rounded-lg transition-all">{t.common.cancel}</button>
                <button type="submit" className="px-6 py-2 bg-primary-600 text-white text-sm font-bold rounded-lg shadow-lg hover:bg-primary-700 transition-all">
                    {taskToEdit ? t.common.save : t.common.addTask}
                </button>
            </div>
        </div>
      </form>
    </Modal>
  );
};