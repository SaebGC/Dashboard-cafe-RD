import { useState, type ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinancialProvider } from './context/FinancialContext';
import { RoleProvider, useRole } from './context/RoleContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { 
  LoginView,
  OverviewView,
  EmpleadoPosView,
  AdminSalesEntryView,
  AdminMenuView,
  AdminExpensesView,
  AdminEmployeesView,
  JefeDashboardView,
  JefePayrollView
} from './components/views';
import { navItems } from './constants/navigation';
import type { UserRole } from './types';

function DashboardApp() {
  const { role, setRole } = useRole();
  const [currentView, setCurrentView] = useState<string>('admin-overview');

  // Determine allowed navigation items for the current role
  const allowedNavItems = navItems.filter((item) => item.allowedRoles.includes(role));
  const allowedViewIds = allowedNavItems.map((item) => item.id);
  const defaultView = allowedViewIds[0] || 'empleado-pos';

  // Synchronous guard for rendering: guarantees unauthorized views are never rendered
  const activeView = allowedViewIds.includes(currentView) ? currentView : defaultView;

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    const newAllowed = navItems.filter((item) => item.allowedRoles.includes(newRole));
    // If current view is not valid for new role, redirect to the first allowed view for that role
    if (!newAllowed.some((item) => item.id === currentView)) {
      setCurrentView(newAllowed[0]?.id || 'empleado-pos');
    }
  };

  const renderView = (): ReactNode => {
    switch (activeView) {
      // JEFE Views
      case 'jefe-overview':
        return <JefeDashboardView />;
      case 'jefe-payroll':
        return <JefePayrollView />;
      case 'jefe-expenses':
        return <AdminExpensesView />;

      // ADMIN Views
      case 'admin-overview':
        return <OverviewView />;
      case 'admin-pos':
        return <AdminSalesEntryView />;
      case 'admin-menu':
        return <AdminMenuView />;
      case 'admin-expenses':
        return <AdminExpensesView />;
      case 'admin-employees':
        return <AdminEmployeesView />;

      // EMPLEADO Views
      case 'empleado-pos':
        return <EmpleadoPosView />;

      // Fallback aliases for backward compatibility
      case 'overview':
        return role === 'jefe' ? <JefeDashboardView /> : <OverviewView />;
      case 'sales':
        return role === 'empleado' ? <EmpleadoPosView /> : <AdminSalesEntryView />;
      case 'expenses':
        return <AdminExpensesView />;
      case 'employees':
        return role === 'jefe' ? <JefePayrollView /> : <AdminEmployeesView />;

      default:
        return role === 'empleado' ? <EmpleadoPosView /> : <OverviewView />;
    }
  };

  const getTitle = (): string => {
    switch (activeView) {
      case 'jefe-overview': return 'Dashboard Ejecutivo';
      case 'jefe-payroll': return 'Supervisión de Nómina y Deuda Salarial';
      case 'jefe-expenses': return 'Auditoría de Gastos Operativos';
      case 'admin-overview': return 'Visión General del Local';
      case 'admin-pos': return 'Punto de Venta y Catálogo Diario';
      case 'admin-menu': return 'Catálogo de Productos y Márgenes';
      case 'admin-expenses': return 'Gestión de Gastos Dinámicos';
      case 'admin-employees': return 'Nómina y Gestión de Pagos';
      case 'empleado-pos': return 'Terminal de Ventas';
      default: return 'AllDayCafe Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-[#F9F7F2] text-[#2C3E35] overflow-hidden font-sans">
      <Sidebar 
        currentView={activeView} 
        setCurrentView={setCurrentView} 
        currentRole={role}
        onRoleChange={handleRoleChange}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Topbar 
          title={getTitle()} 
          currentRole={role} 
          onRoleChange={handleRoleChange} 
        />
        <main className="flex-1 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-[#EBE6DC] scrollbar-track-transparent">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

function MainApp() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <DashboardApp />;
}

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <FinancialProvider>
          <MainApp />
        </FinancialProvider>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;

