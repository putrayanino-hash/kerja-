import React, { useState } from 'react';
import { Modal } from './Modal';
import { Shield, Link as LinkIcon, Copy, Check, RefreshCw, Info } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateLink: (role: 'Member' | 'Guest') => string; // Returns the generated link ID/Token
  teamName: string;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose, onGenerateLink, teamName }) => {
  const [role, setRole] = useState<'Member' | 'Guest'>('Member');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = () => {
    const link = onGenerateLink(role);
    setGeneratedLink(link);
    setIsCopied(false);
  };

  const handleCopy = () => {
    if (generatedLink) {
        navigator.clipboard.writeText(generatedLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const reset = () => {
      setGeneratedLink(null);
      setRole('Member');
  }

  // Reset state when modal closes
  React.useEffect(() => {
      if(!isOpen) reset();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Invite to ${teamName}`}>
      <div className="space-y-6">
        
        {/* Step 1: Configuration (Hidden if link is generated to focus on the link) */}
        {!generatedLink && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800">
                        Generate a secure link to share with your team. Anyone with this link can join <strong>{teamName}</strong>.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Permission Role</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setRole('Member')}
                            className={`p-3 rounded-xl border text-left transition-all ${role === 'Member' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Shield size={16} className={role === 'Member' ? 'text-primary-600' : 'text-slate-400'} />
                                <span className={`text-sm font-bold ${role === 'Member' ? 'text-primary-700' : 'text-slate-700'}`}>Member</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">Can create tasks, edit status, and comment.</p>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('Guest')}
                            className={`p-3 rounded-xl border text-left transition-all ${role === 'Guest' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Shield size={16} className={role === 'Guest' ? 'text-primary-600' : 'text-slate-400'} />
                                <span className={`text-sm font-bold ${role === 'Guest' ? 'text-primary-700' : 'text-slate-700'}`}>Guest</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">Can only view tasks and add comments.</p>
                        </button>
                    </div>
                </div>

                <button 
                    onClick={handleGenerate}
                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-black transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                >
                    <LinkIcon size={18} /> Generate Invite Link
                </button>
            </div>
        )}

        {/* Step 2: Result (Shown after generation) */}
        {generatedLink && (
            <div className="space-y-6 animate-in fade-in zoom-in-95">
                <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <LinkIcon size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-800">Link Generated!</h4>
                    <p className="text-slate-500 text-sm">Share this link with people you want to invite as <strong>{role}</strong>.</p>
                </div>

                <div className="bg-slate-100 p-1.5 rounded-xl flex items-center gap-2 border border-slate-200">
                    <input 
                        type="text" 
                        readOnly 
                        value={generatedLink} 
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-600 font-medium px-2"
                    />
                    <button 
                        onClick={handleCopy}
                        className={`p-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${isCopied ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-50 shadow-sm border border-slate-200'}`}
                    >
                        {isCopied ? <Check size={16} /> : <Copy size={16} />}
                        {isCopied ? 'Copied' : 'Copy'}
                    </button>
                </div>
                
                {/* Demo Hint */}
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex gap-3 text-amber-800 text-xs">
                    <Info size={16} className="flex-shrink-0 mt-0.5" />
                    <p>
                        <strong>Magic Link:</strong> Since you are not using a database, this link contains the Team ID. Opening this URL in your browser will automatically add the user to the team.
                    </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <button onClick={reset} className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-2">
                        <RefreshCw size={14} /> Generate Another
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors">
                        Done
                    </button>
                </div>
            </div>
        )}
      </div>
    </Modal>
  );
};