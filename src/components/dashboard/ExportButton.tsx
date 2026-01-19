'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Expense } from '@/types/expense';
import { exportToCSV, downloadCSV } from '@/lib/utils';
import { format } from 'date-fns';

interface ExportButtonProps {
  expenses: Expense[];
}

export function ExportButton({ expenses }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (expenses.length === 0) {
      return;
    }

    setIsExporting(true);

    // Small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    const csv = exportToCSV(expenses);
    const filename = `expenses_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    downloadCSV(csv, filename);

    setIsExporting(false);
  };

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      disabled={expenses.length === 0}
      isLoading={isExporting}
      className="flex items-center gap-2"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Export CSV
    </Button>
  );
}
