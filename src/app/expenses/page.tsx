'use client';

import React from 'react';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { useExpenses } from '@/context/ExpenseContext';
import { ExportButton } from '@/components/dashboard/ExportButton';

export default function ExpensesPage() {
  const { expenses, isLoading } = useExpenses();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500 mt-1">View and manage all your expenses</p>
        </div>
        <ExportButton expenses={expenses} />
      </div>

      {/* Expense List */}
      <ExpenseList />
    </div>
  );
}
