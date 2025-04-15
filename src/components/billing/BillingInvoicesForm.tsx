import { useState, useRef } from "react";
import { format } from "date-fns";
import {
  Search,
  PlusCircle,
  FileText,
  Download,
  CalendarIcon,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import InvoiceTemplate from "./InvoiceTemplate";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  shipmentId: string;
  issueDate: string;
  dueDate: string;
  status: string;
  amount: number;
  items: InvoiceItem[];
  notes?: string;
}

interface BillingInvoicesFormProps {
  invoices: Invoice[];
  onCreateInvoice: (
    invoice: Omit<Invoice, "id" | "invoiceNumber" | "amount">,
  ) => void;
  onDownloadInvoice: (id: string) => void;
}

const BillingInvoicesForm = ({
  invoices,
  onCreateInvoice,
  onDownloadInvoice,
}: BillingInvoicesFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewInvoiceDialog, setShowNewInvoiceDialog] = useState(false);
  const [showInvoiceDetailsDialog, setShowInvoiceDetailsDialog] =
    useState(false);
  const [showInvoiceTemplateDialog, setShowInvoiceTemplateDialog] =
    useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const invoiceTemplateRef = useRef<HTMLDivElement>(null);
  const [newInvoice, setNewInvoice] = useState({
    customerName: "",
    shipmentId: "",
    issueDate: format(new Date(), "yyyy-MM-dd"),
    dueDate: format(
      new Date(new Date().setDate(new Date().getDate() + 30)),
      "yyyy-MM-dd",
    ),
    status: "draft",
    items: [],
  });

  // Filter invoices based on search term and status filter
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.shipmentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateInvoice = () => {
    onCreateInvoice(newInvoice);
    setShowNewInvoiceDialog(false);
    setNewInvoice({
      customerName: "",
      shipmentId: "",
      issueDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: format(
        new Date(new Date().setDate(new Date().getDate() + 30)),
        "yyyy-MM-dd",
      ),
      status: "draft",
      items: [],
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-200"
          >
            Draft
          </Badge>
        );
      case "sent":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Sent
          </Badge>
        );
      case "paid":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Paid
          </Badge>
        );
      case "overdue":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Overdue
          </Badge>
        );
      case "void":
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-200"
          >
            Void
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search invoices..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="void">Void</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setShowNewInvoiceDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Manage customer invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>{invoice.shipmentId}</TableCell>
                    <TableCell>{invoice.issueDate}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowInvoiceDetailsDialog(true);
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowInvoiceTemplateDialog(true);
                          }}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownloadInvoice(invoice.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* New Invoice Dialog */}
      <Dialog
        open={showNewInvoiceDialog}
        onOpenChange={setShowNewInvoiceDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Enter the invoice details below to create a new invoice.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={newInvoice.customerName}
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, customerName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipmentId">Shipment ID</Label>
              <Input
                id="shipmentId"
                value={newInvoice.shipmentId}
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, shipmentId: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newInvoice.issueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newInvoice.issueDate ? (
                      format(new Date(newInvoice.issueDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      newInvoice.issueDate
                        ? new Date(newInvoice.issueDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      setNewInvoice({
                        ...newInvoice,
                        issueDate: date
                          ? format(date, "yyyy-MM-dd")
                          : undefined,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newInvoice.dueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newInvoice.dueDate ? (
                      format(new Date(newInvoice.dueDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      newInvoice.dueDate
                        ? new Date(newInvoice.dueDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      setNewInvoice({
                        ...newInvoice,
                        dueDate: date ? format(date, "yyyy-MM-dd") : undefined,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newInvoice.status}
                onValueChange={(value) =>
                  setNewInvoice({ ...newInvoice, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={newInvoice.notes || ""}
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewInvoiceDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateInvoice}>Create Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Details Dialog */}
      {selectedInvoice && (
        <Dialog
          open={showInvoiceDetailsDialog}
          onOpenChange={setShowInvoiceDetailsDialog}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Invoice {selectedInvoice.invoiceNumber}</DialogTitle>
              <DialogDescription>
                {selectedInvoice.customerName} - {selectedInvoice.shipmentId}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium">Issue Date:</p>
                <p className="text-sm">{selectedInvoice.issueDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Due Date:</p>
                <p className="text-sm">{selectedInvoice.dueDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status:</p>
                <div className="mt-1">
                  {getStatusBadge(selectedInvoice.status)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Total Amount:</p>
                <p className="text-sm">
                  ${selectedInvoice.amount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedInvoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.rate.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${selectedInvoice.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {selectedInvoice.notes && (
              <div className="mt-4">
                <p className="text-sm font-medium">Notes:</p>
                <p className="text-sm">{selectedInvoice.notes}</p>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowInvoiceDetailsDialog(false)}
              >
                Close
              </Button>
              <Button onClick={() => onDownloadInvoice(selectedInvoice.id)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                onClick={() => {
                  setShowInvoiceDetailsDialog(false);
                  setShowInvoiceTemplateDialog(true);
                }}
              >
                <Printer className="mr-2 h-4 w-4" />
                View Bill of Lading
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Invoice Template Dialog */}
      {selectedInvoice && (
        <Dialog
          open={showInvoiceTemplateDialog}
          onOpenChange={setShowInvoiceTemplateDialog}
        >
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Bill of Lading - {selectedInvoice.invoiceNumber}
              </DialogTitle>
              <DialogDescription>
                {selectedInvoice.customerName} - {selectedInvoice.shipmentId}
              </DialogDescription>
            </DialogHeader>

            <div ref={invoiceTemplateRef}>
              <InvoiceTemplate invoice={selectedInvoice} />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowInvoiceTemplateDialog(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  // Print functionality
                  const printContent = invoiceTemplateRef.current?.innerHTML;
                  if (printContent) {
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Bill of Lading - ${selectedInvoice.invoiceNumber}</title>
                            <link rel="stylesheet" href="/src/index.css">
                            <style>
                              body { font-family: Arial, sans-serif; }
                              @media print {
                                body { margin: 0; padding: 20px; }
                              }
                            </style>
                          </head>
                          <body>
                            ${printContent}
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.focus();
                      // Use setTimeout to ensure content is loaded before printing
                      setTimeout(() => {
                        printWindow.print();
                        // printWindow.close();
                      }, 250);
                    }
                  }
                }}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print / Save as PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BillingInvoicesForm;
