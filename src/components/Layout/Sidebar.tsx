import React from 'react';
import { 
  Home, 
  Globe, 
  Package, 
  Users, 
  Star, 
  Briefcase, 
  Mail, 
  Settings,
  ShoppingCart,
  LogOut
} from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'home', label: 'Home Content', icon: Home },
  { id: 'services', label: 'Services', icon: Globe },
  { id: 'packages', label: 'Packages', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'reviews-stats', label: 'Reviews Stats', icon: Star },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'messages', label: 'Messages', icon: Mail },
  { id: 'contact', label: 'Contact Info', icon: Settings }
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('access_token');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl h-screen sticky top-0 border-r border-slate-700">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Minimind</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      </div>
      
      <nav className="mt-4 px-3 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-4 py-3 mb-1 text-left rounded-xl transition-all duration-200 group ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                activeSection === item.id ? 'scale-110' : 'group-hover:scale-105'
              }`} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-red-600/20 rounded-xl transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 mr-3 group-hover:scale-105 transition-transform duration-200" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;