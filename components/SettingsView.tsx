import React, { useState, useEffect } from 'react';
import { KanbanColumn, EventTypeConfig, ColorTheme, User, ThemeId } from '../types';
import { Trash2, Plus, Save, RotateCcw, CheckCircle2, Shield, User as UserIcon, Lock, Key, Eye, EyeOff, Palette, Monitor } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

interface SettingsViewProps {
  columns: KanbanColumn[];
  setColumns: (cols: KanbanColumn[]) => void;
  eventTypes: EventTypeConfig[];
  setEventTypes: (types: EventTypeConfig[]) => void;
  users?: User[];
  setUsers?: (users: User[]) => void;
  currentUser?: User;
}

// Expanded Color Palette
const COLORS: { value: ColorTheme; label: string; class: string }[] = [
  { value: 'slate', label: 'Slate', class: 'bg-slate-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'amber', label: 'Amber', class: 'bg-amber-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'lime', label: 'Lime', class: 'bg-lime-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'emerald', label: 'Emerald', class: 'bg-emerald-500' },
  { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
  { value: 'cyan', label: 'Cyan', class: 'bg-cyan-500' },
  { value: 'sky', label: 'Sky', class: 'bg-sky-500' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { value: 'violet', label: 'Violet', class: 'bg-violet-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'fuchsia', label: 'Fuchsia', class: 'bg-fuchsia-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'rose', label: 'Rose', class: 'bg-rose-500' },
];

const GLOBAL_THEMES: { id: ThemeId; name: string; type: 'light' | 'dark'; color: string }[] = [
    { id: 'emerald-light', name: 'Emerald Light', type: 'light', color: 'bg-emerald-500' },
    { id: 'ocean-light', name: 'Ocean Light', type: 'light', color: 'bg-blue-500' },
    { id: 'sunset-light', name: 'Sunset Light', type: 'light', color: 'bg-orange-500' },
    { id: 'berry-light', name: 'Berry Light', type: 'light', color: 'bg-purple-500' },
    { id: 'midnight-dark', name: 'Midnight Dark', type: 'dark', color: 'bg-indigo-900' },
    { id: 'forest-dark', name: 'Forest Dark', type: 'dark', color: 'bg-emerald-900' },
    { id: 'cyber-dark', name: 'Cyber Dark', type: 'dark', color: 'bg-slate-900' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ columns, setColumns, eventTypes, setEventTypes, users = [], setUsers, currentUser }) => {
  const { t } = useLanguage();
  const { currentTheme, setTheme } = useTheme();
  
  // Local state for batch editing
  const [localColumns, setLocalColumns] = useState<KanbanColumn[]>(columns);
  const [localEventTypes, setLocalEventTypes] = useState<EventTypeConfig[]>(eventTypes);
  const [localUsers, setLocalUsers] = useState<User[]>(users);
  
  // Track password visibility per user ID
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  
  const [isDirty, setIsDirty] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync state when props change (unless dirty)
  useEffect(() => {
    if (!isDirty) {
      setLocalColumns(columns);
      setLocalEventTypes(eventTypes);
      setLocalUsers(users);
    }
  }, [columns, eventTypes, users, isDirty]);

  // --- ACTIONS ---

  const handleSaveChanges = () => {
    setColumns(localColumns);
    setEventTypes(localEventTypes);
    if (setUsers) setUsers(localUsers);
    
    setIsDirty(false);
    
    // Show success feedback
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDiscardChanges = () => {
    if (confirm('Discard all unsaved changes?')) {
        setLocalColumns(columns);
        setLocalEventTypes(eventTypes);
        setLocalUsers(users);
        setIsDirty(false);
    }
  };

  // --- KANBAN COLUMN HANDLERS ---
  const handleAddColumn = () => {
    const newId = `col-${Date.now()}`;
    setLocalColumns([...localColumns, { id: newId, title: 'New Column', theme: 'slate' }]);
    setIsDirty(true);
  };

  const handleUpdateColumn = (id: string, field: keyof KanbanColumn, value: string) => {
    setLocalColumns(localColumns.map(c => c.id === id ? { ...c, [field]: value } : c));
    setIsDirty(true);
  };

  const handleDeleteColumn = (id: string) => {
    setLocalColumns(localColumns.filter(c => c.id !== id));
    setIsDirty(true);
  };

  // --- EVENT TYPE HANDLERS ---
  const handleAddEventType = () => {
    const newId = `type-${Date.now()}`;
    setLocalEventTypes([...localEventTypes, { id: newId, label: 'New Type', theme: 'blue' }]);
    setIsDirty(true);
  };

  const handleUpdateEventType = (id: string, field: keyof EventTypeConfig, value: string) => {
    setLocalEventTypes(localEventTypes.map(e => e.id === id ? { ...e, [field]: value } : e));
    setIsDirty(true);
  };

  const handleDeleteEventType = (id: string) => {
    setLocalEventTypes(localEventTypes.filter(e => e.id !== id));
    setIsDirty(true);
  };

  // --- USER HANDLERS ---
  const handleAddUser = () => {
      const newId = `u-${Date.now()}`;
      setLocalUsers([...localUsers, {
          id: newId,
          name: 'New User',
          username: `user${Math.floor(Math.random() * 1000)}`,
          password: '123',
          email: 'user@kerja.app',
          role: 'Member',
          avatar: `https://ui-avatars.com/api/?name=New+User&background=random&color=fff&size=128`
      }]);
      setIsDirty(true);
  };

  const handleUpdateUser = (id: string, field: keyof User, value: string) => {
      setLocalUsers(localUsers.map(u => u.id === id ? { ...u, [field]: value } : u));
      setIsDirty(true);
  };

  const handleDeleteUser = (id: string) => {
      if (currentUser && id === currentUser.id) {
          alert("Cannot delete the current user (yourself).");
          return;
      }
      setLocalUsers(localUsers.filter(u => u.id !== id));
      setIsDirty(true);
  };

  const togglePasswordVisibility = (userId: string) => {
      setVisiblePasswords(prev => ({
          ...prev,
          [userId]: !prev[userId]
      }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-16 z-30 bg-slate-50/95 backdrop-blur-sm py-4 border-b border-slate-200/50 -mx-4 px-4 md:-mx-8 md:px-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.common.masterData}</h2>
          <p className="text-slate-500">{t.common.masterDataDesc}</p>
        </div>
        
        <div className="flex items-center gap-3">
            {showSuccess && (
                <span className="text-emerald-600 font-bold text-sm flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 size={16} /> Saved!
                </span>
            )}
            
            {isDirty && (
                <button 
                    onClick={handleDiscardChanges}
                    className="px-4 py-2 text-slate-600 hover:text-red-600 font-medium transition-colors flex items-center gap-2"
                >
                    <RotateCcw size={16} /> Discard
                </button>
            )}
            
            <button 
                onClick={handleSaveChanges}
                disabled={!isDirty}
                className={`px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg
                    ${isDirty 
                        ? 'bg-slate-900 hover:bg-black text-white shadow-slate-300 cursor-pointer transform hover:-translate-y-0.5' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
            >
                <Save size={18} /> {t.common.save}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- GLOBAL APP THEME --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Palette size={20} className="text-slate-400" /> App Appearance
                 </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                {GLOBAL_THEMES.map(theme => (
                    <button
                        key={theme.id}
                        onClick={() => setTheme(theme.id)}
                        className={`group relative p-3 rounded-xl border transition-all text-left flex flex-col gap-2 overflow-hidden
                            ${currentTheme === theme.id 
                                ? 'border-primary-500 ring-2 ring-primary-500 ring-offset-2' 
                                : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}
                        `}
                    >
                        <div className={`h-12 w-full rounded-lg ${theme.color} shadow-inner`}></div>
                        <div className="flex justify-between items-center">
                             <span className="text-xs font-bold text-slate-700">{theme.name}</span>
                             {currentTheme === theme.id && <CheckCircle2 size={14} className="text-primary-600" />}
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* --- USER MANAGEMENT --- */}
        {currentUser?.role === 'Owner' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-800">User Management</h3>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">{localUsers.length} Users</span>
                </div>
                <button 
                    onClick={handleAddUser}
                    className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} /> Add User
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {localUsers.map(user => (
                    <div key={user.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-300 relative group">
                        {/* User Inputs (Same as before) */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 w-full">
                                <img src={user.avatar} alt="" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex-shrink-0" />
                                <div className="w-full pr-8">
                                    <div className="mb-1">
                                         <label className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Name</label>
                                         <input 
                                            type="text" 
                                            value={user.name} 
                                            onChange={(e) => handleUpdateUser(user.id, 'name', e.target.value)}
                                            className="bg-white/60 font-bold text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 rounded px-1 -ml-1 w-full border border-slate-100 focus:border-slate-200 transition-colors"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">User</label>
                                            <div className="relative">
                                                <UserIcon size={10} className="absolute left-1 top-1.5 text-slate-400" />
                                                <input 
                                                    type="text" 
                                                    value={user.username} 
                                                    onChange={(e) => handleUpdateUser(user.id, 'username', e.target.value)}
                                                    className="bg-white/60 pl-4 py-0.5 text-xs font-mono text-slate-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 rounded w-full border border-slate-100 focus:border-slate-200 transition-colors"
                                                    placeholder="username"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Pass</label>
                                             <div className="relative">
                                                <Key size={10} className="absolute left-1 top-1.5 text-slate-400" />
                                                <input 
                                                    type={visiblePasswords[user.id] ? "text" : "password"} 
                                                    value={user.password || ''} 
                                                    onChange={(e) => handleUpdateUser(user.id, 'password', e.target.value)}
                                                    className="bg-white/60 pl-4 pr-6 py-0.5 text-xs font-mono text-slate-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 rounded w-full border border-slate-100 focus:border-slate-200 transition-colors"
                                                    placeholder="password"
                                                />
                                                <button 
                                                    onClick={() => togglePasswordVisibility(user.id)}
                                                    className="absolute right-1 top-1.5 text-slate-400 hover:text-slate-600"
                                                >
                                                    {visiblePasswords[user.id] ? <EyeOff size={10} /> : <Eye size={10} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        
                        <div className="pt-3 border-t border-slate-200/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Shield size={14} className="text-slate-400" />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</span>
                            </div>
                            <select 
                                value={user.role}
                                onChange={(e) => handleUpdateUser(user.id, 'role', e.target.value)}
                                className={`text-xs font-bold px-2 py-1 rounded-md border focus:outline-none cursor-pointer
                                    ${user.role === 'Owner' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                                      user.role === 'Member' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                                      'bg-slate-100 text-slate-600 border-slate-200'}`}
                            >
                                <option value="Owner">Owner</option>
                                <option value="Member">Member</option>
                                <option value="Guest">Guest</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        )}

        {/* --- KANBAN COLUMNS --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Monitor size={20} className="text-slate-400"/> Kanban Columns</h3>
            <button 
              onClick={handleAddColumn}
              className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Add Step
            </button>
          </div>

          <div className="space-y-3">
            {localColumns.map((col, index) => (
              <div key={col.id} className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100 animate-in slide-in-from-left-2 duration-300">
                <div className="flex-none w-6 text-center font-bold text-slate-300 text-sm">{index + 1}</div>
                
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
                  <input 
                    type="text" 
                    value={col.title}
                    onChange={(e) => handleUpdateColumn(col.id, 'title', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm font-medium focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="w-32 space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 uppercase">Color Theme</label>
                   <select
                      value={col.theme}
                      onChange={(e) => handleUpdateColumn(col.id, 'theme', e.target.value as ColorTheme)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary-500"
                   >
                      {COLORS.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                   </select>
                </div>

                <div className="flex-none self-end pb-1">
                   <div className={`w-6 h-6 rounded-full shadow-sm ring-1 ring-black/5 ${COLORS.find(c => c.value === col.theme)?.class || 'bg-slate-500'}`}></div>
                </div>

                <div className="flex-none self-end">
                   <button 
                    onClick={() => handleDeleteColumn(col.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Column"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- EVENT TYPES --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Palette size={20} className="text-slate-400"/> Event Types</h3>
            <button 
              onClick={handleAddEventType}
              className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Add Type
            </button>
          </div>

          <div className="space-y-3">
            {localEventTypes.map((type) => (
              <div key={type.id} className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100 animate-in slide-in-from-right-2 duration-300">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Label</label>
                  <input 
                    type="text" 
                    value={type.label}
                    onChange={(e) => handleUpdateEventType(type.id, 'label', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm font-medium focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="w-32 space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 uppercase">Color Theme</label>
                   <select
                      value={type.theme}
                      onChange={(e) => handleUpdateEventType(type.id, 'theme', e.target.value as ColorTheme)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary-500"
                   >
                      {COLORS.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                   </select>
                </div>

                <div className="flex-none self-end pb-1">
                   <div className={`w-6 h-6 rounded-full shadow-sm ring-1 ring-black/5 ${COLORS.find(c => c.value === type.theme)?.class || 'bg-slate-500'}`}></div>
                </div>

                <div className="flex-none self-end">
                   <button 
                    onClick={() => handleDeleteEventType(type.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Type"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};