import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { BillingCode } from "@/types/billing";
import {
  getBillingCodes,
  createBillingCode,
  updateBillingCode,
  deleteBillingCode,
} from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

interface BillingCodesProps {
  className?: string;
}

const BillingCodes = ({ className = "" }: BillingCodesProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<BillingCode | null>(null);
  const [billingCodes, setBillingCodes] = useState<BillingCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form refs for add dialog
  const codeRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const rateRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const isActiveRef = useRef<HTMLButtonElement>(null);

  // Form refs for edit dialog
  const editCodeRef = useRef<HTMLInputElement>(null);
  const editDescriptionRef = useRef<HTMLInputElement>(null);
  const editRateRef = useRef<HTMLInputElement>(null);
  const editCategoryRef = useRef<HTMLInputElement>(null);
  const editIsActiveRef = useRef<HTMLButtonElement>(null);

  // Fetch billing codes on component mount
  useEffect(() => {
    fetchBillingCodes();
  }, []);

  const fetchBillingCodes = async () => {
    setIsLoading(true);
    try {
      const codes = await getBillingCodes();
      setBillingCodes(codes);
    } catch (error) {
      console.error("Error fetching billing codes:", error);
      toast({
        title: "Error",
        description: "Failed to load billing codes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (
        !codeRef.current ||
        !descriptionRef.current ||
        !rateRef.current ||
        !categoryRef.current
      ) {
        return;
      }

      const newCode: Omit<BillingCode, "id" | "createdAt" | "updatedAt"> = {
        code: codeRef.current.value,
        description: descriptionRef.current.value,
        rate: parseFloat(rateRef.current.value),
        category: categoryRef.current.value,
        isActive: isActiveRef.current?.dataset.state === "checked",
      };

      const result = await createBillingCode(newCode);
      if (result) {
        toast({
          title: "Success",
          description: "Billing code created successfully.",
        });
        await fetchBillingCodes();
        setIsAddDialogOpen(false);
        // Reset form
        codeRef.current.value = "";
        descriptionRef.current.value = "";
        rateRef.current.value = "";
        categoryRef.current.value = "";
      } else {
        toast({
          title: "Error",
          description: "Failed to create billing code. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding billing code:", error);
      toast({
        title: "Error",
        description: "Failed to create billing code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (
        !selectedCode ||
        !editCodeRef.current ||
        !editDescriptionRef.current ||
        !editRateRef.current ||
        !editCategoryRef.current
      ) {
        return;
      }

      const updatedCode: Partial<BillingCode> = {
        code: editCodeRef.current.value,
        description: editDescriptionRef.current.value,
        rate: parseFloat(editRateRef.current.value),
        category: editCategoryRef.current.value,
        isActive: editIsActiveRef.current?.dataset.state === "checked",
      };

      const success = await updateBillingCode(selectedCode.id, updatedCode);
      if (success) {
        toast({
          title: "Success",
          description: "Billing code updated successfully.",
        });
        await fetchBillingCodes();
        setIsEditDialogOpen(false);
        setSelectedCode(null);
      } else {
        toast({
          title: "Error",
          description: "Failed to update billing code. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating billing code:", error);
      toast({
        title: "Error",
        description: "Failed to update billing code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (!confirm("Are you sure you want to delete this billing code?")) {
      return;
    }

    try {
      const success = await deleteBillingCode(id);
      if (success) {
        toast({
          title: "Success",
          description: "Billing code deleted successfully.",
        });
        await fetchBillingCodes();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete billing code. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting billing code:", error);
      toast({
        title: "Error",
        description: "Failed to delete billing code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`bg-background p-6 rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Billing Codes</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Billing Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Billing Code</DialogTitle>
              <DialogDescription>
                Create a new billing code for your shipments.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCode}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Code
                  </Label>
                  <Input
                    id="code"
                    className="col-span-3"
                    required
                    ref={codeRef}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    className="col-span-3"
                    required
                    ref={descriptionRef}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rate" className="text-right">
                    Rate ($)
                  </Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    className="col-span-3"
                    required
                    ref={rateRef}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category"
                    className="col-span-3"
                    required
                    ref={categoryRef}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isActive" className="text-right">
                    Active
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <Checkbox id="isActive" defaultChecked ref={isActiveRef} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Rate ($)</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading billing codes...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : billingCodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No billing codes found. Add your first billing code to get
                  started.
                </TableCell>
              </TableRow>
            ) : (
              billingCodes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-medium">{code.code}</TableCell>
                  <TableCell>{code.description}</TableCell>
                  <TableCell>${code.rate.toFixed(2)}</TableCell>
                  <TableCell>{code.category}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        code.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {code.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCode(code);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCode(code.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Billing Code</DialogTitle>
            <DialogDescription>
              Update the details of this billing code.
            </DialogDescription>
          </DialogHeader>
          {selectedCode && (
            <form onSubmit={handleEditCode}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-code" className="text-right">
                    Code
                  </Label>
                  <Input
                    id="edit-code"
                    defaultValue={selectedCode.code}
                    className="col-span-3"
                    required
                    ref={editCodeRef}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="edit-description"
                    defaultValue={selectedCode.description}
                    className="col-span-3"
                    required
                    ref={editDescriptionRef}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-rate" className="text-right">
                    Rate ($)
                  </Label>
                  <Input
                    id="edit-rate"
                    type="number"
                    step="0.01"
                    defaultValue={selectedCode.rate}
                    className="col-span-3"
                    required
                    ref={editRateRef}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="edit-category"
                    defaultValue={selectedCode.category}
                    className="col-span-3"
                    required
                    ref={editCategoryRef}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-isActive" className="text-right">
                    Active
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <Checkbox
                      id="edit-isActive"
                      defaultChecked={selectedCode.isActive}
                      ref={editIsActiveRef}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingCodes;
