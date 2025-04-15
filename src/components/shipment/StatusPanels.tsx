import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../../lib/utils";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, FileText, Upload } from "lucide-react";

interface StatusPanelsProps {
  currentStatus?:
    | "quote"
    | "booking"
    | "documentation"
    | "customs"
    | "transit"
    | "delivered";
}

const StatusPanels = ({ currentStatus = "booking" }: StatusPanelsProps) => {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-4">
      <Tabs defaultValue={currentStatus} className="w-full">
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="quote">Quote</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="customs">Customs</TabsTrigger>
          <TabsTrigger value="transit">In Transit</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        {/* Quote Stage Panel */}
        <TabsContent value="quote" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quote Management</CardTitle>
              <CardDescription>
                Review and manage the shipment quote
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quote-amount">Quote Amount</Label>
                  <Input
                    id="quote-amount"
                    defaultValue="$2,450.00"
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="quote-validity">Valid Until</Label>
                  <Input
                    id="quote-validity"
                    defaultValue="June 30, 2023"
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quote-notes">Revision Notes</Label>
                <Textarea
                  id="quote-notes"
                  placeholder="Enter any revision notes here..."
                />
              </div>

              <div className="flex space-x-2 justify-end">
                <Button variant="outline">Request Revision</Button>
                <Button variant="outline">Reject Quote</Button>
                <Button>Approve Quote</Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Convert to Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Booking Stage Panel */}
        <TabsContent value="booking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Management</CardTitle>
              <CardDescription>
                Manage booking details and scheduling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="booking-ref">Booking Reference</Label>
                  <Input
                    id="booking-ref"
                    defaultValue="BKG-2023-0042"
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="carrier">Carrier</Label>
                  <Select defaultValue="maersk">
                    <SelectTrigger id="carrier">
                      <SelectValue placeholder="Select carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maersk">Maersk Line</SelectItem>
                      <SelectItem value="msc">MSC</SelectItem>
                      <SelectItem value="cma">CMA CGM</SelectItem>
                      <SelectItem value="cosco">COSCO Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departure-date">Estimated Departure</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="vessel">Vessel/Flight</Label>
                  <Input
                    id="vessel"
                    placeholder="Enter vessel or flight number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Document Checklist</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Commercial Invoice</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>Packing List</span>
                    <Button size="sm" variant="ghost" className="h-6 ml-auto">
                      <Upload className="h-3 w-3 mr-1" /> Upload
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>Bill of Lading</span>
                    <Button size="sm" variant="ghost" className="h-6 ml-auto">
                      <Upload className="h-3 w-3 mr-1" /> Upload
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 justify-end">
                <Button variant="outline">Save Draft</Button>
                <Button>Confirm Booking</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation Stage Panel */}
        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentation Management</CardTitle>
              <CardDescription>
                Manage required shipping documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3">
                    <Label>Required Documents</Label>
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center p-3 border rounded-md">
                        <div className="flex-1">
                          <h4 className="font-medium">Commercial Invoice</h4>
                          <p className="text-sm text-gray-500">
                            Required for customs clearance
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center"
                        >
                          <Upload className="h-4 w-4 mr-1" /> Upload
                        </Button>
                      </div>

                      <div className="flex items-center p-3 border rounded-md">
                        <div className="flex-1">
                          <h4 className="font-medium">Packing List</h4>
                          <p className="text-sm text-gray-500">
                            Details of packaged items
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center"
                        >
                          <Upload className="h-4 w-4 mr-1" /> Upload
                        </Button>
                      </div>

                      <div className="flex items-center p-3 border rounded-md">
                        <div className="flex-1">
                          <h4 className="font-medium">Certificate of Origin</h4>
                          <p className="text-sm text-gray-500">
                            Confirms the country of origin
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center"
                        >
                          <Upload className="h-4 w-4 mr-1" /> Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 justify-end">
                <Button variant="outline">Request Extensions</Button>
                <Button>Submit Documents</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customs Stage Panel */}
        <TabsContent value="customs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customs Clearance</CardTitle>
              <CardDescription>
                Manage customs declarations and clearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customs-broker">Customs Broker</Label>
                  <Select defaultValue="inhouse">
                    <SelectTrigger id="customs-broker">
                      <SelectValue placeholder="Select broker" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inhouse">In-house Broker</SelectItem>
                      <SelectItem value="partner1">Partner Broker A</SelectItem>
                      <SelectItem value="partner2">Partner Broker B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="declaration-number">Declaration Number</Label>
                  <Input
                    id="declaration-number"
                    placeholder="Enter declaration number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customs-notes">Special Instructions</Label>
                <Textarea
                  id="customs-notes"
                  placeholder="Enter any special instructions for customs clearance..."
                />
              </div>

              <div className="space-y-2">
                <Label>Customs Status</Label>
                <Select defaultValue="pending">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Submission</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                    <SelectItem value="additional">
                      Additional Info Requested
                    </SelectItem>
                    <SelectItem value="cleared">Cleared</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2 justify-end">
                <Button variant="outline">Save Draft</Button>
                <Button>Submit Customs Declaration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* In Transit Stage Panel */}
        <TabsContent value="transit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transit Monitoring</CardTitle>
              <CardDescription>
                Track and manage shipment in transit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="current-location">Current Location</Label>
                  <Input
                    id="current-location"
                    defaultValue="Port of Singapore"
                  />
                </div>
                <div>
                  <Label htmlFor="eta">Estimated Time of Arrival</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Transit Status</Label>
                <Select defaultValue="onschedule">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onschedule">On Schedule</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="customs">Held at Customs</SelectItem>
                    <SelectItem value="arrived">
                      Arrived at Destination
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transit-notes">Transit Notes</Label>
                <Textarea
                  id="transit-notes"
                  placeholder="Enter any notes about the transit status..."
                />
              </div>

              <div className="flex space-x-2 justify-end">
                <Button variant="outline">Report Issue</Button>
                <Button variant="outline">Update Location</Button>
                <Button>Update ETA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivered Stage Panel */}
        <TabsContent value="delivered" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Confirmation</CardTitle>
              <CardDescription>
                Confirm delivery and complete shipment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="delivery-date">Delivery Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="received-by">Received By</Label>
                  <Input
                    id="received-by"
                    placeholder="Enter name of receiver"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Proof of Delivery</Label>
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Drag and drop POD document or click to upload
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Upload Document
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-notes">Delivery Notes</Label>
                <Textarea
                  id="delivery-notes"
                  placeholder="Enter any notes about the delivery..."
                />
              </div>

              <div className="flex space-x-2 justify-end">
                <Button variant="outline">Report Issue</Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Confirm Delivery
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatusPanels;
