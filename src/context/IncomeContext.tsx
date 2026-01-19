'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Income, IncomeFormData, IncomeCategory } from '@/types/income';

const STORAGE_KEY = 'expense-tracker-income';

interface IncomeContextType {
  incomes: Income[];
  isLoading: boolean;
  addIncome: (data: IncomeFormData) => void;
  updateIncome: (id: string, data: IncomeFormData) => void;
  deleteIncome: (id: string) => void;
  getIncomeById: (id: string) => Income | undefined;
  getMonthlyIncome: () => number;
  getTotalIncome: () => number;
}

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export function IncomeProvider({ children }: { children: React.ReactNode }) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setIncomes(parsed);
      }
    } catch (error) {
      console.error('Failed to load incomes from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(incomes));
      } catch (error) {
        console.error('Failed to save incomes to localStorage:', error);
      }
    }
  }, [incomes, isLoading]);

  const addIncome = useCallback((data: IncomeFormData) => {
    const now = new Date().toISOString();
    const newIncome: Income = {
      id: uuidv4(),
      amount: parseFloat(data.amount),
      category: data.category as IncomeCategory,
      description: data.description,
      date: data.date,
      isRecurring: data.isRecurring,
      createdAt: now,
      updatedAt: now,
    };
    setIncomes((prev) => [newIncome, ...prev]);
  }, []);

  const updateIncome = useCallback((id: string, data: IncomeFormData) => {
    setIncomes((prev) =>
      prev.map((income) =>
        income.id === id
          ? {
              ...income,
              amount: parseFloat(data.amount),
              category: data.category as IncomeCategory,
              description: data.description,
              date: data.date,
              isRecurring: data.isRecurring,
              updatedAt: new Date().toISOString(),
            }
          : income
      )
    );
  }, []);

  const deleteIncome = useCallback((id: string) => {
    setIncomes((prev) => prev.filter((income) => income.id !== id));
  }, []);

  const getIncomeById = useCallback(
    (id: string) => {
      return incomes.find((income) => income.id === id);
    },
    [incomes]
  );

  const getMonthlyIncome = useCallback(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return incomes
      .filter((income) => {
        const incomeDate = new Date(income.date);
        return incomeDate >= monthStart && incomeDate <= monthEnd;
      })
      .reduce((sum, income) => sum + income.amount, 0);
  }, [incomes]);

  const getTotalIncome = useCallback(() => {
    return incomes.reduce((sum, income) => sum + income.amount, 0);
  }, [incomes]);

  return (
    <IncomeContext.Provider
      value={{
        incomes,
        isLoading,
        addIncome,
        updateIncome,
        deleteIncome,
        getIncomeById,
        getMonthlyIncome,
        getTotalIncome,
      }}
    >
      {children}
    </IncomeContext.Provider>
  );
}

export function useIncomes() {
  const context = useContext(IncomeContext);
  if (context === undefined) {
    throw new Error('useIncomes must be used within an IncomeProvider');
  }
  return context;
}
