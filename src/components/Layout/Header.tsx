import React from 'react';
import { Bell, User, Search, Calendar, Clock } from 'lucide-react';

interface HeaderProps {
  title: string;
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ title, onSearch }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100/50 px-6 py-4 sticky top-0 z-40">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {title}
            </h2>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center text-sm text-slate-500">
                <Calendar className="w-4 h-4 mr-1" />
                {currentDate}
              </div>
              <div className="flex items-center text-sm text-slate-500">
                <Clock className="w-4 h-4 mr-1" />
                {currentTime}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {onSearch && (
            <div className="relative group">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2.5 w-80 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-sm"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          )}
          
          <button className="relative p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group">
            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></span>
          </button>
          
          <button className="flex items-center space-x-2 p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium hidden md:block">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;