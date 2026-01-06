import React, { useState } from 'react';
import { Modal } from './Modal';
import { Link, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (code: string) => { success: boolean; message: string; teamName?: string };
}

export const JoinTeamModal: React.FC<JoinTeamModalProps> = ({ isOpen, onClose, onJoin }) => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract ID if full URL is pasted
    let code = input;
    if (input.includes('/join/')) {
        code = input.split('/join/')[1];
    }
    
    const result = onJoin(code);
    
    if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setTimeout(() => {
            onClose();
            setInput('');
            setStatus('idle');
            setMessage('');
        }, 2000);
    } else {
        setStatus('error');
        setMessage(result.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join a Team">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">
                Paste the invite link or code shared by your team administrator.
            </p>
            <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all font-medium
                        ${status === 'error' ? 'border-red-300 focus:ring-red-200 text-red-600' : 'border-slate-200 focus:ring-primary-500 text-slate-800'}
                    `}
                    placeholder="https://kerja.app/join/lnk_..."
                    value={input}
                    onChange={e => {
                        setInput(e.target.value);
                        if (status === 'error') setStatus('idle');
                    }}
                    disabled={status === 'success'}
                />
            </div>
            {status === 'error' && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-bold animate-in slide-in-from-top-1">
                    <AlertCircle size={12} /> {message}
                </div>
            )}
            {status === 'success' && (
                <div className="flex items-center gap-2 mt-2 text-emerald-600 text-xs font-bold animate-in slide-in-from-top-1">
                    <CheckCircle2 size={12} /> {message}
                </div>
            )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
            <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                disabled={!input || status === 'success'}
                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-black transition-all shadow-lg shadow-slate-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {status === 'success' ? 'Joined!' : 'Join Team'}
                {status !== 'success' && <ArrowRight size={16} />}
            </button>
        </div>
      </form>
    </Modal>
  );
};