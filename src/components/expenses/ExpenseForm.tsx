'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ExpenseFormData, Category, CATEGORIES, CATEGORY_ICONS } from '@/types/expense';
import { getTodayString } from '@/lib/utils';

interface ExpenseFormProps {
  initialData?: ExpenseFormData;
  onSubmit: (data: ExpenseFormData) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

interface FormErrors {
  amount?: string;
  description?: string;
  date?: string;
  category?: string;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: initialData?.amount || '',
    category: initialData?.category || 'Food',
    description: initialData?.description || '',
    date: initialData?.date || getTodayString(),
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

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      } else if (amount > 1000000) {
        newErrors.amount = 'Amount cannot exceed $1,000,000';
      }
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
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

    // Simulate a brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    onSubmit(formData);
    setIsSubmitting(false);

    // Reset form if not editing
    if (!isEditing) {
      setFormData({
        amount: '',
        category: 'Food',
        description: '',
        date: getTodayString(),
      });
      setErrors({});
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only valid decimal numbers
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setFormData({ ...formData, amount: value });
      if (errors.amount) {
        setErrors({ ...errors, amount: undefined });
      }
    }
  };

  const categoryOptions = CATEGORIES.map((cat) => ({
    value: cat,
    label: `${CATEGORY_ICONS[cat]} ${cat}`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Amount"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={formData.amount}
          onChange={handleAmountChange}
          error={errors.amount}
          icon={
            <span className="text-gray-500 font-medium">$</span>
          }
        />

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => {
            setFormData({ ...formData, date: e.target.value });
            if (errors.date) {
              setErrors({ ...errors, date: undefined });
            }
          }}
          error={errors.date}
          max={getTodayString()}
        />
      </div>

      <Select
        label="Category"
        value={formData.category}
        onChange={(e) =>
          setFormData({ ...formData, category: e.target.value as Category })
        }
        options={categoryOptions}
        error={errors.category}
      />

      <Input
        label="Description"
        type="text"
        placeholder="What was this expense for?"
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

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting} className="flex-1">
          {isEditing ? 'Update Expense' : 'Add Expense'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
