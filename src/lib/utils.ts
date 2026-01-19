import { Expense, ExpenseFilters, ExpenseSummary, Category, CATEGORIES } from '@/types/expense';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM dd, yyyy');
}

export function formatDateForInput(dateString: string): string {
  return format(parseISO(dateString), 'yyyy-MM-dd');
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getMonthStart(): string {
  return format(startOfMonth(new Date()), 'yyyy-MM-dd');
}

export function getMonthEnd(): string {
  return format(endOfMonth(new Date()), 'yyyy-MM-dd');
}

export function filterExpenses(expenses: Expense[], filters: ExpenseFilters): Expense[] {
  return expenses.filter((expense) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        expense.description.toLowerCase().includes(searchLower) ||
        expense.category.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category !== 'All' && expense.category !== filters.category) {
      return false;
    }

    // Date range filter
    if (filters.startDate && filters.endDate) {
      const expenseDate = parseISO(expense.date);
      const start = parseISO(filters.startDate);
      const end = parseISO(filters.endDate);
      if (!isWithinInterval(expenseDate, { start, end })) {
        return false;
      }
    }

    return true;
  });
}

export function calculateSummary(expenses: Expense[]): ExpenseSummary {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Total expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Monthly expenses
  const monthlyExpenses = expenses
    .filter((exp) => {
      const expDate = parseISO(exp.date);
      return isWithinInterval(expDate, { start: monthStart, end: monthEnd });
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  // Average expense
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  // Category breakdown
  const categoryBreakdown = CATEGORIES.reduce((acc, category) => {
    acc[category] = expenses
      .filter((exp) => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return acc;
  }, {} as Record<Category, number>);

  // Monthly trend (last 6 months)
  const monthlyTrend: { month: string; amount: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const mStart = startOfMonth(monthDate);
    const mEnd = endOfMonth(monthDate);
    const monthLabel = format(monthDate, 'MMM');
    const amount = expenses
      .filter((exp) => {
        const expDate = parseISO(exp.date);
        return isWithinInterval(expDate, { start: mStart, end: mEnd });
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
    monthlyTrend.push({ month: monthLabel, amount });
  }

  return {
    totalExpenses,
    monthlyExpenses,
    averageExpense,
    expenseCount: expenses.length,
    categoryBreakdown,
    monthlyTrend,
  };
}

export function exportToCSV(expenses: Expense[]): string {
  const headers = ['Date', 'Description', 'Category', 'Amount'];
  const rows = expenses.map((exp) => [
    formatDate(exp.date),
    `"${exp.description.replace(/"/g, '""')}"`,
    exp.category,
    exp.amount.toFixed(2),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
