import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { User, EventType, Event, EventTypeConfig } from '../types';
import { MapPin, Briefcase, Trash2, ExternalLink, Clock, Calendar, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onSave: (event: Omit<Event, 'id' | 'teamId'>) => void;
  onDelete?: (eventId: string) => void;
  eventToEdit?: Event | null;
  eventTypes: EventTypeConfig[];
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, users, onSave, onDelete, eventToEdit, eventTypes }) => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: eventTypes[0]?.id || '',
    clientName: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    attendees: [] as string[],
  });
  
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDeleteConfirm(false);
      if (eventToEdit) {
        setFormData({
          title: eventToEdit.title,
          description: eventToEdit.description,
          type: eventToEdit.type,
          clientName: eventToEdit.clientName || '',
          location: eventToEdit.location || '',
          date: eventToEdit.date,
          endDate: eventToEdit.endDate || eventToEdit.date,
          startTime: eventToEdit.startTime,
          endTime: eventToEdit.endTime,
          attendees: eventToEdit.attendees,
        });
      } else {
        const today = new Date().toISOString().split('T')[0];
        setFormData({
            title: '',
            description: '',
            type: eventTypes[0]?.id || '',
            clientName: '',
            location: '',
            date: today,
            endDate: today,
            startTime: '09:00',
            endTime: '10:00',
            attendees: [users[0]?.id || '']
        });
      }
    }
  }, [isOpen, eventToEdit, users, eventTypes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isUrl = (str: string) => {
    if (!str) return false;
    return str.includes('.') && (str.startsWith('http') || str.length > 5);
  };

  const formatUrl = (str: string) => str.startsWith('http') ? str : `https://${str}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={eventToEdit ? t.modal.editEvent : t.modal.createEvent}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">{t.modal.eventName}</label>
          <input required type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" placeholder="e.g. Workshop" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t.modal.eventType}</label>
                <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    {eventTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t.modal.clientName}</label>
                <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="PT..." value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div>
                <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">{t.modal.startDate}</label>
                <input required type="date" className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" value={formData.date} onChange={e => {
                    const newStartDate = e.target.value;
                    const newEndDate = new Date(formData.endDate) < new Date(newStartDate) ? newStartDate : formData.endDate;
                    setFormData({...formData, date: newStartDate, endDate: newEndDate});
                }} />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">{t.modal.endDate}</label>
                <input required type="date" min={formData.date} className="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t.modal.startTime}</label>
                <input type="time" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t.modal.endTime}</label>
                <input type="time" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
            </div>
        </div>

        <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">{t.modal.location}</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input type="text" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-primary-500" placeholder="..." value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                {isUrl(formData.location) && (
                    <a href={formatUrl(formData.location)} target="_blank" rel="noreferrer" className="absolute right-3 top-2.5 text-[10px] font-bold text-primary-600 hover:underline flex items-center gap-1 bg-primary-50 px-2 py-0.5 rounded transition-all">
                        {t.modal.open} ↗
                    </a>
                )}
            </div>
        </div>

        <div className="pt-6 flex justify-between items-center border-t border-slate-100">
            {eventToEdit && onDelete ? (
                 isDeleteConfirm ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                        <button type="button" onClick={(e) => { e.preventDefault(); onDelete(eventToEdit.id); }} 
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
                    {eventToEdit ? t.common.save : t.common.addEvent}
                </button>
            </div>
        </div>
      </form>
    </Modal>
  );
};