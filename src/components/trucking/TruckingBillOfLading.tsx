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
import { Printer, Download, CheckCircle } from "lucide-react";

interface ShipmentDetails {
  date: string;
  reference: string;
  poNumber: string;
  packages: number;
  weight: string;
  additionalInfo: string;
}

interface ShipperInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  contact: string;
}

interface CarrierInfo {
  name: string;
  proNumber: string;
}

interface PackageInfo {
  quantity: number;
  type: string;
  weight: string;
  description: string;
  dimensions: string;
  nmfcNumber: string;
  freightClass: string;
}

interface TruckingBillOfLadingProps {
  shipmentDetails: ShipmentDetails;
  shipperInfo: ShipperInfo;
  consigneeInfo: ShipperInfo;
  thirdPartyInfo?: ShipperInfo;
  carrierInfo: CarrierInfo;
  packageInfo: PackageInfo[];
  specialInstructions?: string;
  serviceLevel?: string;
  onPrint?: () => void;
  onDownload?: () => void;
}

const TruckingBillOfLading: React.FC<Partial<TruckingBillOfLadingProps>> = ({
  shipmentDetails = {
    date: new Date().toLocaleDateString(),
    reference: "REF-" + Math.floor(Math.random() * 10000000),
    poNumber: "PO-" + Math.floor(Math.random() * 10000),
    packages: 10,
    weight: "2,707 lbs",
    additionalInfo: "PALLET / SLIP",
  },
  shipperInfo = {
    name: "O&M Halyard Exports Department",
    address: "228 Access Drive",
    city: "SOUTHAVEN",
    state: "MS",
    zip: "38671",
    contact: "Adrienne Crawford, CSR",
  },
  consigneeInfo = {
    name: "Amass c/o SEABOARD MARINE LTD",
    address: "8001 NW 79TH AVE",
    city: "MIAMI",
    state: "FL",
    zip: "33166",
    contact: "Leda Gueda-(305) 853-4646",
  },
  thirdPartyInfo = {
    name: "Amass Global Network (US) Inc",
    address: "13791 Crossroads Parkway N Suite 255",
    city: "CITY OF INDUSTRY",
    state: "CA",
    zip: "91746",
    contact: "support@tms-amassfreight.com",
  },
  carrierInfo = {
    name: "FORWARD AIR LLC",
    proNumber: "PRO-" + Math.floor(Math.random() * 10000000),
  },
  packageInfo = [
    {
      quantity: 10,
      type: "Pallet",
      weight: "2,707 lbs",
      description: "MEDICAL SUPPLIES",
      dimensions: "40x48x60in",
      nmfcNumber: "",
      freightClass: "175",
    },
  ],
  specialInstructions = "*Please advise your driver to ask for shipment number coming in for pick-up to ensure we load the correct product.",
  serviceLevel = "Normal",
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

  return (
    <Card className="w-full bg-white border-0 shadow-none print:shadow-none">
      <CardHeader className="border-b pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            BILL OF LADING / DELIVERY ORDER
          </CardTitle>
          <div className="text-sm">Date: {shipmentDetails.date}</div>
        </div>
        <CardDescription>Page: _______</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 divide-y border-b">
          {/* Ship From Section */}
          <div className="grid grid-cols-2 divide-x">
            <div className="p-4">
              <h3 className="font-bold text-center bg-black text-white py-1 mb-2">
                SHIP FROM
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-semibold">{shipperInfo.name}</p>
                <p>{shipperInfo.address}</p>
                <p>
                  {shipperInfo.city}, {shipperInfo.state} {shipperInfo.zip}
                </p>
                <p>{shipperInfo.contact}</p>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center">
                <span className="font-semibold mr-2">DDQ BOL:</span>
                <span>{shipmentDetails.reference}</span>
                <div className="ml-auto">
                  <div className="h-8 w-32 bg-gray-200">Barcode</div>
                </div>
              </div>
              <div>
                <span className="font-semibold mr-2">Reference Number:</span>
                <span>{shipmentDetails.reference.split("-")[1]}</span>
              </div>
              <div>
                <span className="font-semibold mr-2">
                  Purchase Order Number:
                </span>
                <span>{shipmentDetails.poNumber}</span>
              </div>
            </div>
          </div>

          {/* Ship To Section */}
          <div className="grid grid-cols-2 divide-x">
            <div className="p-4">
              <h3 className="font-bold text-center bg-black text-white py-1 mb-2">
                SHIP TO
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-semibold">{consigneeInfo.name}</p>
                <p>{consigneeInfo.address}</p>
                <p>
                  {consigneeInfo.city}, {consigneeInfo.state}{" "}
                  {consigneeInfo.zip}
                </p>
                <p>{consigneeInfo.contact}</p>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div>
                <span className="font-semibold mr-2">DELIVERY ORDER:</span>
                <span>- AMIG: {shipmentDetails.reference}</span>
              </div>
              <div>
                <span className="font-semibold mr-2">HBL:</span>
                <span>{shipmentDetails.poNumber}</span>
              </div>
              <div>
                <span className="font-semibold mr-2">FILE:</span>
                <span>{shipmentDetails.poNumber}</span>
              </div>
              <div>
                <span className="font-semibold mr-2">AGENT:</span>
                <span>AGN Colombia</span>
              </div>
              <div>
                <span className="font-semibold mr-2">Quote ID Number:</span>
                <span></span>
              </div>
            </div>
          </div>

          {/* Third Party Section */}
          <div className="grid grid-cols-2 divide-x">
            <div className="p-4">
              <h3 className="font-bold text-center bg-black text-white py-1 mb-2">
                THIRD PARTY FREIGHT CHARGES BILL TO
              </h3>
              <div className="text-sm space-y-1">
                {thirdPartyInfo && (
                  <>
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {thirdPartyInfo.name}
                    </p>
                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {thirdPartyInfo.address}
                    </p>
                    <p>
                      <span className="font-semibold">City/State/Zip:</span>{" "}
                      {thirdPartyInfo.city}, {thirdPartyInfo.state},{" "}
                      {thirdPartyInfo.zip}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {thirdPartyInfo.contact}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div>
                <span className="font-semibold mr-2">Carrier Name:</span>
                <span>{carrierInfo.name}</span>
              </div>
              <div>
                <span className="font-semibold mr-2">PRO (Tracking):</span>
                <span>{carrierInfo.proNumber}</span>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex-1">
                  <span className="font-semibold mr-2">
                    Freight charge terms:
                  </span>
                  <span>3rd Party</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" checked />
                  <span className="text-sm">(check box)</span>
                </div>
              </div>
              <div>
                <span className="font-semibold mr-2">
                  Master Bill of Lading:
                </span>
                <span>with attached underlaying Bill of Lading</span>
              </div>
            </div>
          </div>

          {/* Instructions Section */}
          <div className="p-4 grid grid-cols-1 gap-2">
            <div>
              <span className="font-semibold">ORIGIN INSTRUCTIONS:</span>
              <span className="ml-2">{specialInstructions}</span>
            </div>
            <div>
              <span className="font-semibold">DESTINATION INSTRUCTIONS:</span>
              <span className="ml-2">
                Amass Shipment: {shipmentDetails.poNumber}
              </span>
            </div>
            <div>
              <span className="font-semibold">SERVICE LEVEL:</span>
              <span className="ml-2">{serviceLevel}</span>
            </div>
            <div>
              <span className="font-semibold">NOTES:</span>
              <span className="ml-2">
                Amass Shipment: {shipmentDetails.poNumber}
              </span>
            </div>
          </div>

          {/* Customer Order Information */}
          <div>
            <h3 className="font-bold text-center bg-black text-white py-1">
              CUSTOMER ORDER INFORMATION
            </h3>
            <div className="grid grid-cols-4 divide-x text-center py-2">
              <div className="font-semibold">CUSTOMER PO NUMBER</div>
              <div className="font-semibold">#PKGS</div>
              <div className="font-semibold">WEIGHT</div>
              <div className="font-semibold">ADDITIONAL SHIPPER INFO</div>
            </div>
            <div className="grid grid-cols-4 divide-x text-center py-2 border-t">
              <div>{shipmentDetails.poNumber}</div>
              <div>{shipmentDetails.packages}</div>
              <div>{shipmentDetails.weight}</div>
              <div>{shipmentDetails.additionalInfo}</div>
            </div>
          </div>

          {/* Carrier Information */}
          <div>
            <h3 className="font-bold text-center bg-black text-white py-1">
              CARRIER INFORMATION
            </h3>
            <div className="grid grid-cols-7 divide-x text-center py-2 text-xs">
              <div className="col-span-2 font-semibold">HANDLING UNIT</div>
              <div className="col-span-2 font-semibold">PACKAGE</div>
              <div className="font-semibold">WEIGHT</div>
              <div className="font-semibold">H.M. (X)</div>
              <div className="font-semibold">COMMODITY DESCRIPTION</div>
            </div>
            <div className="grid grid-cols-7 divide-x text-center border-t">
              <div className="col-span-2 grid grid-cols-2 divide-x">
                <div className="py-2">QTY</div>
                <div className="py-2">TYPE</div>
              </div>
              <div className="col-span-2 grid grid-cols-2 divide-x">
                <div className="py-2">QTY</div>
                <div className="py-2">TYPE</div>
              </div>
              <div className="py-2"></div>
              <div className="py-2"></div>
              <div className="py-2 text-xs px-1">
                Commodities requiring special or additional care or attention in
                handling or stowing must be so marked and packaged as to ensure
                safe transportation with ordinary care. See Section 2(e) of NMFC
                Item 360
              </div>
            </div>

            {packageInfo.map((pkg, index) => (
              <div
                key={index}
                className="grid grid-cols-7 divide-x text-center border-t"
              >
                <div className="col-span-2 grid grid-cols-2 divide-x">
                  <div className="py-2">{pkg.quantity}</div>
                  <div className="py-2">{pkg.type}</div>
                </div>
                <div className="col-span-2 grid grid-cols-2 divide-x">
                  <div className="py-2">{shipmentDetails.packages}</div>
                  <div className="py-2">PCS</div>
                </div>
                <div className="py-2">{pkg.weight}</div>
                <div className="py-2"></div>
                <div className="py-2 text-left px-2">
                  {pkg.description} {pkg.dimensions}
                </div>
              </div>
            ))}

            <div className="grid grid-cols-6 divide-x text-center border-t">
              <div className="col-span-5"></div>
              <div className="py-2 text-xs px-1 text-left">
                <div className="font-semibold">LTL ONLY</div>
                <div className="grid grid-cols-2 divide-x">
                  <div>NMFC#</div>
                  <div>CLASS#</div>
                </div>
                <div className="grid grid-cols-2 divide-x border-t">
                  <div></div>
                  <div>{packageInfo[0]?.freightClass}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="p-4 text-xs">
            <p className="font-semibold">
              NOTE Liability Limitation for loss or damage in this shipment may
              be applicable. See 49 U.S.C 14706(c)(1)(A) and (B).
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs">
                  RECEIVED, subject to individually determined rates or
                  contracts that have been agreed upon in writing between the
                  carrier and shipper, if applicable, otherwise to the rates,
                  classifications and rules that have been established by the
                  carrier and are available to the shipper, on request, and to
                  all applicable state and federal regulations.
                </p>
              </div>
              <div>
                <p className="text-xs">
                  The carrier shall not make delivery of this shipment without
                  payment of freight and all other lawful charges.
                </p>
                <div className="mt-2 border-t pt-2">
                  <p>Shipper Signature</p>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-2 divide-x">
            <div className="p-4">
              <h3 className="font-bold">SHIPPER SIGNATURE / DATE</h3>
              <p className="text-xs mt-2">
                This is to certify that the above named materials are properly
                classified, described, packaged, marked and labeled, and are in
                proper condition for transportation according to the applicable
                regulation of the Department of Transportation.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="font-semibold">Trailer loaded:</p>
                  <div className="flex items-center mt-1">
                    <input type="checkbox" className="mr-2" />
                    <span>By Shipper</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <input type="checkbox" className="mr-2" />
                    <span>By Driver</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">Freight Counted:</p>
                  <div className="flex items-center mt-1">
                    <input type="checkbox" className="mr-2" />
                    <span>By Shipper</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <input type="checkbox" className="mr-2" />
                    <span>By Driver/pallets said to contain</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <input type="checkbox" className="mr-2" />
                    <span>By Driver/pieces</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold">CARRIER SIGNATURE / PICKUP DATE</h3>
              <p className="text-xs mt-2">
                Carrier acknowledges receipt of packages and required placards.
                Carrier certifies emergency response information was made
                available and/or carrier has the Department of Transportation
                emergency response guidebook or equivalent documentation in the
                vehicle.
              </p>
              <div className="mt-8 border-t pt-2">
                <p>
                  Property described above is received in good order, except as
                  noted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end space-x-2 pt-4 print:hidden">
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

export default TruckingBillOfLading;
