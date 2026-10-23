export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  totalAmountOwed: number;
  amountPaid: number;
  status: 'Pending' | 'Paid';
  paymentHistory: PaymentRecord[];
}

export interface Expense {
  id: string;
  expenseName: string;
  amount: number;
  status: 'Pending' | 'Paid';
}

export interface SalesItem {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  unitsSold: number;
}

export interface Service {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Paid';
}

export interface SalesRecord {
  id: string;
  time: string;
  itemsSold: string;
  totalAmount: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  ingredientCost: number;
  margin: number;
}

export interface ConfirmModalConfig {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  isDestructive?: boolean;
}

export interface FinancialContextType {
  salesItems: SalesItem[];
  expenses: Expense[];
  employees: Employee[];
  todayTotalEarnings: number;
  totalExpensesPaid: number;
  totalExpensesPending: number;
  totalPayrollPaid: number;
  totalPayrollPending: number;
  totalOutflows: number;
  netAvailableCash: number;
  addSalesItem: (item: Omit<SalesItem, 'id' | 'unitsSold'>) => void;
  deleteSalesItem: (id: string) => void;
  incrementSale: (id: string) => void;
  decrementSale: (id: string) => void;
  updateUnitPrice: (id: string, newPrice: number | string) => void;
  resetDaySales: () => void;
  addExpense: (expense: Omit<Expense, 'id' | 'status'>) => void;
  updateExpense: (id: string, updatedFields: Partial<Omit<Expense, 'id'>>) => void;
  deleteExpense: (id: string) => void;
  toggleExpenseStatus: (id: string, newStatus: string) => void;
  toggleEmployeeStatus: (id: string, newStatus: string) => void;
  updateEmployeeTotalOwed: (id: string, newTotal: number | string) => void;
  addEmployeeInstallment: (id: string, amount: number | string) => void;
  deleteInstallment: (employeeId: string, installmentId: string) => void;
  resetEmployeePayments: (id: string) => void;
  formatDOP: (amount: number | string) => string;
  addEmployee: (employee: { name: string; role?: string; totalAmountOwed?: number; id?: string }) => void;
  updateEmployeeName: (id: string, newName: string) => void;
  // Compatibility fields for auxiliary views
  products: Product[];
  services: Service[];
  salesHistory: SalesRecord[];
  toggleServiceStatus: (id: string, newStatus: string) => void;
  formatCurrency: (amount: number | string) => string;
}

export type UserRole = 'empleado' | 'admin' | 'jefe';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantName: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: import('lucide-react').LucideIcon;
  allowedRoles: UserRole[];
}

