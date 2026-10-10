import React, { useState } from 'react';
import { FinancialProvider } from './context/FinancialContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { OverviewView } from './components/views/OverviewView';
import { EmployeesView } from './components/views/EmployeesView';
import { ExpensesView } from './components/views/ExpensesView';
import { SalesEntryView } from './components/views/SalesEntryView';

function App() {
  const [currentView, setCurrentView] = useState('overview');

  const renderView = () => {
    switch (currentView) {
      case 'overview': return <OverviewView />;
      case 'sales': return <SalesEntryView />;
      case 'expenses': return <ExpensesView />;
      case 'employees': return <EmployeesView />;
      default: return <OverviewView />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'overview': return 'Visión General';
      case 'sales': return 'Registro de Ventas Diarias';
      case 'expenses': return 'Gestión de Gastos Dinámicos';
      case 'employees': return 'Nómina y Empleados';
      default: return 'Visión General';
    }
  };

  return (
    <FinancialProvider>
      <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          <Topbar title={getTitle()} />
          <main className="flex-1 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {renderView()}
          </main>
        </div>
      </div>
    </FinancialProvider>
  );
}

export default App;
