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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuoteForm from "./QuoteForm";

const QuotesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showNewQuoteForm, setShowNewQuoteForm] = useState(false);
  const navigate = useNavigate();

  // Mock quotes data
  const quotes = [
    {
      id: "QT-2023-0042",
      customer: "Global Shipping Inc.",
      origin: "Los Angeles, CA",
      destination: "New York, NY",
      date: "2023-10-15",
      status: "pending",
      amount: "$3,450.00",
    },
    {
      id: "QT-2023-0041",
      customer: "Oceanic Freight Ltd.",
      origin: "Miami, FL",
      destination: "Houston, TX",
      date: "2023-10-14",
      status: "approved",
      amount: "$2,780.00",
    },
    {
      id: "QT-2023-0040",
      customer: "TransGlobal Logistics",
      origin: "Seattle, WA",
      destination: "Chicago, IL",
      date: "2023-10-12",
      status: "expired",
      amount: "$4,120.00",
    },
    {
      id: "QT-2023-0039",
      customer: "Pacific Cargo Solutions",
      origin: "San Francisco, CA",
      destination: "Boston, MA",
      date: "2023-10-10",
      status: "converted",
      amount: "$5,230.00",
    },
    {
      id: "QT-2023-0038",
      customer: "East Coast Shippers",
      origin: "New York, NY",
      destination: "Atlanta, GA",
      date: "2023-10-08",
      status: "pending",
      amount: "$1,950.00",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Approved
          </Badge>
        );
      case "expired":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Expired
          </Badge>
        );
      case "converted":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Converted to Shipment
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredQuotes = quotes.filter((quote) => {
    if (activeTab === "all") return true;
    return quote.status === activeTab;
  });

  if (showNewQuoteForm) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Quote</h1>
          <Button variant="outline" onClick={() => setShowNewQuoteForm(false)}>
            Back to Quotes
          </Button>
        </div>
        <QuoteForm />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quote Management</h1>
        <Button onClick={() => setShowNewQuoteForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Quote
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quotes</CardTitle>
          <CardDescription>
            View and manage all your shipping quotes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All Quotes</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="expired">Expired</TabsTrigger>
                  <TabsTrigger value="converted">Converted</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search quotes..."
                    className="pl-8 w-[250px]"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium text-sm">
                        Quote ID
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm">
                        Customer
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm">
                        Route
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm">
                        Date
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm">
                        Amount
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuotes.length > 0 ? (
                      filteredQuotes.map((quote) => (
                        <tr
                          key={quote.id}
                          className="border-t hover:bg-muted/50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              {quote.id}
                            </div>
                          </td>
                          <td className="py-3 px-4">{quote.customer}</td>
                          <td className="py-3 px-4">
                            {quote.origin} → {quote.destination}
                          </td>
                          <td className="py-3 px-4">{quote.date}</td>
                          <td className="py-3 px-4">{quote.amount}</td>
                          <td className="py-3 px-4">
                            {getStatusBadge(quote.status)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                asChild
                              >
                                <a href={`/quotes/response/${quote.id}`}>
                                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                  View
                                </a>
                              </Button>
                              {quote.status === "pending" && (
                                <Button size="sm" className="h-8">
                                  Approve
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-6 text-center text-muted-foreground"
                        >
                          No quotes found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredQuotes.length} of {quotes.length} quotes
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuotesPage;
