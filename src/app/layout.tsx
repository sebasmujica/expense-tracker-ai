import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ExpenseProvider } from "@/context/ExpenseContext";
import { IncomeProvider } from "@/context/IncomeContext";
import { BudgetProvider } from "@/context/BudgetContext";
import { Header } from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ExpenseTracker - Administra tus Finanzas",
  description: "Una aplicación moderna para el seguimiento de gastos y administración de finanzas personales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <ExpenseProvider>
          <IncomeProvider>
            <BudgetProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">{children}</main>
              </div>
            </BudgetProvider>
          </IncomeProvider>
        </ExpenseProvider>
      </body>
    </html>
  );
}
