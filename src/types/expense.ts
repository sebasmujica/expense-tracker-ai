export type Category =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Utilities'
  | 'Grocery'
  | 'Other';

export const CATEGORIES: Category[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Utilities',
  'Grocery',
  'Other',
];

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO date string
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface ExpenseFormData {
  amount: string;
  category: Category;
  description: string;
  date: string;
}

export interface ExpenseFilters {
  search: string;
  category: Category | 'All';
  startDate: string;
  endDate: string;
}

export interface ExpenseSummary {
  totalExpenses: number;
  monthlyExpenses: number;
  averageExpense: number;
  expenseCount: number;
  categoryBreakdown: Record<Category, number>;
  monthlyTrend: { month: string; amount: number }[];
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#22c55e',
  Transportation: '#3b82f6',
  Entertainment: '#a855f7',
  Shopping: '#f97316',
  Bills: '#ef4444',
  Utilities: '#14b8a6',
  Grocery: '#84cc16',
  Other: '#6b7280',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  Food: '🍔',
  Transportation: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '📄',
  Utilities: '💡',
  Grocery: '🛒',
  Other: '📦',
};
