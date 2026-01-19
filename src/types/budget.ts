import { Category } from './expense';

export interface Budget {
  id: string;
  category: Category;
  amount: number; // Fixed monthly amount for this category
  createdAt: string;
  updatedAt: string;
}

export interface BudgetFormData {
  category: Category;
  amount: string;
}

export interface BudgetStatus {
  category: Category;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'safe' | 'warning' | 'danger' | 'exceeded';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsGoalFormData {
  name: string;
  targetAmount: string;
  currentAmount: string;
  deadline?: string;
}

export interface PlanningOverview {
  totalIncome: number;
  totalBudgeted: number;
  totalSpent: number;
  totalSavings: number;
  availableToSpend: number;
  budgetStatuses: BudgetStatus[];
}
