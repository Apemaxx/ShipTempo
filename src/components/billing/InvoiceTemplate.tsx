import React from "react";
import { Invoice, InvoiceItem } from "@/types/billing";
import { cn } from "@/lib/utils";

interface InvoiceTemplateProps {
  invoice: Invoice;
  companyLogo?: string;
  companyName?: string;
  companyAddress?: string;
  companyContact?: string;
  fmcNumber?: string;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  invoice,
  companyLogo = "/amass_logo.svg",
  companyName = "Amass Global Network (US) Inc.",
  companyAddress = "123 Shipping Lane, Suite 100, Port City, FL 33101, USA",
  companyContact = "TEL: +1 (305) 555-1234",
  fmcNumber = "FMC NO.: 028730NF",
}) => {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div className="flex items-center space-x-4">
          <img src={companyLogo} alt="Company Logo" className="h-12 w-auto" />
          <div>
            <h1 className="text-2xl font-bold text-blue-900">{companyName}</h1>
            <p className="text-sm text-gray-600">{fmcNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-blue-900">BILL OF LADING</h2>
          <p className="text-sm text-gray-600">
            PORT-TO-PORT OF COMBINED TRANSPORT
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-4 border-b pb-6 mb-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
              EXPORTER
            </div>
            <div className="p-3">
              <p className="font-semibold">{invoice.customerName}</p>
              <p className="text-sm">123 Customer Road</p>
              <p className="text-sm">Customer City, State 12345</p>
              <p className="text-sm">TEL: {companyContact}</p>
            </div>
          </div>

          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
              CONSIGNEE TO
            </div>
            <div className="p-3">
              <p className="text-sm">{invoice.customerName}</p>
              <p className="text-sm">456 Consignee Street</p>
              <p className="text-sm">Destination City, Country</p>
            </div>
          </div>

          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
              NOTIFY PARTY / INTERMEDIATE CONSIGNEE
            </div>
            <div className="p-3">
              <p className="text-sm">{invoice.customerName}</p>
              <p className="text-sm">456 Consignee Street</p>
              <p className="text-sm">Destination City, Country</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-300">
              <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
                BOOKING NUMBER
              </div>
              <div className="p-3 text-sm">{invoice.invoiceNumber}</div>
            </div>
            <div className="border border-gray-300">
              <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
                BILL OF LADING NUMBER
              </div>
              <div className="p-3 text-sm">BOL{invoice.invoiceNumber}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-300">
              <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
                CONSOLIDATION NUMBER
              </div>
              <div className="p-3 text-sm">CON{invoice.id.substring(0, 8)}</div>
            </div>
            <div className="border border-gray-300">
              <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
                CONTAINER NUMBER
              </div>
              <div className="p-3 text-sm">
                CONT{invoice.id.substring(0, 8)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-300">
              <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
                EXPORT REFERENCES
              </div>
              <div className="p-3 text-sm">REF{invoice.shipmentId}</div>
            </div>
            <div className="border border-gray-300">
              <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
                SHIPPERS REFERENCES
              </div>
              <div className="p-3 text-sm"></div>
            </div>
          </div>

          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
              FORWARDING AGENT REFERENCES
            </div>
            <div className="p-3 text-sm"></div>
          </div>
        </div>
      </div>

      {/* Shipping Details */}
      <div className="grid grid-cols-2 gap-4 border-b pb-6 mb-6">
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
              *PRE-CARRIAGE BY
            </div>
            <div className="p-3 text-sm"></div>
          </div>
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
              *PLACE OF RECEIPT BY PRE-CARRIER
            </div>
            <div className="p-3 text-sm"></div>
          </div>
        </div>

        <div className="border border-gray-300">
          <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
            DESTINATION AGENT
          </div>
          <div className="p-3 text-sm">
            <p>For deliver the goods.</p>
            <p>AMASS GLOBAL NETWORK</p>
            <p>Destination Office</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-b pb-6 mb-6">
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
              VESSEL / VOYAGE
            </div>
            <div className="p-3 text-sm">VESSEL NAME</div>
          </div>
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
              PORT OF LOADING/EXPORT
            </div>
            <div className="p-3 text-sm">MIAMI, FL</div>
          </div>
        </div>

        <div className="border border-gray-300">
          <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
            LOADING PIER/TERMINAL
          </div>
          <div className="p-3 text-sm"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-b pb-6 mb-6">
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
              FOREIGN PORT OF UNLOADING
            </div>
            <div className="p-3 text-sm">DESTINATION PORT</div>
          </div>
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
              *PLACE OF DELIVERY BY ON-CARRIER
            </div>
            <div className="p-3 text-sm"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
              TYPE OF MOVE
            </div>
            <div className="p-3 text-sm">CONTAINERIZED</div>
          </div>
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 text-xs font-semibold">
              DOOR/CFS
            </div>
            <div className="p-3 flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm mr-2">Yes</span>
                <div className="h-4 w-4 border border-gray-400"></div>
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2">No</span>
                <div className="h-4 w-4 border border-gray-400 flex items-center justify-center">
                  <span className="text-xs">X</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cargo Details */}
      <div className="border border-gray-300 mb-6">
        <div className="grid grid-cols-12 bg-gray-100 text-xs font-semibold">
          <div className="col-span-2 px-3 py-1 border-r border-gray-300">
            MARKS AND NUMBERS
          </div>
          <div className="col-span-1 px-3 py-1 border-r border-gray-300">
            NO. OF PKGS
          </div>
          <div className="col-span-5 px-3 py-1 border-r border-gray-300">
            DESCRIPTION OF PACKAGES AND GOODS
          </div>
          <div className="col-span-2 px-3 py-1 border-r border-gray-300">
            GROSS WEIGHT
          </div>
          <div className="col-span-2 px-3 py-1">MEASUREMENT</div>
        </div>

        <div className="grid grid-cols-12 min-h-[200px]">
          <div className="col-span-2 p-3 border-r border-gray-300"></div>
          <div className="col-span-1 p-3 border-r border-gray-300 text-sm">
            2 SKIDS
          </div>
          <div className="col-span-5 p-3 border-r border-gray-300 text-sm">
            <p>SAID TO CONTAIN:</p>
            {invoice.items.map((item, index) => (
              <p key={index}>{item.description}</p>
            ))}
            <div className="mt-8 text-center">
              <p className="text-xl font-bold text-red-500 opacity-30">
                ORIGINAL
              </p>
            </div>
          </div>
          <div className="col-span-2 p-3 border-r border-gray-300 text-sm">
            <p>287 KGS</p>
            <p>633 LBS</p>
          </div>
          <div className="col-span-2 p-3 text-sm">
            <p>3.670 CBM</p>
            <p>130 CFT</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-xs">
          <p>
            THESE COMMODITIES, TECHNOLOGY OR SOFTWARE WERE EXPORTED FROM THE
            UNITED STATES IN ACCORDANCE WITH THE
          </p>
          <p>
            EXPORT ADMINISTRATION REGULATIONS. DIVERSION CONTRARY TO U.S. LAW
            PROHIBITED.
          </p>
        </div>
        <div></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 border-t pt-4">
        <div className="text-xs">
          <p>
            *APPLICABLE ONLY WHEN DOCUMENT USED AS COMBINED TRANSPORT BILL OF
            LADING
          </p>
        </div>
        <div className="text-xs">
          <p>DECLARED VALUE (FOR AS VALOREM PURPOSE ONLY).</p>
          <p>(REFER TO CLAUSE 26 ON REVERSE HEREOF) IN US$</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 border-t pt-4">
        <div className="text-xs">
          <p>DESCRIPTION OF CHARGES</p>
        </div>
        <div className="text-xs">
          <p>FREIGHT AND CHARGES / REVENUE TONS RATE PER</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>PREPAID</div>
          <div>COLLECT</div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm font-medium">Freight Collect As Arranged.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="text-xs">
          <p>BY: AUTHORIZED AGENT FOR CARRIER</p>
          <p className="font-medium mt-1">AS AGENT FOR,THE CARRIER,</p>
        </div>
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div>
            <p>TOTAL PREPAID</p>
            <div className="h-6"></div>
          </div>
          <div>
            <p>TOTAL COLLECT</p>
            <div className="h-6"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-xs">
          <p>DATE & PLACE ISSUED</p>
          <p className="mt-1">{invoice.issueDate}</p>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
