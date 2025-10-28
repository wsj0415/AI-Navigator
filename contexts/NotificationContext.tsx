import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Notification, NotificationType } from '../types';
// Fix: Import all required icons, including the previously missing CloseIcon.
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, CloseIcon } from '../components/Icons';

interface NotificationContextType {
  addNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const iconMap = {
  success: <CheckCircleIcon className="w-6 h-6 mr-3" />,
  error: <XCircleIcon className="w-6 h-6 mr-3" />,
  info: <InformationCircleIcon className="w-6 h-6 mr-3" />,
};

const colorMap = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: NotificationType = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeNotification(id);
    }, 5000); // Auto-dismiss after 5 seconds
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed top-5 right-5 z-[100] space-y-3 w-full max-w-sm">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`flex items-center p-4 rounded-lg shadow-lg text-white animate-slide-in-out ${colorMap[notification.type]}`}
          >
            {iconMap[notification.type]}
            <span className="flex-grow text-sm font-medium">{notification.message}</span>
            <button onClick={() => removeNotification(notification.id)} className="ml-4 font-bold opacity-70 hover:opacity-100 p-1 rounded-full">
              <CloseIcon className="w-4 h-4"/>
            </button>
          </div>
        ))}
      </div>
       <style>{`
        @keyframes slideInOut {
            0% { opacity: 0; transform: translateX(100%); }
            10% { opacity: 1; transform: translateX(0); }
            90% { opacity: 1; transform: translateX(0); }
            100% { opacity: 0; transform: translateX(100%); }
        }
        .animate-slide-in-out {
            animation: slideInOut 5s ease-in-out forwards;
        }
      `}</style>
    </NotificationContext.Provider>
  );
};