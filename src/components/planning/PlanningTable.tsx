'use client';

import React from 'react';
import { formatCurrency, cn } from '@/lib/utils';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { BudgetStatus } from '@/types/budget';

interface PlanningTableProps {
  totalIncome: number;
  totalBudgeted: number;
  totalSpent: number;
  totalSavings: number;
  budgetStatuses: BudgetStatus[];
}

export function PlanningTable({
  totalIncome,
  totalBudgeted,
  totalSpent,
  totalSavings,
  budgetStatuses,
}: PlanningTableProps) {
  const availableToSpend = totalIncome - totalBudgeted - totalSavings;
  const remainingFromBudget = totalBudgeted - totalSpent;
  const actualSavings = totalIncome - totalSpent;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Resumen de Planificación</h3>
        <p className="text-sm text-gray-500">Vista general de tus finanzas del mes</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Section */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Concepto</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Planificado</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Actual</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Diferencia</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 bg-green-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💰</span>
                    <span className="font-medium text-gray-900">Ingresos</span>
                  </div>
                </td>
                <td className="text-right py-3 px-4 font-medium text-green-600">
                  {formatCurrency(totalIncome)}
                </td>
                <td className="text-right py-3 px-4 font-medium text-green-600">
                  {formatCurrency(totalIncome)}
                </td>
                <td className="text-right py-3 px-4 font-medium text-gray-500">-</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    <span className="font-medium text-gray-900">Presupuesto Total</span>
                  </div>
                </td>
                <td className="text-right py-3 px-4 font-medium text-gray-900">
                  {formatCurrency(totalBudgeted)}
                </td>
                <td className="text-right py-3 px-4 font-medium text-red-600">
                  {formatCurrency(totalSpent)}
                </td>
                <td className={cn(
                  'text-right py-3 px-4 font-medium',
                  remainingFromBudget >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {remainingFromBudget >= 0 ? '+' : ''}{formatCurrency(remainingFromBudget)}
                </td>
              </tr>
              <tr className="border-b border-gray-100 bg-indigo-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <span className="font-medium text-gray-900">Ahorros</span>
                  </div>
                </td>
                <td className="text-right py-3 px-4 font-medium text-indigo-600">
                  {formatCurrency(totalSavings)}
                </td>
                <td className="text-right py-3 px-4 font-medium text-indigo-600">
                  {formatCurrency(actualSavings > 0 ? actualSavings : 0)}
                </td>
                <td className={cn(
                  'text-right py-3 px-4 font-medium',
                  actualSavings >= totalSavings ? 'text-green-600' : 'text-yellow-600'
                )}>
                  {actualSavings >= totalSavings ? '✓' : `${formatCurrency(totalSavings - actualSavings)} pendiente`}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💳</span>
                    <span className="font-medium text-gray-900">Disponible</span>
                  </div>
                </td>
                <td className="text-right py-3 px-4 font-medium text-gray-900">
                  {formatCurrency(availableToSpend > 0 ? availableToSpend : 0)}
                </td>
                <td className="text-right py-3 px-4 font-medium text-gray-900">
                  {formatCurrency(totalIncome - totalSpent - totalSavings)}
                </td>
                <td className="text-right py-3 px-4 font-medium text-gray-500">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Budget Breakdown */}
        {budgetStatuses.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Desglose por Categoría</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-4 font-medium text-gray-600 text-sm">Categoría</th>
                    <th className="text-right py-2 px-4 font-medium text-gray-600 text-sm">Presupuesto</th>
                    <th className="text-right py-2 px-4 font-medium text-gray-600 text-sm">Gastado</th>
                    <th className="text-right py-2 px-4 font-medium text-gray-600 text-sm">Restante</th>
                    <th className="text-right py-2 px-4 font-medium text-gray-600 text-sm">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetStatuses.map((status) => (
                    <tr key={status.category} className="border-b border-gray-100">
                      <td className="py-2 px-4 text-sm">{status.category}</td>
                      <td className="text-right py-2 px-4 text-sm">{formatCurrency(status.budgeted)}</td>
                      <td className="text-right py-2 px-4 text-sm">{formatCurrency(status.spent)}</td>
                      <td className={cn(
                        'text-right py-2 px-4 text-sm font-medium',
                        status.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                      )}>
                        {formatCurrency(status.remaining)}
                      </td>
                      <td className="text-right py-2 px-4">
                        <span className={cn(
                          'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
                          status.status === 'safe' && 'bg-green-100 text-green-700',
                          status.status === 'warning' && 'bg-yellow-100 text-yellow-700',
                          status.status === 'danger' && 'bg-red-100 text-red-700',
                          status.status === 'exceeded' && 'bg-red-200 text-red-800'
                        )}>
                          {status.status === 'safe' && 'OK'}
                          {status.status === 'warning' && '75%'}
                          {status.status === 'danger' && '90%'}
                          {status.status === 'exceeded' && 'Excedido'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Financial Health Indicator */}
        <div className="p-4 rounded-lg bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-2">Estado Financiero</h4>
          <div className="flex items-center gap-3">
            {actualSavings > 0 && totalSpent <= totalBudgeted ? (
              <>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-green-600">¡Excelente!</p>
                  <p className="text-sm text-gray-600">Estás dentro de tu presupuesto y generando ahorros</p>
                </div>
              </>
            ) : totalSpent > totalBudgeted ? (
              <>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-red-600">¡Atención!</p>
                  <p className="text-sm text-gray-600">Has excedido tu presupuesto planificado</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-yellow-600">En progreso</p>
                  <p className="text-sm text-gray-600">Sigue controlando tus gastos para alcanzar tus metas</p>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
