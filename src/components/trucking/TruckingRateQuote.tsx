import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Download,
  Printer,
  Calendar,
  Clock,
  Truck,
} from "lucide-react";

interface QuoteDetails {
  quoteId: string;
  quoteDate: string;
  pickupDate: string;
  estimatedDelivery: string;
  carrier: string;
  mode: string;
}

interface ShipperInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  contact?: string;
}

interface PackageInfo {
  units: number;
  description: string;
  dimensions: string;
  freightClass: string;
  weight: string;
  hazardousMaterial?: boolean;
}

interface CostBreakdown {
  linehaul: number;
  fuel: number;
  geographicSurcharge: number;
  accessorials?: { [key: string]: number };
  total: number;
}

interface TruckingRateQuoteProps {
  quoteDetails: QuoteDetails;
  shipperInfo: ShipperInfo;
  consigneeInfo: ShipperInfo;
  packageInfo: PackageInfo[];
  costBreakdown: CostBreakdown;
  remarks?: string[];
  onAccept?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
}

const TruckingRateQuote: React.FC<Partial<TruckingRateQuoteProps>> = ({
  quoteDetails = {
    quoteId: "DDQ " + Math.floor(Math.random() * 100000000),
    quoteDate: new Date().toLocaleDateString(),
    pickupDate: new Date(Date.now() + 86400000).toLocaleDateString(), // Tomorrow
    estimatedDelivery: new Date(Date.now() + 86400000 * 5).toLocaleDateString(), // 5 days from now
    carrier: "FORWARD AIR LLC",
    mode: "LTL",
  },
  shipperInfo = {
    name: "O&M Halyard Exports Department",
    address: "228 Access Drive",
    city: "SOUTHAVEN",
    state: "MS",
    zip: "38671",
  },
  consigneeInfo = {
    name: "Amass c/o SEABOARD MARINE LTD",
    address: "8001 NW 79TH AVE",
    city: "MIAMI",
    state: "FL",
    zip: "33166",
  },
  packageInfo = [
    {
      units: 10,
      description: "MEDICAL SUPPLIES",
      dimensions: "40x48x60 in",
      freightClass: "175",
      weight: "2,707lbs",
      hazardousMaterial: false,
    },
  ],
  costBreakdown = {
    linehaul: 825.24,
    fuel: 255.82,
    geographicSurcharge: 0,
    total: 1081.06,
  },
  remarks = [
    "Final charges may vary from quoted amounts based on individual carrier cost not reflected at the time of booking.",
    "Quote is valid on day of generation. Quote should only be used to estimate rates and may differ at the time of shipment booking.",
    "Rates are based on information provided by customer. Any changes in weights, dimensions or required accessorials may result in additional charges.",
    "Fuel surcharge changes weekly and will be based on current rates at time of load.",
    "All shipments must be securely packaged in a pallet, crate, or other type of container appropriate for non air-ride common carrier LTL service.",
    "The delivery dates provided are not guaranteed, but rather estimates only.",
    "Transit estimates do not include weekends, holidays, or day of loading.",
    "Pallets that exceed 2,000 lbs. may have additional charges associated.",
    'Volume shipments (over 6 standard-sized (48" x 40" x 96") pallet space, more than 6,000 total lbs, 750 cubic feet or 12 linear feet) and any shipments requiring expedited or guaranteed service - must be be spot quoted.',
    "Rates valid for Dock to Dock delivery only; if Residential additional surcharge applies.",
    "Rates valid for Stackable cargo only.",
    "Additional surcharges will apply for: Residential area, Lift Gate required, Appointment required, Limited Access, special equipment required, non-stackable, etc.",
    "Inaccurate dimensions, weight, class, or cubic foot rules may lead to additional charges.",
  ],
  onAccept,
  onPrint,
  onDownload,
}) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
    // Default download functionality could be implemented here
  };

  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">
              Door Delivery Quote
            </CardTitle>
            <CardDescription>Quote ID: {quoteDetails.quoteId}</CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center mb-1">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=amass"
                alt="Amass Logo"
                className="h-10 w-10 mr-2"
              />
              <span className="font-bold">Amass Global Network (US) Inc</span>
            </div>
            <div className="text-sm text-gray-500">
              13791 Crossroads Parkway N Suite 255
            </div>
            <div className="text-sm text-gray-500">
              CITY OF INDUSTRY, CA 91746
            </div>
            <div className="text-sm text-gray-500">Phone: (562) 222-7755</div>
            <div className="text-sm text-gray-500">
              Email: quotes@tms-amassfreight.com
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Customer</h3>
              <div className="text-sm">
                <p>AGN Colombia</p>
                <p>Carrera 7 #114-33</p>
                <p>Oficina 802</p>
                <p>Bogota</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Quote Date</h3>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{quoteDetails.quoteDate}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Quote ID</h3>
                <div>{quoteDetails.quoteId}</div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pickup Date</h3>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{quoteDetails.pickupDate}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Est. Delivery</h3>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{quoteDetails.estimatedDelivery}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Shipper Information</h3>
              <div className="text-sm">
                <p>{shipperInfo.name}</p>
                <p>{shipperInfo.address}</p>
                <p>
                  {shipperInfo.city}, {shipperInfo.state} {shipperInfo.zip}
                </p>
                {shipperInfo.contact && <p>{shipperInfo.contact}</p>}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Consignee Information</h3>
              <div className="text-sm">
                <p>{consigneeInfo.name}</p>
                <p>{consigneeInfo.address}</p>
                <p>
                  {consigneeInfo.city}, {consigneeInfo.state}{" "}
                  {consigneeInfo.zip}
                </p>
                {consigneeInfo.contact && <p>{consigneeInfo.contact}</p>}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Shipping Details</h3>
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-1" />
                <span className="mr-2">{quoteDetails.carrier}</span>
                <Badge variant="outline">{quoteDetails.mode}</Badge>
              </div>
            </div>
            <div className="border rounded-md">
              <div className="grid grid-cols-5 bg-gray-100 p-2 text-sm font-semibold">
                <div>Shipping Units</div>
                <div>HM*</div>
                <div className="col-span-2">Description</div>
                <div>Class</div>
              </div>
              {packageInfo.map((pkg, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 p-2 text-sm border-t"
                >
                  <div>{pkg.units}</div>
                  <div>{pkg.hazardousMaterial ? "Yes" : ""}</div>
                  <div className="col-span-2">
                    {pkg.description} {pkg.dimensions}
                  </div>
                  <div>{pkg.freightClass}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-500 flex items-center">
              <div className="flex-1">
                <span className="font-semibold">Mode:</span> {quoteDetails.mode}
              </div>
              <div>
                <span className="font-semibold">
                  REQUIRED FOR BOOKING/BILLING/DIGITAL POD
                </span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <div className="inline-block bg-gray-200 p-2 rounded">
                *{quoteDetails.quoteId.replace("DDQ ", "")}*
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Cost Breakdown</h3>
            <div className="border rounded-md">
              <div className="grid grid-cols-2 p-3 border-b">
                <div>Fuel</div>
                <div className="text-right">
                  {formatCurrency(costBreakdown.fuel)}
                </div>
              </div>
              <div className="grid grid-cols-2 p-3 border-b">
                <div>Linehaul</div>
                <div className="text-right">
                  {formatCurrency(costBreakdown.linehaul)}
                </div>
              </div>
              <div className="grid grid-cols-2 p-3 border-b">
                <div>Geographic Linehaul Surcharge - Rating</div>
                <div className="text-right">
                  {formatCurrency(costBreakdown.geographicSurcharge)}
                </div>
              </div>
              {costBreakdown.accessorials &&
                Object.entries(costBreakdown.accessorials).map(
                  ([key, value]) => (
                    <div key={key} className="grid grid-cols-2 p-3 border-b">
                      <div>{key}</div>
                      <div className="text-right">{formatCurrency(value)}</div>
                    </div>
                  ),
                )}
              <div className="grid grid-cols-2 p-3 bg-gray-50 font-semibold">
                <div>Total:</div>
                <div className="text-right">
                  {formatCurrency(costBreakdown.total)}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
              onClick={handleAccept}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              ACCEPT QUOTE
            </Button>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Important remarks:</h3>
            <ul className="text-xs space-y-1 list-disc pl-5">
              {remarks.map((remark, index) => (
                <li key={index}>{remark}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end space-x-2 pt-4 border-t print:hidden">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TruckingRateQuote;
