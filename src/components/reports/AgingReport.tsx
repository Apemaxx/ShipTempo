import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, Loader2, PieChart, Search } from "lucide-react";
import React, { useState } from "react";

interface AgingReportProps {
  className?: string;
}

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  customer: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: "paid" | "pending" | "overdue";
  daysOverdue: number;
}

const mockInvoiceData: InvoiceData[] = [
  {
    id: "1",
    invoiceNumber: "INV-2023-001",
    customer: "Acme Corporation",
    amount: 2500.0,
    dueDate: "2023-06-15",
    issueDate: "2023-05-15",
    status: "paid",
    daysOverdue: 0,
  },
  {
    id: "2",
    invoiceNumber: "INV-2023-002",
    customer: "Globex Shipping",
    amount: 3750.5,
    dueDate: "2023-06-30",
    issueDate: "2023-06-01",
    status: "pending",
    daysOverdue: 0,
  },
  {
    id: "3",
    invoiceNumber: "INV-2023-003",
    customer: "Oceanic Freight Ltd",
    amount: 1890.25,
    dueDate: "2023-05-30",
    issueDate: "2023-05-01",
    status: "overdue",
    daysOverdue: 15,
  },
  {
    id: "4",
    invoiceNumber: "INV-2023-004",
    customer: "TransGlobal Logistics",
    amount: 4200.75,
    dueDate: "2023-06-10",
    issueDate: "2023-05-10",
    status: "paid",
    daysOverdue: 0,
  },
  {
    id: "5",
    invoiceNumber: "INV-2023-005",
    customer: "Pacific Shipping Co",
    amount: 3100.0,
    dueDate: "2023-07-15",
    issueDate: "2023-06-15",
    status: "pending",
    daysOverdue: 0,
  },
  {
    id: "6",
    invoiceNumber: "INV-2023-006",
    customer: "Atlas Freight Services",
    amount: 2750.5,
    dueDate: "2023-05-20",
    issueDate: "2023-04-20",
    status: "overdue",
    daysOverdue: 25,
  },
  {
    id: "7",
    invoiceNumber: "INV-2023-007",
    customer: "Maritime Solutions Inc",
    amount: 1950.25,
    dueDate: "2023-05-15",
    issueDate: "2023-04-15",
    status: "overdue",
    daysOverdue: 30,
  },
  {
    id: "8",
    invoiceNumber: "INV-2023-008",
    customer: "Global Transit LLC",
    amount: 3450.75,
    dueDate: "2023-05-05",
    issueDate: "2023-04-05",
    status: "overdue",
    daysOverdue: 40,
  },
  {
    id: "9",
    invoiceNumber: "INV-2023-009",
    customer: "Horizon Shipping Group",
    amount: 2900.0,
    dueDate: "2023-04-30",
    issueDate: "2023-03-30",
    status: "overdue",
    daysOverdue: 45,
  },
  {
    id: "10",
    invoiceNumber: "INV-2023-010",
    customer: "Seaborne Logistics",
    amount: 4100.5,
    dueDate: "2023-04-15",
    issueDate: "2023-03-15",
    status: "overdue",
    daysOverdue: 60,
  },
];

const AgingReport = ({ className = "" }: AgingReportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [agingFilter, setAgingFilter] = useState<string>("all");

  // Filter invoices based on search term, status, and aging period
  const filteredInvoiceData = mockInvoiceData.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;

    let matchesAging = true;
    if (agingFilter === "current") {
      matchesAging = invoice.daysOverdue === 0;
    } else if (agingFilter === "1-30") {
      matchesAging = invoice.daysOverdue > 0 && invoice.daysOverdue <= 30;
    } else if (agingFilter === "31-60") {
      matchesAging = invoice.daysOverdue > 30 && invoice.daysOverdue <= 60;
    } else if (agingFilter === "61-90") {
      matchesAging = invoice.daysOverdue > 60 && invoice.daysOverdue <= 90;
    } else if (agingFilter === "90+") {
      matchesAging = invoice.daysOverdue > 90;
    }

    return matchesSearch && matchesStatus && matchesAging;
  });

  return (
    <div className={`aging-report ${className}`}>
      <h1>Aging Report</h1>
      {/* Aquí puedes agregar más contenido para renderizar la tabla y los filtros */}
      <p>Filtrar y mostrar datos de facturas aquí.</p>
    </div>
  );
};

export default AgingReport;