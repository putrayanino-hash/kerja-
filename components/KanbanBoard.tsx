import React from 'react';
import { Task, User, TaskStatus, KanbanColumn } from '../types';
import { MoreHorizontal, Calendar, Plus, CheckSquare, Flag, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageContext';

interface KanbanBoardProps {
  tasks: Task[];
  users: User[];
  columns: KanbanColumn[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

const THEME_STYLES: Record<string, { bg: string; text: string }> = {
  slate: { bg: 'bg-slate-100', text: 'text-slate-600' },
  red: { bg: 'bg-red-50', text: 'text-red-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
  lime: { bg: 'bg-lime-50', text: 'text-lime-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  fuchsia: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
  // Default fallback
  default: { bg: 'bg-slate-100', text: 'text-slate-600' }
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, users, columns, onStatusChange, onAddTask, onTaskClick, onDeleteTask }) => {
  const { t } = useLanguage();
  
  const getTasksByStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  const getUser = (id: string) => users.find((u) => u.id === id);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onStatusChange(taskId, status);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getPriorityColor = (priority: string) => {
      switch(priority) {
          case 'high': return 'bg-red-500';
          case 'medium': return 'bg-orange-500';
          case 'low': return 'bg-blue-500';
          default: return 'bg-slate-300';
      }
  };

  const getDueDateStatus = (dateStr: string, isDone: boolean) => {
      if (isDone) return { color: 'text-slate-400', icon: Calendar };
      
      const due = new Date(dateStr);
      const today = new Date();
      today.setHours(0,0,0,0);
      due.setHours(0,0,0,0); // Normalize time

      if (due < today) return { color: 'text-red-500 font-bold', icon: AlertCircle, label: t.common.overdue };
      if (due.getTime() === today.getTime()) return { color: 'text-orange-500 font-bold', icon: Clock, label: t.common.today };
      
      return { color: 'text-slate-400', icon: Calendar };
  };

  // Translate default column titles if they match default IDs
  const getColumnTitle = (col: KanbanColumn) => {
      if (col.id === 'todo') return t.kanban.todo;
      if (col.id === 'in-progress') return t.kanban.inProgress;
      if (col.id === 'done') return t.kanban.done;
      return col.title;
  };
  
  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4 snap-x">
      {columns.map((col) => {
        const theme = THEME_STYLES[col.theme] || THEME_STYLES.default;
        const columnTasks = getTasksByStatus(col.id);
        
        return (
          <div
            key={col.id}
            className="flex flex-col h-full min-w-[300px] flex-1 snap-center"
            onDrop={(e) => handleDrop(e, col.id)}
            onDragOver={handleDragOver}
          >
            {/* Column Header */}
            <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm z-10 relative">
              <h3 className={`font-bold uppercase text-sm ${theme.text}`}>
                {getColumnTitle(col)}
              </h3>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                {columnTasks.length}
              </span>
            </div>

            {/* Tasks Container */}
            <div className={`flex-1 space-y-3 rounded-xl p-2 border relative transition-colors ${theme.bg.replace('50', '50/50')} border-slate-100/50`}>
              {/* Add Task Button for this column */}
              <button 
                  onClick={() => onAddTask(col.id)}
                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary-400 hover:text-primary-500 transition-colors flex items-center justify-center gap-2 text-sm font-medium mb-3 bg-white/50"
              >
                  <Plus size={16} /> {t.common.addTask}
              </button>

              <AnimatePresence mode='popLayout'>
                {columnTasks.map((task) => {
                  const assignee = getUser(task.assigneeId);
                  const subtasks = task.subtasks || [];
                  const completedSubtasks = subtasks.filter(s => s.isCompleted).length;
                  const progress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;
                  const dueStatus = getDueDateStatus(task.dueDate, task.status === 'done');
                  const DueIcon = dueStatus.icon;

                  return (
                    <motion.div
                      key={task.id}
                      layout
                      layoutId={task.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task.id)}
                      onClick={() => onTaskClick(task)}
                      className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md group relative overflow-hidden"
                    >
                      {/* Priority Strip */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityColor(task.priority)}`}></div>

                      <div className="flex justify-between items-start mb-2 pl-2">
                        <div className="flex gap-2">
                             {task.priority === 'high' && <Flag size={12} className="text-red-500 mt-1" fill="currentColor" />}
                             <h4 className="font-semibold text-slate-800 line-clamp-2 text-sm">{task.title}</h4>
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs mb-3 line-clamp-2 pl-2">{task.description}</p>
                      
                      {/* Subtask Progress */}
                      {subtasks.length > 0 && (
                          <div className="mb-3 pl-2">
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                                  <CheckSquare size={10} />
                                  <span>{completedSubtasks}/{subtasks.length}</span>
                              </div>
                              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-primary-500'}`} 
                                    style={{ width: `${progress}%` }}
                                  ></div>
                              </div>
                          </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-slate-50 pl-2">
                        <div className="flex items-center gap-2">
                          {assignee && (
                            <div className="flex items-center gap-1.5 pr-2">
                              <img
                                src={assignee.avatar}
                                alt={assignee.name}
                                className="w-5 h-5 rounded-full"
                              />
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center text-xs ${dueStatus.color}`}>
                          <DueIcon size={12} className="mr-1" />
                          {dueStatus.label ? dueStatus.label : new Date(task.dueDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {columnTasks.length === 0 && (
                  <div className="h-32 flex flex-col items-center justify-center text-slate-400/50 text-sm">
                      <p>{t.kanban.dropHere}</p>
                  </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

function Clock(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}