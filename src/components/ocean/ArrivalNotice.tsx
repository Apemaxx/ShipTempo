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
import { Printer, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface ArrivalNoticeData {
  referenceNo: string;
  date: string;
  masterBLNo: string;
  preparedBy: string;
  subBLNo: string;
  houseBLNo: string;
  shipper: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    tel: string;
  };
  consignee: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    tel: string;
    fax: string;
  };
  notifyParty: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    tel: string;
    fax: string;
    attn: string;
  };
  vessel: {
    name: string;
    voyage: string;
  };
  portOfLoading: string;
  etd: string;
  portOfDischarge: string;
  eta: string;
  placeOfDelivery: string;
  finalDestination: string;
  freightLocation: {
    name: string;
    tel: string;
  };
  containerReturnLocation: string;
  firmCode: string;
  availableDate: string;
  lastFreeDate: string;
  goDate: string;
  container: {
    containerNo: string;
    sealNo: string;
    type: string;
  };
  cargo: {
    marks: string;
    description: string;
    packages: number;
    packageType: string;
    weight: {
      kg: number;
      lbs: number;
    };
    measurement: {
      cbm: number;
      cft: number;
    };
  };
  remarks: string;
  amsBLNo: string;
  customerRefNo: string;
  broker: string;
  invoiceNo: string;
  invoiceDate: string;
  invoiceAmount: number;
  invoiceCurrency: string;
}

interface ArrivalNoticeProps {
  data: ArrivalNoticeData;
  onPrint?: () => void;
  onDownload?: () => void;
}

const ArrivalNotice: React.FC<ArrivalNoticeProps> = ({
  data,
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
          <div className="flex items-center">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=amass"
              alt="Amass Logo"
              className="h-10 w-10 mr-2"
            />
            <div>
              <CardTitle className="text-xl font-bold">
                ARRIVAL NOTICE WITH ATTACHED INVOICE
              </CardTitle>
              <CardDescription>Amass Global Network (US) Inc.</CardDescription>
            </div>
          </div>
          <div className="text-sm text-right">
            <p>13191 Crossroads Parkway North, #255</p>
            <p>City of Industry, CA 91746-3441</p>
            <p>TEL: 562-222-7755 X-7505 FAX: 562-222-7700</p>
            <p>EMAIL: jim@amassgroup.com</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 divide-y border-b">
          {/* Shipper Section */}
          <div className="grid grid-cols-2 divide-x">
            <div className="p-4">
              <h3 className="font-bold mb-2">SHIPPER</h3>
              <div className="text-sm space-y-1">
                <p className="font-semibold">{data.shipper.name}</p>
                <p>{data.shipper.address}</p>
                <p>
                  {data.shipper.city}, {data.shipper.state} {data.shipper.zip}
                </p>
                <p>{data.shipper.country}</p>
                <p>TEL: {data.shipper.tel}</p>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between">
                <div>
                  <span className="font-semibold mr-2">REFERENCE NO:</span>
                  <span>{data.referenceNo}</span>
                </div>
                <div>
                  <span className="font-semibold mr-2">DATE:</span>
                  <span>{data.date}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="font-semibold mr-2">MASTER B/L NO:</span>
                  <span>{data.masterBLNo}</span>
                </div>
                <div>
                  <span className="font-semibold mr-2">PREPARED BY:</span>
                  <span>{data.preparedBy}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="font-semibold mr-2">SUB B/L NO:</span>
                  <span>{data.subBLNo}</span>
                </div>
                <div>
                  <span className="font-semibold mr-2">HOUSE B/L NO:</span>
                  <span>{data.houseBLNo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Consignee Section */}
          <div className="grid grid-cols-2 divide-x">
            <div className="p-4">
              <h3 className="font-bold mb-2">CONSIGNEE</h3>
              <div className="text-sm space-y-1">
                <p className="font-semibold">{data.consignee.name}</p>
                <p>{data.consignee.address}</p>
                <p>
                  {data.consignee.city}, {data.consignee.state}{" "}
                  {data.consignee.zip}
                </p>
                <p>{data.consignee.country}</p>
                <p>
                  TEL: {data.consignee.tel} FAX: {data.consignee.fax}
                </p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-2">NOTIFY PARTY</h3>
              <div className="text-sm space-y-1">
                <p className="font-semibold">{data.notifyParty.name}</p>
                <p>{data.notifyParty.address}</p>
                <p>
                  {data.notifyParty.city}, {data.notifyParty.state}{" "}
                  {data.notifyParty.zip} {data.notifyParty.country}
                </p>
                <p>ATTN: {data.notifyParty.attn}</p>
                <p>
                  TEL: {data.notifyParty.tel} FAX: {data.notifyParty.fax}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="grid grid-cols-2 divide-x">
            <div className="p-4 grid grid-cols-2 gap-2">
              <div>
                <p className="font-semibold">AMS B/L No:</p>
                <p>{data.amsBLNo}</p>
              </div>
              <div>
                <p className="font-semibold">CUSTOMER REF. NO:</p>
                <p>{data.customerRefNo}</p>
              </div>
              <div>
                <p className="font-semibold">VESSEL & VOY NO:</p>
                <p>
                  {data.vessel.name} {data.vessel.voyage}
                </p>
              </div>
              <div>
                <p className="font-semibold">BROKER:</p>
                <p>{data.broker}</p>
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              <div>
                <p className="font-semibold">PORT OF LOADING:</p>
                <p>{data.portOfLoading}</p>
              </div>
              <div>
                <p className="font-semibold">ETD:</p>
                <p>{data.etd}</p>
              </div>
              <div>
                <p className="font-semibold">PORT OF DISCHARGE:</p>
                <p>{data.portOfDischarge}</p>
              </div>
              <div>
                <p className="font-semibold">ETA:</p>
                <p>{data.eta}</p>
              </div>
              <div>
                <p className="font-semibold">PLACE OF DELIVERY:</p>
                <p>{data.placeOfDelivery}</p>
              </div>
              <div>
                <p className="font-semibold">FINAL DESTINATION:</p>
                <p>{data.finalDestination}</p>
              </div>
            </div>
          </div>

          {/* Freight Location */}
          <div className="grid grid-cols-2 divide-x">
            <div className="p-4">
              <h3 className="font-bold mb-2">FREIGHT LOCATION</h3>
              <div className="text-sm">
                <p>{data.freightLocation.name}</p>
                <p>TEL: {data.freightLocation.tel}</p>
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              <div>
                <p className="font-semibold">FIRM CODE:</p>
                <p>{data.firmCode}</p>
              </div>
              <div>
                <p className="font-semibold">AVAILABLE DATE:</p>
                <p>{data.availableDate}</p>
              </div>
              <div>
                <p className="font-semibold">CONTAINER RETURN LOCATION:</p>
                <p>{data.containerReturnLocation}</p>
              </div>
              <div>
                <p className="font-semibold">LAST FREE DATE:</p>
                <p>{data.lastFreeDate}</p>
              </div>
              <div>
                <p className="font-semibold">G.O. DATE:</p>
                <p>{data.goDate}</p>
              </div>
            </div>
          </div>

          {/* Container and Cargo Details */}
          <div className="p-4">
            <h3 className="font-bold text-center bg-black text-white py-1 mb-4">
              PARTICULARS FURNISHED BY SHIPPER
            </h3>
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div className="col-span-2">
                <p className="font-semibold">CONTAINER NO./SEAL NO.:</p>
                <p>
                  {data.container.containerNo} / {data.container.type} /
                </p>
              </div>
              <div>
                <p className="font-semibold">MARKS & NOS.:</p>
                <p>{data.cargo.marks}</p>
              </div>
              <div>
                <p className="font-semibold">NO. OF PKGS.:</p>
                <p>
                  {data.cargo.packages} {data.cargo.packageType}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-semibold">
                  DESCRIPTION OF PACKAGES AND GOODS:
                </p>
                <p>{data.cargo.description}</p>
              </div>
              <div>
                <p className="font-semibold">GROSS WEIGHT:</p>
                <p>{data.cargo.weight.kg} KGS</p>
                <p>{data.cargo.weight.lbs} LBS</p>
              </div>
              <div>
                <p className="font-semibold">MEASUREMENT:</p>
                <p>{data.cargo.measurement.cbm} CBM</p>
                <p>{data.cargo.measurement.cft} CFT</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-semibold text-center text-red-600">
                "ORIGINAL B/L REQUIRED"
              </p>
              <p className="text-center">CFS/CFS</p>
            </div>
          </div>

          {/* Remarks */}
          <div className="p-4">
            <h3 className="font-bold mb-2">REMARK:</h3>
            <p className="text-red-600">{data.remarks}</p>
          </div>

          {/* Instructions */}
          <div className="p-4">
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>
                Please present cashier / broker's check or money order only and
                payable to " Amass Global Network (US) Inc.". Personal and
                Company's checks are NOT accepted. We also accept wire transfer
                - Please contact our accounting for wire procedures.
              </li>
              <li>For cargo release, e-mail: lax.cashier@amassgroup.com</li>
              <li>
                Please allow 24 hours for release of cargo upon presentation of
                original check and properly endorsed original bill of lading.
              </li>
              <li>
                Please confirm cargo release with the cfs/pier prior to pick up.
                All shipments must be customs cleared and picked up within the
                free time allowance to avoid unnecessary additional charges.
              </li>
              <li>
                Storage accrued after last free days and cargo sent to general
                order (G.O.) 15 days after arrival if not customs cleared.
              </li>
              <li>
                Be advised that the warehouse charges are for the account of the
                importer/consignee to whom the cargo is released.
              </li>
              <li>
                Any additional charges incurred shall be the full responsibility
                of the importer/consignee.
              </li>
            </ol>
          </div>

          {/* Invoice Information */}
          <div className="p-4 bg-gray-50">
            <p className="text-center font-bold">
              ** SEE ATTACHED INVOICE (INV NO. {data.invoiceNo} DATED{" "}
              {data.invoiceDate}) **
            </p>
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
        <Button variant="outline">
          <ExternalLink className="mr-2 h-4 w-4" />
          Track Shipment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArrivalNotice;
