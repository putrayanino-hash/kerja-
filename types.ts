
export type TaskStatus = string;

export interface User {
  id: string;
  name: string;
  username: string; // New field
  password?: string; // New field (optional because mock users might not have it initially, but logic will enforce it)
  avatar: string; 
  role: 'Owner' | 'Member' | 'Guest';
  email: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: string[]; 
  ownerId: string;
  theme: string; 
}

export interface InviteLink {
  id: string; 
  teamId: string;
  role: 'Member' | 'Guest';
  createdAt: string;
  createdBy: string; 
  status: 'active' | 'revoked';
  uses: number; 
}

export interface Invitation {
  id: string;
  teamId: string;
  email: string;
  role: 'Member' | 'Guest';
  status: 'pending' | 'accepted';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string; 
  text: string;
  type: 'assignment' | 'alert' | 'info';
  isRead: boolean;
  createdAt: string;
  taskId?: string; 
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: string; 
  isResolved: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  teamId: string; 
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  eventName?: string;
  duration?: string;
  assetLink?: string; 
  projectLink?: string; 
  comments?: Comment[];
  subtasks?: Subtask[];
}

export type EventType = string;

export interface Event {
  id: string;
  teamId: string; 
  title: string;
  description: string;
  date: string; // Start Date ISO string YYYY-MM-DD
  endDate: string; // End Date ISO string YYYY-MM-DD
  startTime: string; 
  endTime: string; 
  type: EventType;
  attendees: string[]; 
  location?: string;
  clientName?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string; 
  target: string; 
  timestamp: string;
  type: 'task' | 'event' | 'team';
}

export interface TeamStats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  members: number;
}

export type ThemeId = 'emerald-light' | 'ocean-light' | 'sunset-light' | 'berry-light' | 'midnight-dark' | 'forest-dark' | 'cyber-dark';

export interface Theme {
  id: ThemeId;
  name: string;
  type: 'light' | 'dark';
  colors: {
    primary: string; 
    bg: string; 
    surface: string; 
    text: string; 
  }
}

export type ColorTheme = 'slate' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose';

export interface KanbanColumn {
  id: string;
  title: string;
  theme: ColorTheme;
}

export interface EventTypeConfig {
  id: string;
  label: string;
  theme: ColorTheme;
}
