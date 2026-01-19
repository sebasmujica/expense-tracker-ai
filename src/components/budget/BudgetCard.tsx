'use client';

import React from 'react';
import { BudgetStatus } from '@/types/budget';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/types/expense';
import { formatCurrency, cn } from '@/lib/utils';

interface BudgetCardProps {
  status: BudgetStatus;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function BudgetCard({ status, onEdit, onDelete }: BudgetCardProps) {
  const categoryColor = CATEGORY_COLORS[status.category];
  const categoryIcon = CATEGORY_ICONS[status.category];

  const getStatusColor = () => {
    switch (status.status) {
      case 'exceeded':
        return 'bg-red-500';
      case 'danger':
        return 'bg-red-400';
      case 'warning':
        return 'bg-yellow-400';
      default:
        return 'bg-green-500';
    }
  };

  const getStatusBg = () => {
    switch (status.status) {
      case 'exceeded':
        return 'bg-red-50 border-red-200';
      case 'danger':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'exceeded':
        return 'Excedido';
      case 'danger':
        return 'Casi al límite';
      case 'warning':
        return 'Precaución';
      default:
        return 'En control';
    }
  };

  const getStatusTextColor = () => {
    switch (status.status) {
      case 'exceeded':
      case 'danger':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  return (
    <div className={cn('group p-4 rounded-xl border transition-all', getStatusBg())}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            {categoryIcon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{status.category}</h3>
            <span className={cn('text-xs font-medium', getStatusTextColor())}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all rounded-full', getStatusColor())}
            style={{ width: `${Math.min(status.percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Amounts */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          Gastado: <span className="font-medium text-gray-900">{formatCurrency(status.spent)}</span>
        </span>
        <span className="text-gray-600">
          de <span className="font-medium text-gray-900">{formatCurrency(status.budgeted)}</span>
        </span>
      </div>

      {/* Remaining or Exceeded */}
      <div className="mt-2 text-sm">
        {status.remaining >= 0 ? (
          <span className="text-green-600">
            Disponible: <span className="font-medium">{formatCurrency(status.remaining)}</span>
          </span>
        ) : (
          <span className="text-red-600">
            Excedido por: <span className="font-medium">{formatCurrency(Math.abs(status.remaining))}</span>
          </span>
        )}
      </div>

      {/* Warning Messages */}
      {status.status === 'warning' && (
        <div className="mt-3 p-2 bg-yellow-100 rounded-lg flex items-center gap-2 text-yellow-800 text-xs">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Has usado el 75% de tu presupuesto</span>
        </div>
      )}

      {status.status === 'danger' && (
        <div className="mt-3 p-2 bg-red-100 rounded-lg flex items-center gap-2 text-red-800 text-xs">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>¡Cuidado! Estás cerca de tu límite</span>
        </div>
      )}

      {status.status === 'exceeded' && (
        <div className="mt-3 p-2 bg-red-100 rounded-lg flex items-center gap-2 text-red-800 text-xs">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>¡Has excedido tu presupuesto!</span>
        </div>
      )}
    </div>
  );
}
