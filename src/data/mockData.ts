export interface Employee {
  id: string;
  name: string;
  role: 'Lead Barista' | 'Cashier' | 'Bar Assistant' | 'Pastry Chef';
  amountOwed: number;
  paymentTerm: 'Lump Sum' | 'Installments';
  status: 'Pending' | 'Paid';
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

export const initialEmployees: Employee[] = [
  { id: '1', name: 'Carlos Gomez', role: 'Lead Barista', amountOwed: 29500, paymentTerm: 'Lump Sum', status: 'Pending' },
  { id: '2', name: 'Ana Martinez', role: 'Cashier', amountOwed: 20000, paymentTerm: 'Lump Sum', status: 'Pending' },
  { id: '3', name: 'Luis Peña', role: 'Bar Assistant', amountOwed: 16500, paymentTerm: 'Installments', status: 'Pending' },
  { id: '4', name: 'Sofia Rojas', role: 'Pastry Chef', amountOwed: 25000, paymentTerm: 'Lump Sum', status: 'Pending' },
];

export const initialServices: Service[] = [
  { id: '1', name: 'Alquiler Local', amount: 60000, dueDate: '2023-11-01', status: 'Pending' },
  { id: '2', name: 'Electricidad', amount: 26000, dueDate: '2023-10-25', status: 'Pending' },
  { id: '3', name: 'Agua Comercial', amount: 4500, dueDate: '2023-10-20', status: 'Pending' },
];

export const initialSalesHistory: SalesRecord[] = [
  { id: 's1', time: '07:15 AM', itemsSold: '2x Espresso, 1x Croissant', totalAmount: 350 },
  { id: 's2', time: '08:30 AM', itemsSold: 'Catering Corporativo: 50x Cappuccino, 50x Croissant', totalAmount: 17250 },
  { id: 's3', time: '09:45 AM', itemsSold: 'Evento Privado (Alquiler + Bebidas)', totalAmount: 185000 },
  { id: 's4', time: '11:00 AM', itemsSold: '1x Espresso, 1x Latte 16oz', totalAmount: 320 },
  { id: 's5', time: '01:15 PM', itemsSold: '2x Cappuccino 12oz, 2x Croissant', totalAmount: 690 },
  { id: 's6', time: '02:30 PM', itemsSold: '5x Iced Caramel Macchiato, 3x Galletas', totalAmount: 1520 },
];
