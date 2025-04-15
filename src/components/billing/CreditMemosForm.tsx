import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  PlusCircle,
  Search,
  FileText,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CreditMemo } from "@/types/billing";

interface CreditMemosFormProps {
  creditMemos?: CreditMemo[];
  onCreateCreditMemo?: (creditMemo: Partial<CreditMemo>) => void;
  onUpdateCreditMemo?: (id: string, creditMemo: Partial<CreditMemo>) => void;
  onDeleteCreditMemo?: (id: string) => void;
  onDownloadCreditMemo?: (id: string) => void;
}

const CreditMemosForm = ({
  creditMemos = [
    {
      id: "cm-001",
      memoNumber: "CM-2023-001",
      invoiceId: "inv-001",
      invoiceNumber: "INV-2023-001",
      customerId: "cust-001",
      customerName: "Acme Corporation",
      shipmentId: "SHP-12345",
      amount: 250.0,
      status: "issued",
      issueDate: "2023-06-20",
      items: [
        {
          id: "item-001",
          billingCodeId: "code-002",
          description: "Documentation Fee",
          quantity: 1,
          rate: 250.0,
          amount: 250.0,
        },
      ],
      reason: "Service not provided",
      notes: "Credit for documentation fee",
    },
    {
      id: "cm-002",
      memoNumber: "CM-2023-002",
      invoiceId: "inv-002",
      invoiceNumber: "INV-2023-002",
      customerId: "cust-002",
      customerName: "Globex International",
      shipmentId: "SHP-12346",
      amount: 750.0,
      status: "applied",
      issueDate: "2023-06-25",
      items: [
        {
          id: "item-002",
          billingCodeId: "code-002",
          description: "Documentation Fee",
          quantity: 3,
          rate: 250.0,
          amount: 750.0,
        },
      ],
      reason: "Billing error",
      notes: "Applied to next invoice",
    },
    {
      id: "cm-003",
      memoNumber: "CM-2023-003",
      customerId: "cust-003",
      customerName: "Wayne Enterprises",
      shipmentId: "SHP-12347",
      amount: 500.0,
      status: "draft",
      issueDate: "2023-06-28",
      items: [
        {
          id: "item-003",
          billingCodeId: "code-007",
          description: "Handling Fee",
          quantity: 1,
          rate: 500.0,
          amount: 500.0,
        },
      ],
      reason: "Customer satisfaction",
      notes: "Goodwill credit",
    },
  ],
  onCreateCreditMemo = () => {},
  onUpdateCreditMemo = () => {},
  onDeleteCreditMemo = () => {},
  onDownloadCreditMemo = () => {},
}: CreditMemosFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showNewCreditMemoDialog, setShowNewCreditMemoDialog] = useState(false);
  const [selectedCreditMemo, setSelectedCreditMemo] =
    useState<CreditMemo | null>(null);
  const [showCreditMemoDetailsDialog, setShowCreditMemoDetailsDialog] =
    useState(false);

  // New credit memo form state
  const [newCreditMemo, setNewCreditMemo] = useState<Partial<CreditMemo>>({
    customerName: "",
    shipmentId: "",
    invoiceNumber: "",
    issueDate: format(new Date(), "yyyy-MM-dd"),
    status: "draft",
    reason: "",
    items: [],
  });

  // Filter credit memos based on search term and status filter
  const filteredCreditMemos = creditMemos.filter((memo) => {
    const matchesSearch =
      memo.memoNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memo.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memo.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (memo.invoiceNumber &&
        memo.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || memo.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateCreditMemo = () => {
    onCreateCreditMemo(newCreditMemo);
    setShowNewCreditMemoDialog(false);
    setNewCreditMemo({
      customerName: "",
      shipmentId: "",
      invoiceNumber: "",
      issueDate: format(new Date(), "yyyy-MM-dd"),
      status: "draft",
      reason: "",
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
      case "issued":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Issued
          </Badge>
        );
      case "applied":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Applied
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
              placeholder="Search credit memos..."
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
              <SelectItem value="issued">Issued</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setShowNewCreditMemoDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Credit Memo
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Credit Memos</CardTitle>
          <CardDescription>Manage customer credit memos</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Memo #</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCreditMemos.map((memo) => (
                  <TableRow key={memo.id}>
                    <TableCell className="font-medium">
                      {memo.memoNumber}
                    </TableCell>
                    <TableCell>{memo.invoiceNumber || "-"}</TableCell>
                    <TableCell>{memo.customerName}</TableCell>
                    <TableCell>{memo.shipmentId}</TableCell>
                    <TableCell>{memo.issueDate}</TableCell>
                    <TableCell>${memo.amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(memo.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCreditMemo(memo);
                            setShowCreditMemoDetailsDialog(true);
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownloadCreditMemo(memo.id)}
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

      {/* New Credit Memo Dialog */}
      <Dialog
        open={showNewCreditMemoDialog}
        onOpenChange={setShowNewCreditMemoDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Credit Memo</DialogTitle>
            <DialogDescription>
              Enter the credit memo details below to create a new credit memo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">
                Related Invoice # (Optional)
              </Label>
              <Input
                id="invoiceNumber"
                value={newCreditMemo.invoiceNumber || ""}
                onChange={(e) =>
                  setNewCreditMemo({
                    ...newCreditMemo,
                    invoiceNumber: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={newCreditMemo.customerName}
                onChange={(e) =>
                  setNewCreditMemo({
                    ...newCreditMemo,
                    customerName: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipmentId">Shipment ID</Label>
              <Input
                id="shipmentId"
                value={newCreditMemo.shipmentId}
                onChange={(e) =>
                  setNewCreditMemo({
                    ...newCreditMemo,
                    shipmentId: e.target.value,
                  })
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
                      !newCreditMemo.issueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newCreditMemo.issueDate ? (
                      format(new Date(newCreditMemo.issueDate), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      newCreditMemo.issueDate
                        ? new Date(newCreditMemo.issueDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      setNewCreditMemo({
                        ...newCreditMemo,
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
              <Label htmlFor="status">Status</Label>
              <Select
                value={newCreditMemo.status}
                onValueChange={(value) =>
                  setNewCreditMemo({ ...newCreditMemo, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="issued">Issued</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={newCreditMemo.amount || ""}
                onChange={(e) =>
                  setNewCreditMemo({
                    ...newCreditMemo,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="reason">Reason</Label>
              <Select
                value={newCreditMemo.reason}
                onValueChange={(value) =>
                  setNewCreditMemo({ ...newCreditMemo, reason: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Billing error">Billing error</SelectItem>
                  <SelectItem value="Service not provided">
                    Service not provided
                  </SelectItem>
                  <SelectItem value="Customer satisfaction">
                    Customer satisfaction
                  </SelectItem>
                  <SelectItem value="Damaged goods">Damaged goods</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={newCreditMemo.notes || ""}
                onChange={(e) =>
                  setNewCreditMemo({ ...newCreditMemo, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewCreditMemoDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCreditMemo}>Create Credit Memo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Credit Memo Details Dialog */}
      {selectedCreditMemo && (
        <Dialog
          open={showCreditMemoDetailsDialog}
          onOpenChange={setShowCreditMemoDetailsDialog}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                Credit Memo {selectedCreditMemo.memoNumber}
              </DialogTitle>
              <DialogDescription>
                {selectedCreditMemo.customerName} -{" "}
                {selectedCreditMemo.shipmentId}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium">Issue Date:</p>
                <p className="text-sm">{selectedCreditMemo.issueDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status:</p>
                <div className="mt-1">
                  {getStatusBadge(selectedCreditMemo.status)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Related Invoice:</p>
                <p className="text-sm">
                  {selectedCreditMemo.invoiceNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Amount:</p>
                <p className="text-sm">
                  ${selectedCreditMemo.amount.toLocaleString()}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium">Reason:</p>
                <p className="text-sm">{selectedCreditMemo.reason}</p>
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
                  {selectedCreditMemo.items.map((item) => (
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
                      ${selectedCreditMemo.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {selectedCreditMemo.notes && (
              <div className="mt-4">
                <p className="text-sm font-medium">Notes:</p>
                <p className="text-sm">{selectedCreditMemo.notes}</p>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreditMemoDetailsDialog(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => onDownloadCreditMemo(selectedCreditMemo.id)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CreditMemosForm;
