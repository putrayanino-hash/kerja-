import React, { useState, useRef, useEffect } from 'react';
import { User, Task, InviteLink } from '../types';
import { Mail, Shield, MoreVertical, Trash2, Edit2, Link as LinkIcon, Check, Copy, Send } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TeamViewProps {
  users: User[];
  inviteLinks: InviteLink[]; // Changed from invitations to inviteLinks
  tasks: Task[];
  onInviteUser: () => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
  onRevokeLink?: (linkId: string) => void;
  onSimulateJoin?: (linkId: string) => void; // For demo purposes
}

export const TeamView: React.FC<TeamViewProps> = ({ 
    users, 
    inviteLinks, 
    tasks, 
    onInviteUser, 
    onEditUser, 
    onDeleteUser,
    onRevokeLink,
    onSimulateJoin
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setActiveMenuId(null);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performanceData = users.map(user => {
    const userTasks = tasks.filter(t => t.assigneeId === user.id);
    return {
      name: user.name.split(' ')[0],
      completed: userTasks.filter(t => t.status === 'done').length,
      active: userTasks.filter(t => t.status !== 'done').length,
    };
  });

  const handleDeleteClick = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setTimeout(() => {
        if(confirm(`Are you sure you want to remove ${user.name} from the team?`)) {
            if (onDeleteUser) onDeleteUser(user.id);
        }
    }, 50);
  };

  const handleCopyLink = (linkId: string) => {
      const url = `https://kerja.app/join/${linkId}`;
      navigator.clipboard.writeText(url);
      setCopiedLinkId(linkId);
      setTimeout(() => setCopiedLinkId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Team Overview</h2>
            <p className="text-slate-500">Manage team members and invite links.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Members & Links List */}
        <div className="space-y-8">
             
             {/* Active Invite Links Section */}
             {inviteLinks.length > 0 && (
                 <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <LinkIcon size={16} /> Active Invite Links
                    </h3>
                    <div className="space-y-3">
                        {inviteLinks.map(link => (
                            <div key={link.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">...{link.id.slice(-8)}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${link.role === 'Guest' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'}`}>
                                            {link.role}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        Created {new Date(link.createdAt).toLocaleDateString()} • {link.uses} joined
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleCopyLink(link.id)}
                                        className="text-xs flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-medium transition-colors"
                                    >
                                        {copiedLinkId === link.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        {copiedLinkId === link.id ? 'Copied' : 'Copy'}
                                    </button>
                                    
                                    {/* SIMULATION BUTTON */}
                                    {onSimulateJoin && (
                                        <button 
                                            onClick={() => onSimulateJoin(link.id)}
                                            className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-100 border border-emerald-200"
                                            title="Demo: Simulate user clicking this link"
                                        >
                                            Simulate Join
                                        </button>
                                    )}

                                    <button 
                                        onClick={() => onRevokeLink && onRevokeLink(link.id)}
                                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Revoke Link"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
             )}

             {/* Active Members Section */}
             <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Active Members</h3>
                <div className="space-y-4" ref={menuRef}>
                    {users.map(user => (
                        <div key={user.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between relative group hover:border-primary-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-800">{user.name}</h4>
                                        {user.role === 'Owner' && <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Owner</span>}
                                        {user.role === 'Guest' && <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Guest</span>}
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                                        <Mail size={12} />
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex gap-2">
                                    <span className="bg-emerald-50 text-emerald-600 text-xs px-2 py-1 rounded-md font-medium">
                                        {tasks.filter(t => t.assigneeId === user.id && t.status === 'done').length} Done
                                    </span>
                                </div>
                                <div className="relative">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenuId(activeMenuId === user.id ? null : user.id);
                                        }}
                                        className={`p-2 rounded-lg transition-colors ${activeMenuId === user.id ? 'bg-slate-100 text-slate-800' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                    {activeMenuId === user.id && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 p-1 animate-in fade-in zoom-in-95 duration-200">
                                            <button onClick={(e) => {e.stopPropagation(); onEditUser && onEditUser(user); setActiveMenuId(null);}} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                                                <Edit2 size={14} /> Edit Member
                                            </button>
                                            <button onClick={(e) => handleDeleteClick(e, user)} className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
                                                <Trash2 size={14} /> Remove User
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[300px]">
             <h3 className="text-lg font-bold text-slate-800 mb-6">Task Distribution</h3>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{fill: '#f1f5f9'}}
                        />
                        <Bar dataKey="completed" name="Completed" stackId="a" fill="var(--primary-500)" radius={[0, 0, 4, 4]} barSize={32} />
                        <Bar dataKey="active" name="Active" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>
    </div>
  );
};