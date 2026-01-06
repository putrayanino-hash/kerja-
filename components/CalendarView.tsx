
import React, { useState } from 'react';
import { Task, Event } from '../types';
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, MapPin } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  events: Event[];
  onEventClick?: (event: Event) => void;
  onTaskClick?: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, events, onEventClick, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); 

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const dayNamesShort = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getItemsForDate = (day: number) => {
    const targetDate = new Date(year, month, day);
    targetDate.setHours(0, 0, 0, 0);
    const targetTime = targetDate.getTime();
    
    // Logic for tasks: Match specific due date
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.dueDate === dateStr);
    
    // NEW logic for events: Check if targetDate is between start and end date
    const dayEvents = events.filter(e => {
        const start = new Date(e.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(e.endDate || e.date);
        end.setHours(0, 0, 0, 0);
        
        return targetTime >= start.getTime() && targetTime <= end.getTime();
    });
    
    return { tasks: dayTasks, events: dayEvents };
  };

  const renderCalendarDaysDesktop = () => {
    const days = [];
    const totalSlots = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

    for (let i = 0; i < totalSlots; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
      
      if (!isCurrentMonth) {
        days.push(
          <div key={`empty-${i}`} className="bg-slate-50/50 min-h-[120px] border border-slate-100 p-2 text-slate-300">
          </div>
        );
        continue;
      }

      const { tasks: dayTasks, events: dayEvents } = getItemsForDate(dayNumber);
      const isToday = new Date().toDateString() === new Date(year, month, dayNumber).toDateString();

      days.push(
        <div key={`day-${dayNumber}`} className={`bg-white min-h-[120px] border border-slate-100 p-2 transition-colors hover:bg-slate-50 ${isToday ? 'ring-2 ring-primary-500 ring-inset' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary-600 text-white' : 'text-slate-700'}`}>
              {dayNumber}
            </span>
            {(dayTasks.length > 0 || dayEvents.length > 0) && (
                 <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 rounded-md">{dayTasks.length + dayEvents.length}</span>
            )}
          </div>
          
          <div className="space-y-1 overflow-y-auto max-h-[90px] hide-scrollbar">
            {dayEvents.map(event => {
              const isStart = event.date === `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
              return (
                <div 
                  key={`${event.id}-${dayNumber}`} 
                  onClick={(e) => { e.stopPropagation(); onEventClick && onEventClick(event); }}
                  className={`text-[10px] bg-purple-100 text-purple-700 px-1.5 py-1 rounded border border-purple-200 truncate flex items-center gap-1 cursor-pointer hover:bg-purple-200 transition-colors
                    ${!isStart ? 'opacity-70 border-dashed' : 'font-bold'}
                  `}
                >
                   <Clock size={10} />
                   {event.title}
                </div>
              );
            })}
            {dayTasks.map(task => (
              <div 
                key={task.id} 
                onClick={(e) => { e.stopPropagation(); onTaskClick && onTaskClick(task); }}
                className={`text-[10px] px-1.5 py-1 rounded border truncate flex items-center gap-1 cursor-pointer hover:brightness-95 transition-all
                ${task.status === 'done' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-blue-100 text-blue-700 border-blue-200'}
              `}>
                <CheckCircle2 size={10} />
                {task.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  const renderMobileList = () => {
    const daysWithContent = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const { tasks: dayTasks, events: dayEvents } = getItemsForDate(day);
        
        const dateObj = new Date(year, month, day);
        const dayOfWeek = dayNamesShort[dateObj.getDay()];
        const isToday = new Date().toDateString() === dateObj.toDateString();
        const hasItems = dayTasks.length > 0 || dayEvents.length > 0;

        daysWithContent.push(
            <div key={`mob-day-${day}`} className="flex gap-4 min-h-[4rem]">
                <div className="flex flex-col items-center min-w-[3.5rem] pt-1">
                    <span className={`text-xs font-medium uppercase mb-0.5 ${isToday ? 'text-primary-600' : 'text-slate-500'}`}>
                        {dayOfWeek}
                    </span>
                    <span className={`text-2xl font-bold flex items-center justify-center w-10 h-10 rounded-full ${isToday ? 'bg-primary-600 text-white shadow-md shadow-primary-200' : 'text-slate-800 bg-slate-100'}`}>
                        {day}
                    </span>
                </div>

                <div className={`flex-1 space-y-3 relative ${hasItems ? 'pb-6' : 'pb-6'}`}>
                    <div className="absolute left-[-1.65rem] top-10 bottom-0 w-px bg-slate-200"></div>

                    {dayEvents.map(event => {
                        const isMultiDay = event.date !== (event.endDate || event.date);
                        return (
                            <div 
                                key={`${event.id}-${day}`} 
                                onClick={() => onEventClick && onEventClick(event)}
                                className="bg-purple-600 text-white p-3 rounded-xl shadow-sm border-l-4 border-purple-800 cursor-pointer active:scale-95 transition-transform"
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-sm mb-1">{event.title}</h4>
                                    {isMultiDay && <span className="text-[8px] bg-white/20 px-1.5 py-0.5 rounded uppercase font-bold">Multi-hari</span>}
                                </div>
                                <div className="flex items-center gap-3 text-xs opacity-90">
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {event.startTime} - {event.endTime}
                                    </div>
                                    {event.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin size={12} />
                                            {event.location.length > 20 ? event.location.substring(0, 20) + '...' : event.location}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {dayTasks.map(task => (
                        <div 
                            key={task.id} 
                            onClick={() => onTaskClick && onTaskClick(task)}
                            className={`p-3 rounded-xl shadow-sm border-l-4 flex flex-col justify-center cursor-pointer active:scale-95 transition-transform
                            ${task.status === 'done' 
                                ? 'bg-emerald-500 text-white border-emerald-700' 
                                : 'bg-blue-500 text-white border-blue-700'
                            }`}>
                             <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
                                {task.status === 'done' && <CheckCircle2 size={14} className="text-white" />}
                                {task.title}
                             </h4>
                             <div className="flex items-center justify-between text-xs opacity-90">
                                <span>Prioritas {task.priority.toUpperCase()}</span>
                                {task.duration && <span className="flex items-center gap-1"><Clock size={12} /> {task.duration}</span>}
                             </div>
                        </div>
                    ))}

                    {!hasItems && (
                      <div className="h-4"></div>
                    )}
                </div>
            </div>
        );
    }

    return <div className="flex flex-col space-y-2 pt-4 px-4">{daysWithContent}</div>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-20">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            {monthNames[month]} <span className="text-slate-400 font-normal">{year}</span>
        </h2>
        <div className="flex items-center gap-1 md:gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                <ChevronLeft size={20} />
            </button>
            <button onClick={goToToday} className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs md:text-sm font-bold rounded-lg transition-colors">
                Hari Ini
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                <ChevronRight size={20} />
            </button>
        </div>
      </div>

      <div className="hidden md:block">
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
            {dayNamesShort.map(day => (
                <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {day}
                </div>
            ))}
          </div>
          <div className="grid grid-cols-7 bg-slate-100 gap-px border-b border-slate-100">
            {renderCalendarDaysDesktop()}
          </div>
      </div>

      <div className="md:hidden min-h-[400px]">
          {renderMobileList()}
      </div>
    </div>
  );
};
