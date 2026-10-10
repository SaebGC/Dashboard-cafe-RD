import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const FinancialContext = createContext();
export const useFinancial = () => useContext(FinancialContext);

export const formatDOP = (amount) => {
  const validAmount = isNaN(Number(amount)) ? 0 : Number(amount);
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 2,
  }).format(validAmount).replace('DOP', 'RD$');
};

const initialEmployees = [
  { id: '1', name: 'Carlos Gomez', role: 'Lead Barista', totalAmountOwed: 29500, amountPaid: 0, status: 'Pending', paymentHistory: [] },
  { id: '2', name: 'Ana Martinez', role: 'Cashier', totalAmountOwed: 20000, amountPaid: 0, status: 'Pending', paymentHistory: [] },
  { id: '3', name: 'Luis Peña', role: 'Bar Assistant', totalAmountOwed: 16500, amountPaid: 0, status: 'Pending', paymentHistory: [] },
  { id: '4', name: 'Sofia Rojas', role: 'Pastry Chef', totalAmountOwed: 25000, amountPaid: 0, status: 'Pending', paymentHistory: [] },
];

export const FinancialProvider = ({ children }) => {
  const [salesItems, setSalesItems] = useState(() => {
    const saved = localStorage.getItem('cafe_sales_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('cafe_expenses');
    return saved ? JSON.parse(saved) : [
      { id: '1', expenseName: 'Alquiler Local', amount: 60000, status: 'Pending' },
      { id: '2', expenseName: 'Energía Eléctrica', amount: 26000, status: 'Pending' },
      { id: '3', expenseName: 'Agua Potable', amount: 4500, status: 'Pending' },
    ];
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('cafe_employees');
    const parsed = saved ? JSON.parse(saved) : initialEmployees;
    return parsed.map(e => ({ ...e, paymentHistory: e.paymentHistory || [] }));
  });

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
  const addSalesItem = (item) => {
    setSalesItems(prev => [...prev, { ...item, id: crypto.randomUUID(), unitsSold: 0 }]);
  };

  const deleteSalesItem = (id) => {
    setSalesItems(prev => prev.filter(s => s.id !== id));
  };

  const incrementSale = (id) => {
    setSalesItems(prev => prev.map(s => s.id === id ? { ...s, unitsSold: s.unitsSold + 1 } : s));
  };

  const decrementSale = (id) => {
    setSalesItems(prev => prev.map(s => s.id === id ? { ...s, unitsSold: Math.max(0, s.unitsSold - 1) } : s));
  };

  const updateUnitPrice = (id, newPrice) => {
    const safePrice = Number(newPrice) || 0;
    setSalesItems(prev => prev.map(s => s.id === id ? { ...s, unitPrice: safePrice } : s));
  };

  const resetDaySales = () => {
    setSalesItems(prev => prev.map(s => ({ ...s, unitsSold: 0 })));
  };

  // Expenses Actions
  const addExpense = (expense) => setExpenses(prev => [...prev, { ...expense, id: crypto.randomUUID(), status: 'Pending' }]);
  const updateExpense = (id, updatedFields) => setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updatedFields } : e));
  const deleteExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));
  const toggleExpenseStatus = (id, newStatus) => setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));

  // Employee Actions
  const toggleEmployeeStatus = (id, newStatus) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        if (newStatus === 'Paid') {
          const missingAmount = Math.max(0, e.totalAmountOwed - e.amountPaid);
          const historyEntry = missingAmount > 0 
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

  const updateEmployeeTotalOwed = (id, newTotal) => {
    const safeTotal = Number(newTotal) || 0;
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, totalAmountOwed: safeTotal } : e));
  };

  const addEmployeeInstallment = (id, amount) => {
    const safeAmount = Number(amount) || 0;
    if (safeAmount <= 0) return;
    
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        const newPaid = e.amountPaid + safeAmount;
        const newHistory = [...e.paymentHistory, { id: crypto.randomUUID(), amount: safeAmount, date: new Date().toLocaleString() }];
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

  const deleteInstallment = (employeeId, installmentId) => {
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

  const resetEmployeePayments = (id) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, amountPaid: 0, status: 'Pending', paymentHistory: [] } : e));
  };

  return (
    <FinancialContext.Provider
      value={{
        salesItems, expenses, employees,
        todayTotalEarnings, totalExpensesPaid, totalExpensesPending, totalPayrollPaid, totalPayrollPending, totalOutflows, netAvailableCash,
        addSalesItem, deleteSalesItem, incrementSale, decrementSale, updateUnitPrice, resetDaySales,
        addExpense, updateExpense, deleteExpense, toggleExpenseStatus,
        toggleEmployeeStatus, updateEmployeeTotalOwed, addEmployeeInstallment, deleteInstallment, resetEmployeePayments,
        formatDOP,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};
