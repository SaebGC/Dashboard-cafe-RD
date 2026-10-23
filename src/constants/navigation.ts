import { LayoutDashboard, Users, Receipt, ShoppingCart, Coffee } from 'lucide-react';
import type { NavItem } from '../types';

export const navItems: NavItem[] = [
  // JEFE views (Executive overview & payroll debt audit)
  { id: 'jefe-overview', label: 'Dashboard Ejecutivo', icon: LayoutDashboard, allowedRoles: ['jefe'] },
  { id: 'jefe-payroll', label: 'Nómina & Deudas', icon: Users, allowedRoles: ['jefe'] },
  { id: 'jefe-expenses', label: 'Auditoría Gastos', icon: Receipt, allowedRoles: ['jefe'] },

  // ADMIN views (Full store management, catalog CRUD, day reset)
  { id: 'admin-overview', label: 'Visión General', icon: LayoutDashboard, allowedRoles: ['admin'] },
  { id: 'admin-pos', label: 'Punto de Venta (POS)', icon: ShoppingCart, allowedRoles: ['admin'] },
  { id: 'admin-menu', label: 'Gestión Menú', icon: Coffee, allowedRoles: ['admin'] },
  { id: 'admin-expenses', label: 'Gastos Operativos', icon: Receipt, allowedRoles: ['admin'] },
  { id: 'admin-employees', label: 'Gestión Nómina', icon: Users, allowedRoles: ['admin'] },

  // EMPLEADO views (Operational POS only, read-only pricing, no balances)
  { id: 'empleado-pos', label: 'Terminal de Ventas', icon: ShoppingCart, allowedRoles: ['empleado'] },
];
