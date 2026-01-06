import React from 'react';
import { Event, User, EventTypeConfig } from '../types';
import { Calendar, Clock, MapPin, Users, Video, Plus, Trash2 } from 'lucide-react';

interface EventListViewProps {
  events: Event[];
  users: User[];
  onAddEvent: () => void;
  onEventClick?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
  eventTypes: EventTypeConfig[];
}

const THEME_COLORS: Record<string, string> = {
  slate: 'bg-slate-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  yellow: 'bg-yellow-500',
  lime: 'bg-lime-500',
  green: 'bg-green-500',
  emerald: 'bg-emerald-500',
  teal: 'bg-teal-500',
  cyan: 'bg-cyan-500',
  sky: 'bg-sky-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  purple: 'bg-purple-500',
  fuchsia: 'bg-fuchsia-500',
  pink: 'bg-pink-500',
  rose: 'bg-rose-500',
};

export const EventListView: React.FC<EventListViewProps> = ({ events, users, onAddEvent, onEventClick, onDeleteEvent, eventTypes }) => {
  const getUser = (id: string) => users.find(u => u.id === id);
  const getEventTypeColor = (typeId: string) => {
    const config = eventTypes.find(t => t.id === typeId);
    return config ? THEME_COLORS[config.theme] || 'bg-slate-500' : 'bg-slate-500';
  };

  const sortedEvents = [...events].sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime());

  const formatDateRange = (startStr: string, endStr: string) => {
      const start = new Date(startStr);
      const end = new Date(endStr || startStr);
      
      const startDay = start.getDate();
      const startMonth = start.toLocaleString('id-ID', { month: 'short' });
      
      if (startStr === endStr || !endStr) {
          return `${startDay} ${startMonth}`;
      }
      
      const endDay = end.getDate();
      const endMonth = end.toLocaleString('id-ID', { month: 'short' });
      
      if (startMonth === endMonth) {
          return `${startDay} - ${endDay} ${startMonth}`;
      }
      
      return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Event Mendatang</h2>
            <p className="text-slate-500">Pertemuan, workshop, dan agenda tim lainnya.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedEvents.map(event => {
            const todayStr = new Date().toISOString().split('T')[0];
            const isHappening = todayStr >= event.date && todayStr <= (event.endDate || event.date);
            
            return (
                <div 
                    key={event.id} 
                    onClick={() => onEventClick && onEventClick(event)}
                    className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group cursor-pointer relative"
                >
                    <div className={`h-2 w-full ${getEventTypeColor(event.type)}`}></div>

                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-bold border border-slate-200 text-sm">
                                {formatDateRange(event.date, event.endDate)}
                            </div>
                            {isHappening && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">SEDANG BERLANGSUNG</span>}
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors pr-8">{event.title}</h3>
                        <p className="text-slate-500 text-sm mb-6 line-clamp-2">{event.description}</p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Clock size={16} className="text-slate-400" />
                                <span>{event.startTime} - {event.endTime}</span>
                            </div>
                             <div className="flex items-center gap-3 text-sm text-slate-600">
                                <MapPin size={16} className="text-slate-400" />
                                <span className="truncate">{event.location || 'Remote'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type)}`}></div>
                                <span className="capitalize">{eventTypes.find(t => t.id === event.type)?.label || event.type}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                             <div className="flex -space-x-2">
                                {event.attendees.slice(0, 4).map(userId => {
                                    const user = getUser(userId);
                                    if (!user) return null;
                                    return (
                                        <img 
                                            key={userId}
                                            src={user.avatar} 
                                            alt={user.name} 
                                            className="w-8 h-8 rounded-full border-2 border-white"
                                        />
                                    );
                                })}
                                {event.attendees.length > 4 && (
                                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                                        +{event.attendees.length - 4}
                                    </div>
                                )}
                             </div>
                             <Users size={18} className="text-slate-300" />
                        </div>
                    </div>
                </div>
            );
        })}
        
        <button 
            onClick={onAddEvent}
            className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-primary-400 hover:text-primary-500 transition-all min-h-[300px]"
        >
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-50">
                <Plus size={24} />
            </div>
            <span className="font-bold">Jadwalkan Event</span>
        </button>
      </div>
    </div>
  );
};