'use client';

import React, { useState, useMemo } from 'react';
import { Income, IncomeFormData, INCOME_CATEGORIES, IncomeCategory, INCOME_CATEGORY_ICONS } from '@/types/income';
import { formatCurrency } from '@/lib/utils';
import { IncomeItem } from './IncomeItem';
import { IncomeForm } from './IncomeForm';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Card, CardContent } from '@/components/ui/Card';
import { useIncomes } from '@/context/IncomeContext';

export function IncomeList() {
  const { incomes, updateIncome, deleteIncome } = useIncomes();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<IncomeCategory | 'All'>('All');
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredIncomes = useMemo(() => {
    return incomes
      .filter((income) => {
        if (search) {
          const searchLower = search.toLowerCase();
          const matchesSearch =
            income.description.toLowerCase().includes(searchLower) ||
            income.category.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }
        if (categoryFilter !== 'All' && income.category !== categoryFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [incomes, search, categoryFilter]);

  const totalFiltered = useMemo(
    () => filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0),
    [filteredIncomes]
  );

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
  };

  const handleEditSubmit = (data: IncomeFormData) => {
    if (editingIncome) {
      updateIncome(editingIncome.id, data);
      setEditingIncome(null);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteIncome(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const categoryOptions = [
    { value: 'All', label: 'Todas las Categorías' },
    ...INCOME_CATEGORIES.map((cat) => ({
      value: cat,
      label: `${INCOME_CATEGORY_ICONS[cat]} ${cat}`,
    })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar ingresos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as IncomeCategory | 'All')}
          options={categoryOptions}
          className="sm:w-48"
        />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {filteredIncomes.length} ingreso{filteredIncomes.length !== 1 ? 's' : ''} encontrado{filteredIncomes.length !== 1 ? 's' : ''}
        </span>
        <span className="font-medium text-green-600">
          Total: {formatCurrency(totalFiltered)}
        </span>
      </div>

      {filteredIncomes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No hay ingresos</h3>
            <p className="text-gray-500">Agrega tu primer ingreso para comenzar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredIncomes.map((income) => (
            <IncomeItem
              key={income.id}
              income={income}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={!!editingIncome}
        onClose={() => setEditingIncome(null)}
        title="Editar Ingreso"
      >
        {editingIncome && (
          <IncomeForm
            initialData={{
              amount: editingIncome.amount.toString(),
              category: editingIncome.category,
              description: editingIncome.description,
              date: editingIncome.date,
              isRecurring: editingIncome.isRecurring,
            }}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingIncome(null)}
            isEditing
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Eliminar Ingreso"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas eliminar este ingreso? Esta acción no se puede deshacer.
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
