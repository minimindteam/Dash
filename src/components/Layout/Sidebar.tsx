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
  ShoppingCart
} from 'lucide-react';

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
  return (
    <aside className="w-64 bg-gray-800 shadow-xl h-screen sticky top-0">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your website content</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-700 transition-colors ${
                activeSection === item.id
                  ? 'bg-gray-700 text-white border-r-4 border-primary'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;