/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react';
import { formatDOP } from '../lib/utils';
import type { 
  FinancialContextType, 
  SalesItem, 
  Expense, 
  Employee, 
  PaymentRecord,
  Product,
  Service,
  SalesRecord
} from '../types';

export { formatDOP };

const FinancialContext = createContext<FinancialContextType | null>(null);

export const useFinancial = (): FinancialContextType => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

const initialEmployees: Employee[] = [
  { id: '1', name: 'Carlos Gomez', role: 'Lead Barista', totalAmountOwed: 29500, amountPaid: 0, status: 'Pending', paymentHistory: [] },
  { id: '2', name: 'Ana Martinez', role: 'Cashier', totalAmountOwed: 20000, amountPaid: 0, status: 'Pending', paymentHistory: [] },
  { id: '3', name: 'Luis Peña', role: 'Bar Assistant', totalAmountOwed: 16500, amountPaid: 0, status: 'Pending', paymentHistory: [] },
  { id: '4', name: 'Sofia Rojas', role: 'Pastry Chef', totalAmountOwed: 25000, amountPaid: 0, status: 'Pending', paymentHistory: [] },
];

const fallbackServices: Service[] = [
  { id: '1', name: 'Alquiler Local', amount: 60000, dueDate: '2023-11-01', status: 'Pending' },
  { id: '2', name: 'Electricidad', amount: 26000, dueDate: '2023-10-25', status: 'Pending' },
  { id: '3', name: 'Agua Comercial', amount: 4500, dueDate: '2023-10-20', status: 'Pending' },
];

const fallbackProducts: Product[] = [
  { id: 'p1', name: 'Café Espresso', category: 'Café Caliente', sellingPrice: 150, ingredientCost: 40, margin: 110 },
  { id: 'p2', name: 'Cappuccino 12oz', category: 'Café Caliente', sellingPrice: 220, ingredientCost: 65, margin: 155 },
  { id: 'p3', name: 'Croissant Mantequilla', category: 'Repostería', sellingPrice: 180, ingredientCost: 60, margin: 120 },
  { id: 'p4', name: 'Iced Caramel Macchiato', category: 'Bebidas Frías', sellingPrice: 280, ingredientCost: 85, margin: 195 },
];

const fallbackSalesHistory: SalesRecord[] = [
  { id: 's1', time: '07:15 AM', itemsSold: '2x Espresso, 1x Croissant', totalAmount: 350 },
  { id: 's2', time: '08:30 AM', itemsSold: 'Catering Corporativo: 50x Cappuccino, 50x Croissant', totalAmount: 17250 },
  { id: 's3', time: '09:45 AM', itemsSold: 'Evento Privado (Alquiler + Bebidas)', totalAmount: 185000 },
  { id: 's4', time: '11:00 AM', itemsSold: '1x Espresso, 1x Latte 16oz', totalAmount: 320 },
  { id: 's5', time: '01:15 PM', itemsSold: '2x Cappuccino 12oz, 2x Croissant', totalAmount: 690 },
  { id: 's6', time: '02:30 PM', itemsSold: '5x Iced Caramel Macchiato, 3x Galletas', totalAmount: 1520 },
];

export interface FinancialProviderProps {
  children: ReactNode;
}

export const FinancialProvider = ({ children }: FinancialProviderProps) => {
  const [salesItems, setSalesItems] = useState<SalesItem[]>(() => {
    const saved = localStorage.getItem('cafe_sales_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('cafe_expenses');
    return saved ? JSON.parse(saved) : [
      { id: '1', expenseName: 'Alquiler Local', amount: 60000, status: 'Pending' },
      { id: '2', expenseName: 'Energía Eléctrica', amount: 26000, status: 'Pending' },
      { id: '3', expenseName: 'Agua Potable', amount: 4500, status: 'Pending' },
    ];
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('cafe_employees');
    const parsed: Employee[] = saved ? JSON.parse(saved) : initialEmployees;
    return parsed.map(e => ({ ...e, paymentHistory: e.paymentHistory || [] }));
  });

  const [services, setServices] = useState<Service[]>(fallbackServices);

  // Persist state
  useEffect(() => {
    localStorage.setItem('cafe_sales_items', JSON.stringify(salesItems));
    localStorage.setItem('cafe_expenses', JSON.stringify(expenses));
    localStorage.setItem('cafe_employees', JSON.stringify(employees));
  }, [salesItems, expenses, employees]);

  // Derived Metrics (Safe from NaN)
  const todayTotalEarnings = useMemo(() => {
    return salesItems.reduce((acc, curr) => acc + (Number(curr.unitPrice) || 0) * (Number(curr.unitsSold) || 0), 0);
  }, [salesItems]);

  const totalExpensesPaid = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + (curr.status === 'Paid' ? (Number(curr.amount) || 0) : 0), 0);
  }, [expenses]);
  
  const totalExpensesPending = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + (curr.status === 'Pending' ? (Number(curr.amount) || 0) : 0), 0);
  }, [expenses]);

  const totalPayrollPaid = useMemo(() => {
    return employees.reduce((acc, curr) => acc + (Number(curr.amountPaid) || 0), 0);
  }, [employees]);

  const totalPayrollPending = useMemo(() => {
    return employees.reduce((acc, curr) => acc + Math.max(0, (Number(curr.totalAmountOwed) || 0) - (Number(curr.amountPaid) || 0)), 0);
  }, [employees]);

  const totalOutflows = totalExpensesPaid + totalPayrollPaid;
  const netAvailableCash = todayTotalEarnings - totalOutflows;

  // Sales Catalog Actions
  const addSalesItem = (item: Omit<SalesItem, 'id' | 'unitsSold'>) => {
    setSalesItems(prev => [...prev, { ...item, id: crypto.randomUUID(), unitsSold: 0 }]);
  };

  const deleteSalesItem = (id: string) => {
    setSalesItems(prev => prev.filter(s => s.id !== id));
  };

  const incrementSale = (id: string) => {
    setSalesItems(prev => prev.map(s => s.id === id ? { ...s, unitsSold: s.unitsSold + 1 } : s));
  };

  const decrementSale = (id: string) => {
    setSalesItems(prev => prev.map(s => s.id === id ? { ...s, unitsSold: Math.max(0, s.unitsSold - 1) } : s));
  };

  const updateUnitPrice = (id: string, newPrice: number | string) => {
    const safePrice = Number(newPrice) || 0;
    setSalesItems(prev => prev.map(s => s.id === id ? { ...s, unitPrice: safePrice } : s));
  };

  const resetDaySales = () => {
    setSalesItems(prev => prev.map(s => ({ ...s, unitsSold: 0 })));
  };

  // Expenses Actions
  const addExpense = (expense: Omit<Expense, 'id' | 'status'>) => {
    setExpenses(prev => [...prev, { ...expense, id: crypto.randomUUID(), status: 'Pending' }]);
  };

  const updateExpense = (id: string, updatedFields: Partial<Omit<Expense, 'id'>>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updatedFields } : e));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const toggleExpenseStatus = (id: string, newStatus: string) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: newStatus as 'Pending' | 'Paid' } : e));
  };

  // Employee Actions
  const toggleEmployeeStatus = (id: string, newStatus: string) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        if (newStatus === 'Paid') {
          const missingAmount = Math.max(0, e.totalAmountOwed - e.amountPaid);
          const historyEntry: PaymentRecord | null = missingAmount > 0 
            ? { id: crypto.randomUUID(), amount: missingAmount, date: new Date().toLocaleString() } 
            : null;
            
          return { 
            ...e, 
            status: 'Paid', 
            amountPaid: e.totalAmountOwed,
            paymentHistory: historyEntry ? [...e.paymentHistory, historyEntry] : e.paymentHistory
          };
        } else {
          return { ...e, status: 'Pending', amountPaid: 0, paymentHistory: [] };
        }
      }
      return e;
    }));
  };

  const updateEmployeeTotalOwed = (id: string, newTotal: number | string) => {
    const safeTotal = Number(newTotal) || 0;
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, totalAmountOwed: safeTotal } : e));
  };

  const addEmployeeInstallment = (id: string, amount: number | string) => {
    const safeAmount = Number(amount) || 0;
    if (safeAmount <= 0) return;
    
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        const newPaid = e.amountPaid + safeAmount;
        const newHistory: PaymentRecord[] = [...e.paymentHistory, { id: crypto.randomUUID(), amount: safeAmount, date: new Date().toLocaleString() }];
        return { 
          ...e, 
          amountPaid: newPaid, 
          status: newPaid >= e.totalAmountOwed ? 'Paid' : 'Pending',
          paymentHistory: newHistory
        };
      }
      return e;
    }));
  };

  const deleteInstallment = (employeeId: string, installmentId: string) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === employeeId) {
        const installment = e.paymentHistory.find(h => h.id === installmentId);
        if (!installment) return e;
        
        const newHistory = e.paymentHistory.filter(h => h.id !== installmentId);
        const newPaid = Math.max(0, e.amountPaid - installment.amount);
        
        return {
          ...e,
          amountPaid: newPaid,
          status: newPaid < e.totalAmountOwed ? 'Pending' : e.status,
          paymentHistory: newHistory
        };
      }
      return e;
    }));
  };

  const resetEmployeePayments = (id: string) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, amountPaid: 0, status: 'Pending', paymentHistory: [] } : e));
  };

  const addEmployee = (empData: { name: string; role?: string; totalAmountOwed?: number; id?: string }) => {
    const newEmp: Employee = {
      id: empData.id || crypto.randomUUID(),
      name: empData.name,
      role: empData.role || 'Personal de Barra',
      totalAmountOwed: Number(empData.totalAmountOwed) || 0,
      amountPaid: 0,
      status: 'Pending',
      paymentHistory: [],
    };
    setEmployees(prev => [newEmp, ...prev]);
  };

  const updateEmployeeName = (id: string, newName: string) => {
    setEmployees(prev => prev.map(e => (e.id === id ? { ...e, name: newName } : e)));
  };

  // Compatibility methods for auxiliary views
  const toggleServiceStatus = (id: string, newStatus: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status: newStatus as 'Pending' | 'Paid' } : s));
  };

  return (
    <FinancialContext.Provider
      value={{
        salesItems, 
        expenses, 
        employees,
        todayTotalEarnings, 
        totalExpensesPaid, 
        totalExpensesPending, 
        totalPayrollPaid, 
        totalPayrollPending, 
        totalOutflows, 
        netAvailableCash,
        addSalesItem, 
        deleteSalesItem, 
        incrementSale, 
        decrementSale, 
        updateUnitPrice, 
        resetDaySales,
        addExpense, 
        updateExpense, 
        deleteExpense, 
        toggleExpenseStatus,
        toggleEmployeeStatus, 
        updateEmployeeTotalOwed, 
        addEmployeeInstallment, 
        deleteInstallment, 
        resetEmployeePayments,
        addEmployee,
        updateEmployeeName,
        formatDOP,
        products: fallbackProducts,
        services,
        salesHistory: fallbackSalesHistory,
        toggleServiceStatus,
        formatCurrency: formatDOP,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};
