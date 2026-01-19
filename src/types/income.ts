export type IncomeCategory =
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Business'
  | 'Gift'
  | 'Other';

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salary',
  'Freelance',
  'Investment',
  'Business',
  'Gift',
  'Other',
];

export interface Income {
  id: string;
  amount: number;
  category: IncomeCategory;
  description: string;
  date: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeFormData {
  amount: string;
  category: IncomeCategory;
  description: string;
  date: string;
  isRecurring: boolean;
}

export const INCOME_CATEGORY_COLORS: Record<IncomeCategory, string> = {
  Salary: '#22c55e',
  Freelance: '#3b82f6',
  Investment: '#a855f7',
  Business: '#f97316',
  Gift: '#ec4899',
  Other: '#6b7280',
};

export const INCOME_CATEGORY_ICONS: Record<IncomeCategory, string> = {
  Salary: '💼',
  Freelance: '💻',
  Investment: '📈',
  Business: '🏢',
  Gift: '🎁',
  Other: '💰',
};
