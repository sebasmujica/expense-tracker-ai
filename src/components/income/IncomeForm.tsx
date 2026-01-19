'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { IncomeFormData, IncomeCategory, INCOME_CATEGORIES, INCOME_CATEGORY_ICONS } from '@/types/income';
import { getTodayString } from '@/lib/utils';

interface IncomeFormProps {
  initialData?: IncomeFormData;
  onSubmit: (data: IncomeFormData) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

interface FormErrors {
  amount?: string;
  description?: string;
  date?: string;
}

export function IncomeForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: IncomeFormProps) {
  const [formData, setFormData] = useState<IncomeFormData>({
    amount: initialData?.amount || '',
    category: initialData?.category || 'Salary',
    description: initialData?.description || '',
    date: initialData?.date || getTodayString(),
    isRecurring: initialData?.isRecurring || false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.amount) {
      newErrors.amount = 'El monto es requerido';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'El monto debe ser un número positivo';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onSubmit(formData);
    setIsSubmitting(false);

    if (!isEditing) {
      setFormData({
        amount: '',
        category: 'Salary',
        description: '',
        date: getTodayString(),
        isRecurring: false,
      });
      setErrors({});
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*$/.test(value)) {
      setFormData({ ...formData, amount: value });
      if (errors.amount) {
        setErrors({ ...errors, amount: undefined });
      }
    }
  };

  const categoryOptions = INCOME_CATEGORIES.map((cat) => ({
    value: cat,
    label: `${INCOME_CATEGORY_ICONS[cat]} ${cat}`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Monto (Gs.)"
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={formData.amount}
          onChange={handleAmountChange}
          error={errors.amount}
          icon={<span className="text-gray-500 font-medium">₲</span>}
        />

        <Input
          label="Fecha"
          type="date"
          value={formData.date}
          onChange={(e) => {
            setFormData({ ...formData, date: e.target.value });
            if (errors.date) {
              setErrors({ ...errors, date: undefined });
            }
          }}
          error={errors.date}
        />
      </div>

      <Select
        label="Categoría"
        value={formData.category}
        onChange={(e) =>
          setFormData({ ...formData, category: e.target.value as IncomeCategory })
        }
        options={categoryOptions}
      />

      <Input
        label="Descripción"
        type="text"
        placeholder="¿De dónde proviene este ingreso?"
        value={formData.description}
        onChange={(e) => {
          setFormData({ ...formData, description: e.target.value });
          if (errors.description) {
            setErrors({ ...errors, description: undefined });
          }
        }}
        error={errors.description}
        maxLength={200}
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.isRecurring}
          onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-sm text-gray-700">Ingreso recurrente (mensual)</span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting} className="flex-1">
          {isEditing ? 'Actualizar Ingreso' : 'Agregar Ingreso'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
