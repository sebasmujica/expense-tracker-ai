'use client';

import React, { useState, useMemo } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { useIncomes } from '@/context/IncomeContext';
import { useBudgets } from '@/context/BudgetContext';
import { PlanningTable } from '@/components/planning/PlanningTable';
import { BudgetCard } from '@/components/budget/BudgetCard';
import { BudgetForm } from '@/components/budget/BudgetForm';
import { SavingsCard } from '@/components/budget/SavingsCard';
import { SavingsForm } from '@/components/budget/SavingsForm';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import { CATEGORIES, Category } from '@/types/expense';
import { BudgetFormData, SavingsGoalFormData, SavingsGoal, Budget } from '@/types/budget';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export default function PlanningPage() {
  const { expenses } = useExpenses();
  const { getMonthlyIncome } = useIncomes();
  const {
    budgets,
    savingsGoals,
    isLoading,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetStatus,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addToSavings,
    getTotalBudgeted,
    getTotalSavings,
  } = useBudgets();

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editingSavings, setEditingSavings] = useState<SavingsGoal | null>(null);
  const [addFundsGoal, setAddFundsGoal] = useState<SavingsGoal | null>(null);
  const [fundsAmount, setFundsAmount] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'budget' | 'savings'; id: string } | null>(null);

  const monthlyIncome = getMonthlyIncome();
  const totalBudgeted = getTotalBudgeted();
  const totalSavings = getTotalSavings();

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

  const totalMonthlySpent = Object.values(monthlyExpensesByCategory).reduce((sum, val) => sum + val, 0);

  // Get budget statuses for all budgeted categories
  const budgetStatuses = useMemo(() => {
    return budgets.map((budget) =>
      getBudgetStatus(budget.category, monthlyExpensesByCategory[budget.category] || 0)
    );
  }, [budgets, monthlyExpensesByCategory, getBudgetStatus]);

  const existingBudgetCategories = budgets.map((b) => b.category);

  const handleAddBudget = (data: BudgetFormData) => {
    addBudget(data);
    setShowBudgetModal(false);
  };

  const handleEditBudget = (data: BudgetFormData) => {
    if (editingBudget) {
      updateBudget(editingBudget.id, data);
      setEditingBudget(null);
    }
  };

  const handleAddSavings = (data: SavingsGoalFormData) => {
    addSavingsGoal(data);
    setShowSavingsModal(false);
  };

  const handleEditSavings = (data: SavingsGoalFormData) => {
    if (editingSavings) {
      updateSavingsGoal(editingSavings.id, data);
      setEditingSavings(null);
    }
  };

  const handleAddFunds = () => {
    if (addFundsGoal && fundsAmount) {
      addToSavings(addFundsGoal.id, parseFloat(fundsAmount));
      setAddFundsGoal(null);
      setFundsAmount('');
    }
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      if (deleteConfirm.type === 'budget') {
        deleteBudget(deleteConfirm.id);
      } else {
        deleteSavingsGoal(deleteConfirm.id);
      }
      setDeleteConfirm(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Planificación</h1>
          <p className="text-gray-500 mt-1">Administra tu presupuesto y metas de ahorro</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-50">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ingresos del Mes</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(monthlyIncome)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-50">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Presupuestado</p>
                <p className="text-xl font-bold text-indigo-600">{formatCurrency(totalBudgeted)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-50">
                <span className="text-2xl">💸</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gastado</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(totalMonthlySpent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-50">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ahorros</p>
                <p className="text-xl font-bold text-amber-600">{formatCurrency(totalSavings)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planning Table */}
      <div className="mb-8">
        <PlanningTable
          totalIncome={monthlyIncome}
          totalBudgeted={totalBudgeted}
          totalSpent={totalMonthlySpent}
          totalSavings={totalSavings}
          budgetStatuses={budgetStatuses}
        />
      </div>

      {/* Budgets Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Presupuestos por Categoría</h2>
            <p className="text-sm text-gray-500">Define límites de gasto mensuales</p>
          </div>
          <Button onClick={() => setShowBudgetModal(true)} size="sm">
            Agregar Presupuesto
          </Button>
        </div>

        {budgetStatuses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetStatuses.map((status) => {
              const budget = budgets.find((b) => b.category === status.category);
              return (
                <BudgetCard
                  key={status.category}
                  status={status}
                  onEdit={() => budget && setEditingBudget(budget)}
                  onDelete={() => budget && setDeleteConfirm({ type: 'budget', id: budget.id })}
                />
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Sin presupuestos</h3>
              <p className="text-gray-500 mb-4">Crea presupuestos para controlar tus gastos</p>
              <Button onClick={() => setShowBudgetModal(true)}>Crear Primer Presupuesto</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Savings Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Metas de Ahorro</h2>
            <p className="text-sm text-gray-500">Establece y rastrea tus objetivos financieros</p>
          </div>
          <Button onClick={() => setShowSavingsModal(true)} size="sm">
            Nueva Meta
          </Button>
        </div>

        {savingsGoals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savingsGoals.map((goal) => (
              <SavingsCard
                key={goal.id}
                goal={goal}
                onEdit={() => setEditingSavings(goal)}
                onDelete={() => setDeleteConfirm({ type: 'savings', id: goal.id })}
                onAddFunds={() => setAddFundsGoal(goal)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Sin metas de ahorro</h3>
              <p className="text-gray-500 mb-4">Crea metas para motivar tu ahorro</p>
              <Button onClick={() => setShowSavingsModal(true)}>Crear Primera Meta</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Budget Modal */}
      <Modal isOpen={showBudgetModal} onClose={() => setShowBudgetModal(false)} title="Agregar Presupuesto">
        <BudgetForm
          onSubmit={handleAddBudget}
          onCancel={() => setShowBudgetModal(false)}
          existingCategories={existingBudgetCategories}
        />
      </Modal>

      {/* Edit Budget Modal */}
      <Modal isOpen={!!editingBudget} onClose={() => setEditingBudget(null)} title="Editar Presupuesto">
        {editingBudget && (
          <BudgetForm
            initialData={{
              category: editingBudget.category,
              amount: editingBudget.amount.toString(),
            }}
            onSubmit={handleEditBudget}
            onCancel={() => setEditingBudget(null)}
            isEditing
          />
        )}
      </Modal>

      {/* Add Savings Modal */}
      <Modal isOpen={showSavingsModal} onClose={() => setShowSavingsModal(false)} title="Nueva Meta de Ahorro">
        <SavingsForm onSubmit={handleAddSavings} onCancel={() => setShowSavingsModal(false)} />
      </Modal>

      {/* Edit Savings Modal */}
      <Modal isOpen={!!editingSavings} onClose={() => setEditingSavings(null)} title="Editar Meta de Ahorro">
        {editingSavings && (
          <SavingsForm
            initialData={{
              name: editingSavings.name,
              targetAmount: editingSavings.targetAmount.toString(),
              currentAmount: editingSavings.currentAmount.toString(),
              deadline: editingSavings.deadline,
            }}
            onSubmit={handleEditSavings}
            onCancel={() => setEditingSavings(null)}
            isEditing
          />
        )}
      </Modal>

      {/* Add Funds Modal */}
      <Modal isOpen={!!addFundsGoal} onClose={() => setAddFundsGoal(null)} title="Agregar Fondos">
        <div className="space-y-4">
          <p className="text-gray-600">
            Agregar fondos a: <span className="font-medium">{addFundsGoal?.name}</span>
          </p>
          <Input
            label="Monto (Gs.)"
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={fundsAmount}
            onChange={(e) => {
              if (e.target.value === '' || /^\d*$/.test(e.target.value)) {
                setFundsAmount(e.target.value);
              }
            }}
            icon={<span className="text-gray-500 font-medium">₲</span>}
          />
          <div className="flex gap-3">
            <Button onClick={handleAddFunds} disabled={!fundsAmount} className="flex-1">
              Agregar
            </Button>
            <Button variant="secondary" onClick={() => setAddFundsGoal(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmar Eliminación">
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas eliminar este {deleteConfirm?.type === 'budget' ? 'presupuesto' : 'meta de ahorro'}?
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
