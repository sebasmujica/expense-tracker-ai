'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SavingsGoalFormData } from '@/types/budget';

interface SavingsFormProps {
  initialData?: SavingsGoalFormData;
  onSubmit: (data: SavingsGoalFormData) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

interface FormErrors {
  name?: string;
  targetAmount?: string;
  currentAmount?: string;
}

export function SavingsForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: SavingsFormProps) {
  const [formData, setFormData] = useState<SavingsGoalFormData>({
    name: initialData?.name || '',
    targetAmount: initialData?.targetAmount || '',
    currentAmount: initialData?.currentAmount || '0',
    deadline: initialData?.deadline || '',
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

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.targetAmount) {
      newErrors.targetAmount = 'El monto objetivo es requerido';
    } else {
      const amount = parseFloat(formData.targetAmount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.targetAmount = 'El monto debe ser un número positivo';
      }
    }

    if (formData.currentAmount) {
      const current = parseFloat(formData.currentAmount);
      if (isNaN(current) || current < 0) {
        newErrors.currentAmount = 'El monto actual debe ser un número positivo';
      }
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
        name: '',
        targetAmount: '',
        currentAmount: '0',
        deadline: '',
      });
      setErrors({});
    }
  };

  const handleAmountChange = (field: 'targetAmount' | 'currentAmount') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*$/.test(value)) {
      setFormData({ ...formData, [field]: value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre de la Meta"
        type="text"
        placeholder="Ej: Vacaciones, Fondo de emergencia"
        value={formData.name}
        onChange={(e) => {
          setFormData({ ...formData, name: e.target.value });
          if (errors.name) {
            setErrors({ ...errors, name: undefined });
          }
        }}
        error={errors.name}
        maxLength={100}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Monto Objetivo (Gs.)"
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={formData.targetAmount}
          onChange={handleAmountChange('targetAmount')}
          error={errors.targetAmount}
          icon={<span className="text-gray-500 font-medium">₲</span>}
        />

        <Input
          label="Monto Actual (Gs.)"
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={formData.currentAmount}
          onChange={handleAmountChange('currentAmount')}
          error={errors.currentAmount}
          icon={<span className="text-gray-500 font-medium">₲</span>}
        />
      </div>

      <Input
        label="Fecha Límite (Opcional)"
        type="date"
        value={formData.deadline || ''}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting} className="flex-1">
          {isEditing ? 'Actualizar Meta' : 'Crear Meta de Ahorro'}
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
