import { useState } from "react";
import { format } from "date-fns";
import {
  Search,
  PlusCircle,
  FileText,
  Download,
  CalendarIcon,
  Ship,
  Package,
  Clipboard,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { OceanExportBooking } from "@/types/booking";

interface OceanExportBookingFormProps {
  bookings: OceanExportBooking[];
  onCreateBooking: (booking: Omit<OceanExportBooking, "id">) => void;
  onDownloadBooking: (id: string) => void;
}

const OceanExportBookingForm = ({
  bookings = [],
  onCreateBooking = () => {},
  onDownloadBooking = () => {},
}: OceanExportBookingFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewBookingDialog, setShowNewBookingDialog] = useState(false);
  const [showBookingDetailsDialog, setShowBookingDetailsDialog] =
    useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<OceanExportBooking | null>(null);
  const [newBooking, setNewBooking] = useState<Partial<OceanExportBooking>>({
    date: format(new Date(), "yyyy-MM-dd"),
    etd: format(
      new Date(new Date().setDate(new Date().getDate() + 14)),
      "yyyy-MM-dd",
    ),
    eta: format(
      new Date(new Date().setDate(new Date().getDate() + 30)),
      "yyyy-MM-dd",
    ),
    preQuoted: false,
    dangerous: false,
    lc: false,
    shipper: {
      name: "",
      address: "",
      tel: "",
      fax: "",
      attn: "",
    },
    cargo: {
      kgs: 0,
      lbs: 0,
      cbm: 0,
      cft: 0,
      packages: 1,
      unit: "",
    },
    deliveryInfo: {
      to: "",
      portRail: "",
      cutOffDate: format(
        new Date(new Date().setDate(new Date().getDate() + 7)),
        "yyyy-MM-dd",
      ),
      cutOffTime: "00:00",
      warehouse: "",
      sedDoc: "",
      moveType: "DOOR/CFS",
    },
    remarks: [],
  });

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.carrierBookingNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.shipper.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleCreateBooking = () => {
    onCreateBooking(newBooking as any);
    setShowNewBookingDialog(false);
    setNewBooking({
      date: format(new Date(), "yyyy-MM-dd"),
      etd: format(
        new Date(new Date().setDate(new Date().getDate() + 14)),
        "yyyy-MM-dd",
      ),
      eta: format(
        new Date(new Date().setDate(new Date().getDate() + 30)),
        "yyyy-MM-dd",
      ),
      preQuoted: false,
      dangerous: false,
      lc: false,
      shipper: {
        name: "",
        address: "",
        tel: "",
        fax: "",
        attn: "",
      },
      cargo: {
        kgs: 0,
        lbs: 0,
        cbm: 0,
        cft: 0,
        packages: 1,
        unit: "",
      },
      deliveryInfo: {
        to: "",
        portRail: "",
        cutOffDate: format(
          new Date(new Date().setDate(new Date().getDate() + 7)),
          "yyyy-MM-dd",
        ),
        cutOffTime: "00:00",
        warehouse: "",
        sedDoc: "",
        moveType: "DOOR/CFS",
      },
      remarks: [],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search bookings..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={() => setShowNewBookingDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Ocean Export Bookings</CardTitle>
          <CardDescription>Manage shipping bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking #</TableHead>
                  <TableHead>Carrier Booking #</TableHead>
                  <TableHead>Shipper</TableHead>
                  <TableHead>Vessel/Voyage</TableHead>
                  <TableHead>POL</TableHead>
                  <TableHead>POD</TableHead>
                  <TableHead>ETD</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.bookingNumber}>
                    <TableCell className="font-medium">
                      {booking.bookingNumber}
                    </TableCell>
                    <TableCell>{booking.carrierBookingNumber}</TableCell>
                    <TableCell>{booking.shipper.name}</TableCell>
                    <TableCell>{`${booking.vessel.name} ${booking.vessel.voyageNumber}`}</TableCell>
                    <TableCell>{booking.portOfLoading}</TableCell>
                    <TableCell>{booking.portOfDischarge}</TableCell>
                    <TableCell>{booking.etd}</TableCell>
                    <TableCell>{booking.eta}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowBookingDetailsDialog(true);
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onDownloadBooking(booking.bookingNumber)
                          }
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

      {/* New Booking Dialog */}
      <Dialog
        open={showNewBookingDialog}
        onOpenChange={setShowNewBookingDialog}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Ocean Export Booking</DialogTitle>
            <DialogDescription>
              Enter the booking details below to create a new ocean export
              booking.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium">Basic Information</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Booking Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newBooking.date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newBooking.date ? (
                            format(new Date(newBooking.date), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            newBooking.date
                              ? new Date(newBooking.date)
                              : undefined
                          }
                          onSelect={(date) =>
                            setNewBooking({
                              ...newBooking,
                              date: date
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
                    <Label htmlFor="preparedBy">Prepared By</Label>
                    <Input
                      id="preparedBy"
                      value={newBooking.preparedBy || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          preparedBy: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salesBy">Sales By</Label>
                    <Input
                      id="salesBy"
                      value={newBooking.salesBy || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          salesBy: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Shipper Information */}
              <div>
                <h3 className="text-lg font-medium">Shipper Information</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="shipperName">Shipper Name</Label>
                    <Input
                      id="shipperName"
                      value={newBooking.shipper?.name || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          shipper: {
                            ...newBooking.shipper,
                            name: e.target.value,
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipperAddress">Address</Label>
                    <Input
                      id="shipperAddress"
                      value={newBooking.shipper?.address || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          shipper: {
                            ...newBooking.shipper,
                            address: e.target.value,
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipperTel">Telephone</Label>
                    <Input
                      id="shipperTel"
                      value={newBooking.shipper?.tel || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          shipper: {
                            ...newBooking.shipper,
                            tel: e.target.value,
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipperFax">Fax</Label>
                    <Input
                      id="shipperFax"
                      value={newBooking.shipper?.fax || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          shipper: {
                            ...newBooking.shipper,
                            fax: e.target.value,
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipperAttn">Attention</Label>
                    <Input
                      id="shipperAttn"
                      value={newBooking.shipper?.attn || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          shipper: {
                            ...newBooking.shipper,
                            attn: e.target.value,
                          } as any,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Consignee & Agent Information */}
              <div>
                <h3 className="text-lg font-medium">
                  Consignee & Agent Information
                </h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="consignee">Consignee</Label>
                    <Input
                      id="consignee"
                      value={newBooking.consignee || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          consignee: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notifyParty">Notify Party</Label>
                    <Input
                      id="notifyParty"
                      value={newBooking.notifyParty || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          notifyParty: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agent">Agent</Label>
                    <Input
                      id="agent"
                      value={newBooking.agent || ""}
                      onChange={(e) =>
                        setNewBooking({ ...newBooking, agent: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exportRefNo">Export Ref. No.</Label>
                    <Input
                      id="exportRefNo"
                      value={newBooking.exportRefNo || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          exportRefNo: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Vessel & Carrier Information */}
              <div>
                <h3 className="text-lg font-medium">
                  Vessel & Carrier Information
                </h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="vesselName">Vessel Name</Label>
                    <Input
                      id="vesselName"
                      value={newBooking.vessel?.name || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          vessel: {
                            ...newBooking.vessel,
                            name: e.target.value,
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="voyageNumber">Voyage Number</Label>
                    <Input
                      id="voyageNumber"
                      value={newBooking.vessel?.voyageNumber || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          vessel: {
                            ...newBooking.vessel,
                            voyageNumber: e.target.value,
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carrier">Carrier</Label>
                    <Input
                      id="carrier"
                      value={newBooking.carrier || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          carrier: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carrierBookingNumber">
                      Carrier Booking Number
                    </Label>
                    <Input
                      id="carrierBookingNumber"
                      value={newBooking.carrierBookingNumber || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          carrierBookingNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Routing Information */}
              <div>
                <h3 className="text-lg font-medium">Routing Information</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="placeOfReceipt">Place of Receipt</Label>
                    <Input
                      id="placeOfReceipt"
                      value={newBooking.placeOfReceipt || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          placeOfReceipt: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portOfLoading">Port of Loading (POL)</Label>
                    <Input
                      id="portOfLoading"
                      value={newBooking.portOfLoading || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          portOfLoading: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portOfDischarge">
                      Port of Discharge (POD)
                    </Label>
                    <Input
                      id="portOfDischarge"
                      value={newBooking.portOfDischarge || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          portOfDischarge: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="placeOfDelivery">Place of Delivery</Label>
                    <Input
                      id="placeOfDelivery"
                      value={newBooking.placeOfDelivery || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          placeOfDelivery: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="finalDestination">Final Destination</Label>
                    <Input
                      id="finalDestination"
                      value={newBooking.finalDestination || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          finalDestination: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Information */}
              <div>
                <h3 className="text-lg font-medium">Schedule Information</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="etd">
                      ETD (Estimated Time of Departure)
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newBooking.etd && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newBooking.etd ? (
                            format(new Date(newBooking.etd), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            newBooking.etd
                              ? new Date(newBooking.etd)
                              : undefined
                          }
                          onSelect={(date) =>
                            setNewBooking({
                              ...newBooking,
                              etd: date
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
                    <Label htmlFor="eta">ETA (Estimated Time of Arrival)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newBooking.eta && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newBooking.eta ? (
                            format(new Date(newBooking.eta), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            newBooking.eta
                              ? new Date(newBooking.eta)
                              : undefined
                          }
                          onSelect={(date) =>
                            setNewBooking({
                              ...newBooking,
                              eta: date
                                ? format(date, "yyyy-MM-dd")
                                : undefined,
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Cargo Information */}
              <div>
                <h3 className="text-lg font-medium">Cargo Information</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="commodity">Commodity</Label>
                    <Input
                      id="commodity"
                      value={newBooking.commodity || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          commodity: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="packages">Number of Packages</Label>
                    <Input
                      id="packages"
                      type="number"
                      value={newBooking.cargo?.packages || 0}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          cargo: {
                            ...newBooking.cargo,
                            packages: Number(e.target.value),
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={newBooking.cargo?.unit || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          cargo: {
                            ...newBooking.cargo,
                            unit: e.target.value,
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kgs">Weight (KGS)</Label>
                    <Input
                      id="kgs"
                      type="number"
                      value={newBooking.cargo?.kgs || 0}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          cargo: {
                            ...newBooking.cargo,
                            kgs: Number(e.target.value),
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lbs">Weight (LBS)</Label>
                    <Input
                      id="lbs"
                      type="number"
                      value={newBooking.cargo?.lbs || 0}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          cargo: {
                            ...newBooking.cargo,
                            lbs: Number(e.target.value),
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cbm">Volume (CBM)</Label>
                    <Input
                      id="cbm"
                      type="number"
                      step="0.001"
                      value={newBooking.cargo?.cbm || 0}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          cargo: {
                            ...newBooking.cargo,
                            cbm: Number(e.target.value),
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cft">Volume (CFT)</Label>
                    <Input
                      id="cft"
                      type="number"
                      value={newBooking.cargo?.cft || 0}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          cargo: {
                            ...newBooking.cargo,
                            cft: Number(e.target.value),
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2 flex items-center">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dangerous"
                        checked={newBooking.dangerous || false}
                        onCheckedChange={(checked) =>
                          setNewBooking({
                            ...newBooking,
                            dangerous: checked === true,
                          })
                        }
                      />
                      <Label htmlFor="dangerous">Dangerous Goods</Label>
                    </div>
                  </div>
                  <div className="space-y-2 flex items-center">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lc"
                        checked={newBooking.lc || false}
                        onCheckedChange={(checked) =>
                          setNewBooking({
                            ...newBooking,
                            lc: checked === true,
                          })
                        }
                      />
                      <Label htmlFor="lc">Letter of Credit (L/C)</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div>
                <h3 className="text-lg font-medium">Delivery Information</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="to">Deliver To</Label>
                    <Input
                      id="to"
                      value={newBooking.deliveryInfo?.to || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          deliveryInfo: {
                            ...newBooking.deliveryInfo,
                            to: e.target.value,
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portRail">Port/Rail</Label>
                    <Input
                      id="portRail"
                      value={newBooking.deliveryInfo?.portRail || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          deliveryInfo: {
                            ...newBooking.deliveryInfo,
                            portRail: e.target.value,
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cutOffDate">Cut-Off Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newBooking.deliveryInfo?.cutOffDate &&
                              "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newBooking.deliveryInfo?.cutOffDate ? (
                            format(
                              new Date(newBooking.deliveryInfo.cutOffDate),
                              "PPP",
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            newBooking.deliveryInfo?.cutOffDate
                              ? new Date(newBooking.deliveryInfo.cutOffDate)
                              : undefined
                          }
                          onSelect={(date) =>
                            setNewBooking({
                              ...newBooking,
                              deliveryInfo: {
                                ...newBooking.deliveryInfo,
                                cutOffDate: date
                                  ? format(date, "yyyy-MM-dd")
                                  : undefined,
                              } as any,
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cutOffTime">Cut-Off Time</Label>
                    <Input
                      id="cutOffTime"
                      type="time"
                      value={newBooking.deliveryInfo?.cutOffTime || "00:00"}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          deliveryInfo: {
                            ...newBooking.deliveryInfo,
                            cutOffTime: e.target.value,
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouse">Warehouse</Label>
                    <Input
                      id="warehouse"
                      value={newBooking.deliveryInfo?.warehouse || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          deliveryInfo: {
                            ...newBooking.deliveryInfo,
                            warehouse: e.target.value,
                          } as any,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="moveType">Move Type</Label>
                    <Select
                      value={newBooking.deliveryInfo?.moveType || "DOOR/CFS"}
                      onValueChange={(value) =>
                        setNewBooking({
                          ...newBooking,
                          deliveryInfo: {
                            ...newBooking.deliveryInfo,
                            moveType: value,
                          } as any,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select move type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DOOR/CFS">DOOR/CFS</SelectItem>
                        <SelectItem value="DOOR/DOOR">DOOR/DOOR</SelectItem>
                        <SelectItem value="CFS/CFS">CFS/CFS</SelectItem>
                        <SelectItem value="CFS/DOOR">CFS/DOOR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-medium">Additional Information</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="preQuoted"
                        checked={newBooking.preQuoted || false}
                        onCheckedChange={(checked) =>
                          setNewBooking({
                            ...newBooking,
                            preQuoted: checked === true,
                          })
                        }
                      />
                      <Label htmlFor="preQuoted">Pre-Quoted Shipment</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remarks">Remarks</Label>
                    <Textarea
                      id="remarks"
                      value={newBooking.remarks?.join("\n") || ""}
                      onChange={(e) =>
                        setNewBooking({
                          ...newBooking,
                          remarks: e.target.value.split("\n"),
                        })
                      }
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowNewBookingDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateBooking}>Create Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      {selectedBooking && (
        <Dialog
          open={showBookingDetailsDialog}
          onOpenChange={setShowBookingDetailsDialog}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Booking {selectedBooking.bookingNumber}</DialogTitle>
              <DialogDescription>
                {selectedBooking.shipper.name} - {selectedBooking.vessel.name}{" "}
                {selectedBooking.vessel.voyageNumber}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium">Booking Number:</p>
                      <p className="text-sm">{selectedBooking.bookingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Carrier Booking Number:
                      </p>
                      <p className="text-sm">
                        {selectedBooking.carrierBookingNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Date:</p>
                      <p className="text-sm">{selectedBooking.date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Prepared By:</p>
                      <p className="text-sm">{selectedBooking.preparedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sales By:</p>
                      <p className="text-sm">{selectedBooking.salesBy}</p>
                    </div>
                  </div>
                </div>

                {/* Shipper Information */}
                <div>
                  <h3 className="text-lg font-medium">Shipper Information</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium">Shipper Name:</p>
                      <p className="text-sm">{selectedBooking.shipper.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Address:</p>
                      <p className="text-sm">
                        {selectedBooking.shipper.address}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Telephone:</p>
                      <p className="text-sm">{selectedBooking.shipper.tel}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fax:</p>
                      <p className="text-sm">{selectedBooking.shipper.fax}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Attention:</p>
                      <p className="text-sm">{selectedBooking.shipper.attn}</p>
                    </div>
                  </div>
                </div>

                {/* Consignee & Agent Information */}
                <div>
                  <h3 className="text-lg font-medium">
                    Consignee & Agent Information
                  </h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium">Consignee:</p>
                      <p className="text-sm">{selectedBooking.consignee}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Notify Party:</p>
                      <p className="text-sm">{selectedBooking.notifyParty}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Agent:</p>
                      <p className="text-sm">{selectedBooking.agent}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Export Ref. No.:</p>
                      <p className="text-sm">{selectedBooking.exportRefNo}</p>
                    </div>
                  </div>
                </div>

                {/* Vessel & Carrier Information */}
                <div>
                  <h3 className="text-lg font-medium">
                    Vessel & Carrier Information
                  </h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium">Vessel Name:</p>
                      <p className="text-sm">{selectedBooking.vessel.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Voyage Number:</p>
                      <p className="text-sm">
                        {selectedBooking.vessel.voyageNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Carrier:</p>
                      <p className="text-sm">{selectedBooking.carrier}</p>
                    </div>
                  </div>
                </div>

                {/* Routing Information */}
                <div>
                  <h3 className="text-lg font-medium">Routing Information</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium">Place of Receipt:</p>
                      <p className="text-sm">
                        {selectedBooking.placeOfReceipt}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Port of Loading (POL):
                      </p>
                      <p className="text-sm">{selectedBooking.portOfLoading}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Port of Discharge (POD):
                      </p>
                      <p className="text-sm">
                        {selectedBooking.portOfDischarge}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Place of Delivery:</p>
                      <p className="text-sm">
                        {selectedBooking.placeOfDelivery}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Final Destination:</p>
                      <p className="text-sm">
                        {selectedBooking.finalDestination}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div>
                  <h3 className="text-lg font-medium">Schedule Information</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium">ETD:</p>
                      <p className="text-sm">{selectedBooking.etd}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">ETA:</p>
                      <p className="text-sm">{selectedBooking.eta}</p>
                    </div>
                  </div>
                </div>

                {/* Cargo Information */}
                <div>
                  <h3 className="text-lg font-medium">Cargo Information</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium">Commodity:</p>
                      <p className="text-sm">{selectedBooking.commodity}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Number of Packages:</p>
                      <p className="text-sm">
                        {selectedBooking.cargo.packages}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Unit:</p>
                      <p className="text-sm">{selectedBooking.cargo.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Weight (KGS):</p>
                      <p className="text-sm">{selectedBooking.cargo.kgs}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Weight (LBS):</p>
                      <p className="text-sm">{selectedBooking.cargo.lbs}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Volume (CBM):</p>
                      <p className="text-sm">{selectedBooking.cargo.cbm}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Volume (CFT):</p>
                      <p className="text-sm">{selectedBooking.cargo.cft}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Dangerous Goods:</p>
                      <p className="text-sm">
                        {selectedBooking.dangerous ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Letter of Credit (L/C):
                      </p>
                      <p className="text-sm">
                        {selectedBooking.lc ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div>
                  <h3 className="text-lg font-medium">Delivery Information</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium">Deliver To:</p>
                      <p className="text-sm">
                        {selectedBooking.deliveryInfo.to}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Port/Rail:</p>
                      <p className="text-sm">
                        {selectedBooking.deliveryInfo.portRail}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cut-Off Date:</p>
                      <p className="text-sm">
                        {selectedBooking.deliveryInfo.cutOffDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cut-Off Time:</p>
                      <p className="text-sm">
                        {selectedBooking.deliveryInfo.cutOffTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Warehouse:</p>
                      <p className="text-sm">
                        {selectedBooking.deliveryInfo.warehouse}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Move Type:</p>
                      <p className="text-sm">
                        {selectedBooking.deliveryInfo.moveType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-medium">
                    Additional Information
                  </h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium">
                        Pre-Quoted Shipment:
                      </p>
                      <p className="text-sm">
                        {selectedBooking.preQuoted ? "Yes" : "No"}
                      </p>
                    </div>
                    {selectedBooking.remarks &&
                      selectedBooking.remarks.length > 0 && (
                        <div>
                          <p className="text-sm font-medium">Remarks:</p>
                          {selectedBooking.remarks.map((remark, index) => (
                            <p key={index} className="text-sm">
                              {remark}
                            </p>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowBookingDetailsDialog(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => onDownloadBooking(selectedBooking.bookingNumber)}
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

export default OceanExportBookingForm;
