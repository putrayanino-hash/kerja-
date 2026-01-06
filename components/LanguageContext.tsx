import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'id';

// Translation Dictionary
const translations = {
  en: {
    nav: {
      kanban: 'Kanban',
      team: 'Team',
      tasks: 'Tasks',
      calendar: 'Calendar',
      events: 'Events',
      activity: 'Activity',
      settings: 'Settings',
    },
    auth: {
        loginTitle: 'Welcome Back',
        loginDesc: 'Enter your credentials to access your workspace.',
        username: 'Username',
        password: 'Password',
        loginBtn: 'Login',
        loginError: 'Invalid username or password',
        logout: 'Logout'
    },
    common: {
      addTask: 'Add Task',
      addEvent: 'Add Event',
      save: 'Save Changes',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      today: 'Today',
      overdue: 'Overdue',
      search: 'Search...',
      manageWork: 'Manage your team work here.',
      masterData: 'Master Data Settings',
      masterDataDesc: 'Configure your Kanban board, Event types, and User Roles.',
    },
    modal: {
      createTask: 'Create New Task',
      editTask: 'Edit Task',
      taskName: 'Task Name',
      desc: 'Description',
      assignedTo: 'Assigned To',
      dueDate: 'Due Date',
      links: 'Links (Auto-detect)',
      assetLink: 'Asset Link (Drive/Dropbox)',
      projectLink: 'Project Link (Canva/Capcut)',
      open: 'OPEN',
      createEvent: 'Schedule Event',
      editEvent: 'Edit Event',
      eventName: 'Event Name',
      eventType: 'Type',
      clientName: 'Client Name (Optional)',
      startDate: 'Start Date',
      endDate: 'End Date',
      startTime: 'Start Time',
      endTime: 'End Time',
      location: 'Location / Meeting Link',
    },
    kanban: {
        dropHere: 'Drop tasks here',
        todo: 'TODO',
        inProgress: 'IN PROGRESS',
        done: 'DONE'
    }
  },
  id: {
    nav: {
      kanban: 'Papan Kerja',
      team: 'Tim',
      tasks: 'Daftar Tugas',
      calendar: 'Kalender',
      events: 'Agenda',
      activity: 'Aktivitas',
      settings: 'Pengaturan',
    },
    auth: {
        loginTitle: 'Selamat Datang',
        loginDesc: 'Masukkan kredensial Anda untuk mengakses ruang kerja.',
        username: 'Username',
        password: 'Password',
        loginBtn: 'Masuk',
        loginError: 'Username atau password salah',
        logout: 'Keluar'
    },
    common: {
      addTask: 'Buat Tugas',
      addEvent: 'Buat Event',
      save: 'Simpan Perubahan',
      cancel: 'Batal',
      delete: 'Hapus',
      edit: 'Ubah',
      today: 'Hari Ini',
      overdue: 'Terlewat',
      search: 'Cari...',
      manageWork: 'Kelola pekerjaan tim Anda di sini.',
      masterData: 'Pengaturan Master Data',
      masterDataDesc: 'Konfigurasi papan Kanban, Tipe Event, dan Peran Pengguna.',
    },
    modal: {
      createTask: 'Buat Tugas Baru',
      editTask: 'Edit Tugas',
      taskName: 'Nama Tugas',
      desc: 'Deskripsi',
      assignedTo: 'Ditugaskan Ke',
      dueDate: 'Tenggat Waktu',
      links: 'Tautan (Deteksi Otomatis)',
      assetLink: 'Tautan Aset (Drive/Dropbox)',
      projectLink: 'Tautan Proyek (Canva/Capcut)',
      open: 'BUKA',
      createEvent: 'Jadwalkan Event',
      editEvent: 'Edit Event',
      eventName: 'Nama Event',
      eventType: 'Tipe',
      clientName: 'Nama Klien (Opsional)',
      startDate: 'Tanggal Mulai',
      endDate: 'Tanggal Selesai',
      startTime: 'Jam Mulai',
      endTime: 'Jam Selesai',
      location: 'Lokasi / Tautan Meeting',
    },
    kanban: {
        dropHere: 'Geser tugas ke sini',
        todo: 'AKAN DIKERJAKAN',
        inProgress: 'SEDANG DIPROSES',
        done: 'SELESAI'
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('app_lang') as Language) || 'id';
  });

  useEffect(() => {
    localStorage.setItem('app_lang', language);
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
