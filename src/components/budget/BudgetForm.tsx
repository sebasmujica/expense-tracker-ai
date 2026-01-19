'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { BudgetFormData } from '@/types/budget';
import { Category, CATEGORIES, CATEGORY_ICONS } from '@/types/expense';

interface BudgetFormProps {
  initialData?: BudgetFormData;
  onSubmit: (data: BudgetFormData) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  existingCategories?: Category[];
}

interface FormErrors {
  amount?: string;
  category?: string;
}

export function BudgetForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
  existingCategories = [],
}: BudgetFormProps) {
  const [formData, setFormData] = useState<BudgetFormData>({
    category: initialData?.category || 'Food',
    amount: initialData?.amount || '',
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

    if (!isEditing && existingCategories.includes(formData.category)) {
      newErrors.category = 'Ya existe un presupuesto para esta categoría';
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
        category: 'Food',
        amount: '',
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

  const availableCategories = isEditing
    ? CATEGORIES
    : CATEGORIES.filter((cat) => !existingCategories.includes(cat));

  const categoryOptions = availableCategories.map((cat) => ({
    value: cat,
    label: `${CATEGORY_ICONS[cat]} ${cat}`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Categoría"
        value={formData.category}
        onChange={(e) => {
          setFormData({ ...formData, category: e.target.value as Category });
          if (errors.category) {
            setErrors({ ...errors, category: undefined });
          }
        }}
        options={categoryOptions}
        error={errors.category}
        disabled={isEditing}
      />

      <Input
        label="Monto Mensual (Gs.)"
        type="text"
        inputMode="numeric"
        placeholder="0"
        value={formData.amount}
        onChange={handleAmountChange}
        error={errors.amount}
        icon={<span className="text-gray-500 font-medium">₲</span>}
      />

      <p className="text-sm text-gray-500">
        Este es el monto máximo que planeas gastar en esta categoría cada mes.
      </p>

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting} className="flex-1">
          {isEditing ? 'Actualizar Presupuesto' : 'Agregar Presupuesto'}
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
