import React from 'react';
import { LayoutDashboard, Users, Receipt, ShoppingCart } from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sales', label: 'Ventas del Día', icon: ShoppingCart },
  { id: 'expenses', label: 'Gastos Dinámicos', icon: Receipt },
  { id: 'employees', label: 'Empleados', icon: Users },
];

export const Sidebar = ({ currentView, setCurrentView }) => {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          AllDayCafe
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-emerald-400' : 'text-slate-500'} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold">
            AD
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">Admin</p>
            <p className="text-xs text-slate-500">admin@allday.cafe</p>
          </div>
        </div>
      </div>
    </div>
  );
};
