import React, { useState } from 'react';
import { Modal } from './Modal';
import { Team, User } from '../types';
import { Users, Type, Palette } from 'lucide-react';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSave: (team: Omit<Team, 'id'>) => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, currentUser, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      members: [currentUser.id], // Creator is automatically a member
      ownerId: currentUser.id,
      theme: 'emerald' // Default
    });
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Team">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Team Name</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              required
              type="text" 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Marketing Squad"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
          <div className="relative">
            <Type className="absolute left-3 top-3 text-slate-400" size={16} />
            <textarea 
              rows={3}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="What is this team working on?"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 mt-4">
            <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-black transition-all shadow-lg shadow-slate-200"
            >
                Create Team
            </button>
        </div>
      </form>
    </Modal>
  );
};