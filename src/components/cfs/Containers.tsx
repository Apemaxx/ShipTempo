import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useContainers, { Container } from "@/hooks/useContainers";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface ContainersProps {
  payload?: Container[];
}

const Containers = ({ payload }: ContainersProps = {}) => {
  const {
    paginatedContainers,
    loading,
    error,
    pagination,
    setPageSize,
    setCurrentPage
  } = useContainers({ initialData: payload });

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading container data...</span>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      ) : paginatedContainers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No container data available.
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              {Math.min((pagination.currentPage - 1) * pagination.pageSize + 1, pagination.totalItems)} to{" "}
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of{" "}
              {pagination.totalItems} containers
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground mr-2">
                Items per page:
              </span>
              <Select
                value={pagination.pageSize.toString()}
                onValueChange={(value) => setPageSize(Number(value))}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Container</TableHead>
                <TableHead>Job Number</TableHead>
                <TableHead>Master Bill</TableHead>
                <TableHead>Cust Ref</TableHead>
                <TableHead>Vessel</TableHead>
                <TableHead>Vessel ETA</TableHead>
                <TableHead>Avail. @ Pier</TableHead>
                <TableHead>Avail. @ STG</TableHead>
                <TableHead>F/T Expires</TableHead>
                <TableHead>GO Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cust Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedContainers.map((container) => (
                <TableRow key={container.id}>
                  <TableCell>{container.location}</TableCell>
                  <TableCell>
                    <Link
                      to={`/container-details/${container.number}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {container.number}
                    </Link>
                  </TableCell>
                  <TableCell>{container.jobNumber || "-"}</TableCell>
                  <TableCell>{container.mbl}</TableCell>
                  <TableCell>{container.customerReference || "-"}</TableCell>
                  <TableCell>{container.vessel}</TableCell>
                  <TableCell>{container.eta}</TableCell>
                  <TableCell>{container.availableAtPier || "-"}</TableCell>
                  <TableCell>{container.availableAtSTG || "-"}</TableCell>
                  <TableCell>{container.returnEmptyDate || "-"}</TableCell>
                  <TableCell>{container.goDate || "-"}</TableCell>
                  <TableCell>{container.status}</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={pagination.currentPage === 1}
              >
                <ChevronFirst className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.max(pagination.currentPage - 1, 1))}
                disabled={pagination.currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center">
                {Array.from(
                  {
                    length: Math.min(
                      5,
                      pagination.totalPages
                    ),
                  },
                  (_, i) => {
                    // Calculate page numbers to show (centered around current page)
                    let startPage = Math.max(pagination.currentPage - 2, 1);
                    if (pagination.currentPage > pagination.totalPages - 2) {
                      startPage = Math.max(pagination.totalPages - 4, 1);
                    }
                    const pageNum = startPage + i;
                    if (pageNum <= pagination.totalPages) {
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pagination.currentPage === pageNum ? "default" : "outline"
                          }
                          size="icon"
                          onClick={() => setCurrentPage(pageNum)}
                          className="mx-0.5 h-8 w-8"
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                    return null;
                  },
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.min(pagination.currentPage + 1, pagination.totalPages))}
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(pagination.totalPages)}
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                <ChevronLast className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Containers;