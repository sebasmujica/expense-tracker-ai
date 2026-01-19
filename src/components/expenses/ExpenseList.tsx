'use client';

import React, { useState, useMemo } from 'react';
import { Expense, ExpenseFilters, CATEGORIES, Category, ExpenseFormData, CATEGORY_ICONS } from '@/types/expense';
import { filterExpenses, formatCurrency, getMonthStart, getMonthEnd, getTodayString } from '@/lib/utils';
import { ExpenseItem } from './ExpenseItem';
import { ExpenseForm } from './ExpenseForm';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Card, CardContent } from '@/components/ui/Card';
import { useExpenses } from '@/context/ExpenseContext';

export function ExpenseList() {
  const { expenses, updateExpense, deleteExpense } = useExpenses();
  const [filters, setFilters] = useState<ExpenseFilters>({
    search: '',
    category: 'All',
    startDate: '',
    endDate: '',
  });
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredExpenses = useMemo(() => {
    const sorted = [...expenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return filterExpenses(sorted, filters);
  }, [expenses, filters]);

  const totalFiltered = useMemo(
    () => filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    [filteredExpenses]
  );

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleEditSubmit = (data: ExpenseFormData) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
      setEditingExpense(null);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteExpense(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      startDate: '',
      endDate: '',
    });
  };

  const setThisMonth = () => {
    setFilters({
      ...filters,
      startDate: getMonthStart(),
      endDate: getMonthEnd(),
    });
  };

  const hasActiveFilters =
    filters.search || filters.category !== 'All' || filters.startDate || filters.endDate;

  const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    ...CATEGORIES.map((cat) => ({
      value: cat,
      label: `${CATEGORY_ICONS[cat]} ${cat}`,
    })),
  ];

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search expenses..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
          </div>
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-indigo-400 rounded-full" />
            )}
          </Button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <Card>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Category"
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value as Category | 'All' })
                  }
                  options={categoryOptions}
                />
                <Input
                  label="Start Date"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  max={filters.endDate || getTodayString()}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  min={filters.startDate}
                  max={getTodayString()}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" onClick={setThisMonth}>
                  This Month
                </Button>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} found
        </span>
        <span className="font-medium">
          Total: {formatCurrency(totalFiltered)}
        </span>
      </div>

      {/* Expense List */}
      {filteredExpenses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No expenses found</h3>
            <p className="text-gray-500">
              {hasActiveFilters
                ? 'Try adjusting your filters or search terms'
                : 'Add your first expense to get started'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Expense"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this expense? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
