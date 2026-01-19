'use client';

import React from 'react';
import { SavingsGoal } from '@/types/budget';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

interface SavingsCardProps {
  goal: SavingsGoal;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddFunds?: () => void;
}

export function SavingsCard({ goal, onEdit, onDelete, onAddFunds }: SavingsCardProps) {
  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const isComplete = goal.currentAmount >= goal.targetAmount;

  return (
    <div className={cn(
      'group p-4 rounded-xl border transition-all',
      isComplete ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-indigo-200'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
            isComplete ? 'bg-green-200' : 'bg-indigo-100'
          )}>
            {isComplete ? '🎉' : '🎯'}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{goal.name}</h3>
            {goal.deadline && (
              <span className="text-xs text-gray-500">
                Fecha límite: {formatDate(goal.deadline)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onAddFunds && !isComplete && (
            <button
              onClick={onAddFunds}
              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Agregar fondos"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          )}
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
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all rounded-full',
              isComplete ? 'bg-green-500' : 'bg-indigo-500'
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Amounts */}
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-600">
          Ahorrado: <span className={cn('font-medium', isComplete ? 'text-green-600' : 'text-gray-900')}>
            {formatCurrency(goal.currentAmount)}
          </span>
        </span>
        <span className="text-gray-600">
          Meta: <span className="font-medium text-gray-900">{formatCurrency(goal.targetAmount)}</span>
        </span>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between text-sm">
        <span className={cn('font-medium', isComplete ? 'text-green-600' : 'text-indigo-600')}>
          {percentage.toFixed(1)}% completado
        </span>
        {!isComplete && (
          <span className="text-gray-500">
            Faltan: {formatCurrency(remaining)}
          </span>
        )}
      </div>

      {isComplete && (
        <div className="mt-3 p-2 bg-green-100 rounded-lg flex items-center gap-2 text-green-800 text-xs">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>¡Meta alcanzada! Felicitaciones</span>
        </div>
      )}
    </div>
  );
}
