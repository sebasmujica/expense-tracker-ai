'use client';

import React, { useMemo, useState } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { useIncomes } from '@/context/IncomeContext';
import { useBudgets } from '@/context/BudgetContext';
import { calculateSummary, formatCurrency } from '@/lib/utils';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { ExpenseItem } from '@/components/expenses/ExpenseItem';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { CATEGORIES, Category, Expense, ExpenseFormData } from '@/types/expense';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import Link from 'next/link';

export default function DashboardPage() {
  const { expenses, isLoading: expensesLoading, deleteExpense, updateExpense } = useExpenses();
  const { getMonthlyIncome, isLoading: incomesLoading } = useIncomes();
  const { savingsGoals, isLoading: budgetLoading, budgets, getBudgetStatus, getTotalBudgeted } = useBudgets();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleEditSubmit = (data: ExpenseFormData) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
      setEditingExpense(null);
    }
  };

  const summary = useMemo(() => calculateSummary(expenses), [expenses]);
  const monthlyIncome = getMonthlyIncome();
  const totalBudgeted = getTotalBudgeted();

  // Calculate monthly expenses per category
  const monthlyExpensesByCategory = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const categoryExpenses: Record<Category, number> = {} as Record<Category, number>;
    CATEGORIES.forEach((cat) => {
      categoryExpenses[cat] = expenses
        .filter((exp) => {
          const expDate = parseISO(exp.date);
          return exp.category === cat && isWithinInterval(expDate, { start: monthStart, end: monthEnd });
        })
        .reduce((sum, exp) => sum + exp.amount, 0);
    });
    return categoryExpenses;
  }, [expenses]);

  const budgetStatuses = useMemo(() => {
    return budgets.map((budget) =>
      getBudgetStatus(budget.category, monthlyExpensesByCategory[budget.category] || 0)
    );
  }, [budgets, monthlyExpensesByCategory, getBudgetStatus]);

  const totalSpent = budgetStatuses.reduce((sum, b) => sum + b.spent, 0);
  const exceededBudgets = budgetStatuses.filter(b => b.status === 'exceeded' || b.status === 'danger');
  const totalSavingsTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSavingsCurrent = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);

  const isLoading = expensesLoading || incomesLoading || budgetLoading;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 rounded-xl" />
            <div className="h-80 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Panel Principal</h1>
          <p className="text-gray-500 mt-1">Vista general de tus finanzas</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton expenses={expenses} />
          <Link href="/add">
            <Button className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Agregar Gasto
            </Button>
          </Link>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-50">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ingresos del Mes</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(monthlyIncome)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-50">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gastos del Mes</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.monthlyExpenses)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-50">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Balance</p>
                <p className={`text-2xl font-bold ${monthlyIncome - summary.monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(monthlyIncome - summary.monthlyExpenses)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-50">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ahorros</p>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalSavingsCurrent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Alerts */}
      {exceededBudgets.length > 0 && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-red-800">Alertas de Presupuesto</h3>
                <p className="text-sm text-red-700 mt-1">
                  {exceededBudgets.length === 1
                    ? `La categoría "${exceededBudgets[0].category}" está cerca o ha excedido su límite.`
                    : `${exceededBudgets.length} categorías están cerca o han excedido su límite.`
                  }
                </p>
                <Link href="/planning" className="text-sm text-red-800 font-medium hover:underline mt-2 inline-block">
                  Ver detalles →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Presupuesto Usado</span>
            <span className="text-sm text-gray-500">{totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${totalSpent > totalBudgeted ? 'bg-red-500' : 'bg-indigo-500'}`}
              style={{ width: `${Math.min((totalSpent / totalBudgeted) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {formatCurrency(totalSpent)} de {formatCurrency(totalBudgeted)} presupuestado
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Meta de Ahorros</span>
            <span className="text-sm text-gray-500">{totalSavingsTarget > 0 ? Math.round((totalSavingsCurrent / totalSavingsTarget) * 100) : 0}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${Math.min((totalSavingsCurrent / totalSavingsTarget) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {formatCurrency(totalSavingsCurrent)} de {formatCurrency(totalSavingsTarget)} ahorrado
          </p>
        </Card>

        <Link href="/planning">
          <Card className="p-4 hover:border-indigo-300 transition-colors cursor-pointer h-full flex items-center">
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 rounded-lg bg-indigo-50">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Ver Planificación</p>
                <p className="text-sm text-gray-500">Gestiona presupuestos y ahorros</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Card>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SpendingChart data={summary.monthlyTrend} />
        <CategoryBreakdown data={summary.categoryBreakdown} />
      </div>

      {/* Recent Expenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Gastos Recientes</h3>
            <p className="text-sm text-gray-500">Tus últimas transacciones</p>
          </div>
          <Link href="/expenses">
            <Button variant="ghost" size="sm">
              Ver Todo
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentExpenses.length > 0 ? (
            <div className="space-y-2">
              {recentExpenses.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  onEdit={handleEditExpense}
                  onDelete={deleteExpense}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Sin gastos aún</h3>
              <p className="text-gray-500 mb-4">Comienza a registrar tus gastos hoy</p>
              <Link href="/add">
                <Button>Agregar tu Primer Gasto</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Editar Gasto"
      >
        {editingExpense && (
          <ExpenseForm
            initialData={{
              amount: editingExpense.amount.toString(),
              category: editingExpense.category,
              description: editingExpense.description,
              date: editingExpense.date,
            }}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingExpense(null)}
            isEditing
          />
        )}
      </Modal>
    </div>
  );
}
