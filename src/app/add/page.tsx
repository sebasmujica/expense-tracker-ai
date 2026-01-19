'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useExpenses } from '@/context/ExpenseContext';
import { ExpenseFormData } from '@/types/expense';

export default function AddExpensePage() {
  const router = useRouter();
  const { addExpense } = useExpenses();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (data: ExpenseFormData) => {
    addExpense(data);
    setShowSuccess(true);

    // Hide success message after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Expense</h1>
        <p className="text-gray-500 mt-1">Record a new expense</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-green-800">Expense added successfully!</p>
            <p className="text-sm text-green-600">Your expense has been recorded.</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Expense Details</h2>
          <p className="text-sm text-gray-500">Fill in the information below</p>
        </CardHeader>
        <CardContent>
          <ExpenseForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
        <h3 className="text-sm font-medium text-indigo-800 mb-2">Quick Tips</h3>
        <ul className="text-sm text-indigo-600 space-y-1">
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Use descriptive names for easier tracking
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Choose the right category for better insights
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Record expenses promptly to stay organized
          </li>
        </ul>
      </div>
    </div>
  );
}
