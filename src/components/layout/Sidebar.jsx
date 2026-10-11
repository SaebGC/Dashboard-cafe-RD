import React from 'react';
import { LayoutDashboard, Users, Receipt, ShoppingCart } from 'lucide-react';
import cafeLogo from '../../assets/cafe-logo-all.jpg';

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sales', label: 'Ventas del Día', icon: ShoppingCart },
  { id: 'expenses', label: 'Gastos Dinámicos', icon: Receipt },
  { id: 'employees', label: 'Empleados', icon: Users },
];

export const Sidebar = ({ currentView, setCurrentView }) => {
  return (
    <aside className="w-64 bg-[#0F281E] border-r border-[#1B3D2F] h-screen flex flex-col select-none flex-shrink-0">
      <div className="py-6 px-4 flex items-center justify-center border-b border-[#1B3D2F]/60">
        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#C8963E] bg-[#0F281E] flex items-center justify-center p-1.5 shadow-lg">
          <img 
            src={cafeLogo} 
            alt="All Day Café Logo" 
            className="w-full h-full object-contain rounded-full" 
          />
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                isActive 
                  ? 'bg-[#183D2F] text-white font-semibold border-l-4 border-[#C99F5B] shadow-sm' 
                  : 'text-[#D8D1C2] hover:bg-[#183D2F]/60 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-[#C99F5B]' : 'text-[#D8D1C2]/70'} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-[#1B3D2F]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#183D2F] border border-[#1B3D2F] flex items-center justify-center text-[#C99F5B] font-bold">
            AD
          </div>
          <div>
            <p className="text-sm font-semibold text-[#D8D1C2]">Admin</p>
            <p className="text-xs text-[#6B7C72]">admin@allday.cafe</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
