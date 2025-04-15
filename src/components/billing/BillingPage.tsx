import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BillingCodes from "./BillingCodes";
import BillingInvoicesForm from "./BillingInvoicesForm";
import CreditMemosForm from "./CreditMemosForm";
import {
  FileText,
  DollarSign,
  PieChart,
  Users,
  CreditCard,
} from "lucide-react";

const BillingPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for the overview cards
  const overviewData = {
    totalInvoiced: 125750.0,
    totalPaid: 98500.0,
    totalOutstanding: 27250.0,
    averageDaysToPayment: 18,
  };

  return (
    <div className="container mx-auto py-6 space-y-8 bg-background">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billing</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoiced
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${overviewData.totalInvoiced.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Current billing period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${overviewData.totalPaid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Current billing period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Outstanding Balance
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${overviewData.totalOutstanding.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Days to Payment
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewData.averageDaysToPayment} days
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="billing-codes"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="billing-codes">Billing Codes</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="credit-memos">Credit Memos</TabsTrigger>
          <TabsTrigger value="gross-profit">Gross Profit</TabsTrigger>
          <TabsTrigger value="sales-commission">Sales Commission</TabsTrigger>
        </TabsList>
        <TabsContent value="billing-codes" className="mt-6">
          <BillingCodes />
        </TabsContent>
        <TabsContent value="invoices" className="mt-6">
          <BillingInvoicesForm
            invoices={[]}
            onCreateInvoice={(invoice) =>
              console.log("Create invoice:", invoice)
            }
            onDownloadInvoice={(id) => console.log("Download invoice:", id)}
          />
        </TabsContent>
        <TabsContent value="credit-memos" className="mt-6">
          <CreditMemosForm
            onCreateCreditMemo={(memo) =>
              console.log("Create credit memo:", memo)
            }
            onUpdateCreditMemo={(id, memo) =>
              console.log("Update credit memo:", id, memo)
            }
            onDeleteCreditMemo={(id) => console.log("Delete credit memo:", id)}
            onDownloadCreditMemo={(id) =>
              console.log("Download credit memo:", id)
            }
          />
        </TabsContent>
        <TabsContent value="gross-profit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gross Profit Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Gross Profit Report will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sales-commission" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Commission Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Sales Commission Report will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingPage;
