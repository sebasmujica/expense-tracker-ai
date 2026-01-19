'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Budget, BudgetFormData, BudgetStatus, SavingsGoal, SavingsGoalFormData } from '@/types/budget';
import { Category } from '@/types/expense';

const BUDGET_STORAGE_KEY = 'expense-tracker-budgets';
const SAVINGS_STORAGE_KEY = 'expense-tracker-savings';

interface BudgetContextType {
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  isLoading: boolean;
  addBudget: (data: BudgetFormData) => void;
  updateBudget: (id: string, data: BudgetFormData) => void;
  deleteBudget: (id: string) => void;
  getBudgetByCategory: (category: Category) => Budget | undefined;
  getBudgetStatus: (category: Category, spent: number) => BudgetStatus;
  addSavingsGoal: (data: SavingsGoalFormData) => void;
  updateSavingsGoal: (id: string, data: SavingsGoalFormData) => void;
  deleteSavingsGoal: (id: string) => void;
  addToSavings: (id: string, amount: number) => void;
  getTotalBudgeted: () => number;
  getTotalSavings: () => number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedBudgets = localStorage.getItem(BUDGET_STORAGE_KEY);
      const storedSavings = localStorage.getItem(SAVINGS_STORAGE_KEY);
      if (storedBudgets) {
        setBudgets(JSON.parse(storedBudgets));
      }
      if (storedSavings) {
        setSavingsGoals(JSON.parse(storedSavings));
      }
    } catch (error) {
      console.error('Failed to load budgets from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets));
        localStorage.setItem(SAVINGS_STORAGE_KEY, JSON.stringify(savingsGoals));
      } catch (error) {
        console.error('Failed to save budgets to localStorage:', error);
      }
    }
  }, [budgets, savingsGoals, isLoading]);

  const addBudget = useCallback((data: BudgetFormData) => {
    const now = new Date().toISOString();
    const newBudget: Budget = {
      id: uuidv4(),
      category: data.category,
      amount: parseFloat(data.amount),
      createdAt: now,
      updatedAt: now,
    };
    setBudgets((prev) => {
      // Replace if category exists, otherwise add
      const existingIndex = prev.findIndex((b) => b.category === data.category);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newBudget;
        return updated;
      }
      return [...prev, newBudget];
    });
  }, []);

  const updateBudget = useCallback((id: string, data: BudgetFormData) => {
    setBudgets((prev) =>
      prev.map((budget) =>
        budget.id === id
          ? {
              ...budget,
              category: data.category,
              amount: parseFloat(data.amount),
              updatedAt: new Date().toISOString(),
            }
          : budget
      )
    );
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setBudgets((prev) => prev.filter((budget) => budget.id !== id));
  }, []);

  const getBudgetByCategory = useCallback(
    (category: Category) => {
      return budgets.find((budget) => budget.category === category);
    },
    [budgets]
  );

  const getBudgetStatus = useCallback(
    (category: Category, spent: number): BudgetStatus => {
      const budget = budgets.find((b) => b.category === category);
      const budgeted = budget?.amount || 0;
      const remaining = budgeted - spent;
      const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;

      let status: BudgetStatus['status'] = 'safe';
      if (percentage >= 100) {
        status = 'exceeded';
      } else if (percentage >= 90) {
        status = 'danger';
      } else if (percentage >= 75) {
        status = 'warning';
      }

      return {
        category,
        budgeted,
        spent,
        remaining,
        percentage,
        status,
      };
    },
    [budgets]
  );

  const addSavingsGoal = useCallback((data: SavingsGoalFormData) => {
    const now = new Date().toISOString();
    const newGoal: SavingsGoal = {
      id: uuidv4(),
      name: data.name,
      targetAmount: parseFloat(data.targetAmount),
      currentAmount: parseFloat(data.currentAmount) || 0,
      deadline: data.deadline,
      createdAt: now,
      updatedAt: now,
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
  }, []);

  const updateSavingsGoal = useCallback((id: string, data: SavingsGoalFormData) => {
    setSavingsGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              name: data.name,
              targetAmount: parseFloat(data.targetAmount),
              currentAmount: parseFloat(data.currentAmount) || 0,
              deadline: data.deadline,
              updatedAt: new Date().toISOString(),
            }
          : goal
      )
    );
  }, []);

  const deleteSavingsGoal = useCallback((id: string) => {
    setSavingsGoals((prev) => prev.filter((goal) => goal.id !== id));
  }, []);

  const addToSavings = useCallback((id: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              currentAmount: goal.currentAmount + amount,
              updatedAt: new Date().toISOString(),
            }
          : goal
      )
    );
  }, []);

  const getTotalBudgeted = useCallback(() => {
    return budgets.reduce((sum, budget) => sum + budget.amount, 0);
  }, [budgets]);

  const getTotalSavings = useCallback(() => {
    return savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  }, [savingsGoals]);

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        savingsGoals,
        isLoading,
        addBudget,
        updateBudget,
        deleteBudget,
        getBudgetByCategory,
        getBudgetStatus,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        addToSavings,
        getTotalBudgeted,
        getTotalSavings,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudgets() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
}
