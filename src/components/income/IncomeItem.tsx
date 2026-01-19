'use client';

import React from 'react';
import { Income, INCOME_CATEGORY_COLORS, INCOME_CATEGORY_ICONS } from '@/types/income';
import { formatCurrency, formatDate } from '@/lib/utils';

interface IncomeItemProps {
  income: Income;
  onEdit: (income: Income) => void;
  onDelete: (id: string) => void;
}

export function IncomeItem({ income, onEdit, onDelete }: IncomeItemProps) {
  const categoryColor = INCOME_CATEGORY_COLORS[income.category];
  const categoryIcon = INCOME_CATEGORY_ICONS[income.category];

  return (
    <div className="group flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all duration-200">
      <div
        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl"
        style={{ backgroundColor: `${categoryColor}15` }}
      >
        {categoryIcon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900 truncate">{income.description}</p>
          {income.isRecurring && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
              Recurrente
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${categoryColor}15`,
              color: categoryColor,
            }}
          >
            {income.category}
          </span>
          <span className="text-sm text-gray-500">{formatDate(income.date)}</span>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold text-green-600">+{formatCurrency(income.amount)}</p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(income)}
          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Editar ingreso"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          onClick={() => onDelete(income.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Eliminar ingreso"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
