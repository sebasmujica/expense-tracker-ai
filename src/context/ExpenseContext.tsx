'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, ExpenseFormData, Category } from '@/types/expense';

const STORAGE_KEY = 'expense-tracker-data';

interface ExpenseContextType {
  expenses: Expense[];
  isLoading: boolean;
  addExpense: (data: ExpenseFormData) => void;
  updateExpense: (id: string, data: ExpenseFormData) => void;
  deleteExpense: (id: string) => void;
  getExpenseById: (id: string) => Expense | undefined;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setExpenses(parsed);
      }
    } catch (error) {
      console.error('Failed to load expenses from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
      } catch (error) {
        console.error('Failed to save expenses to localStorage:', error);
      }
    }
  }, [expenses, isLoading]);

  const addExpense = useCallback((data: ExpenseFormData) => {
    const now = new Date().toISOString();
    const newExpense: Expense = {
      id: uuidv4(),
      amount: parseFloat(data.amount),
      category: data.category as Category,
      description: data.description,
      date: data.date,
      createdAt: now,
      updatedAt: now,
    };
    setExpenses((prev) => [newExpense, ...prev]);
  }, []);

  const updateExpense = useCallback((id: string, data: ExpenseFormData) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              amount: parseFloat(data.amount),
              category: data.category as Category,
              description: data.description,
              date: data.date,
              updatedAt: new Date().toISOString(),
            }
          : expense
      )
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, []);

  const getExpenseById = useCallback(
    (id: string) => {
      return expenses.find((expense) => expense.id === id);
    },
    [expenses]
  );

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        isLoading,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpenseById,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
