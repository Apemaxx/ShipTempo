import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ArrivalNoticeSearch from "./ArrivalNoticeSearch";
import ArrivalNotice, { ArrivalNoticeData } from "./ArrivalNotice";
import { Button } from "@/components/ui/button";
import { AlertCircle, Save, FileText } from "lucide-react";
import { saveArrivalNotice } from "@/lib/api/ocean";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const OceanImportModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchResults, setSearchResults] = useState<ArrivalNoticeData[]>([]);
  const [selectedNotice, setSelectedNotice] =
    useState<ArrivalNoticeData | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  const handleResultsFound = (results: ArrivalNoticeData[]) => {
    setSearchResults(results);
    if (results.length > 0) {
      setActiveTab("results");
    }
  };

  const handleViewNotice = (notice: ArrivalNoticeData) => {
    setSelectedNotice(notice);
    setActiveTab("view");
  };

  const handleSaveNotice = async () => {
    if (selectedNotice) {
      try {
        const success = await saveArrivalNotice(selectedNotice);
        setSaveSuccess(success);
        setTimeout(() => setSaveSuccess(null), 5000); // Clear message after 5 seconds
      } catch (error) {
        console.error("Error saving arrival notice:", error);
        setSaveSuccess(false);
      }
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Ocean Import Management</h1>

      {saveSuccess !== null && (
        <Alert className={`mb-4 ${saveSuccess ? "bg-green-50" : "bg-red-50"}`}>
          <AlertCircle
            className={saveSuccess ? "text-green-600" : "text-red-600"}
          />
          <AlertTitle>{saveSuccess ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>
            {saveSuccess
              ? "Arrival notice saved successfully."
              : "Failed to save arrival notice. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="results" disabled={searchResults.length === 0}>
            Results ({searchResults.length})
          </TabsTrigger>
          <TabsTrigger value="view" disabled={!selectedNotice}>
            View Arrival Notice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-0">
          <ArrivalNoticeSearch onResultsFound={handleResultsFound} />
        </TabsContent>

        <TabsContent value="results" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Search Results</h2>
              {searchResults.length === 0 ? (
                <p className="text-center py-8 text-gray-500">
                  No arrival notices found matching your search criteria.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="p-2 border">Reference No</th>
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">Master B/L</th>
                        <th className="p-2 border">House B/L</th>
                        <th className="p-2 border">Container</th>
                        <th className="p-2 border">Vessel</th>
                        <th className="p-2 border">ETA</th>
                        <th className="p-2 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((notice, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 border">{notice.referenceNo}</td>
                          <td className="p-2 border">{notice.date}</td>
                          <td className="p-2 border">{notice.masterBLNo}</td>
                          <td className="p-2 border">{notice.houseBLNo}</td>
                          <td className="p-2 border">
                            {notice.container.containerNo}
                          </td>
                          <td className="p-2 border">
                            {notice.vessel.name} {notice.vessel.voyage}
                          </td>
                          <td className="p-2 border">{notice.eta}</td>
                          <td className="p-2 border">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewNotice(notice)}
                            >
                              <FileText className="h-4 w-4 mr-1" /> View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view" className="mt-0">
          {selectedNotice && (
            <div>
              <div className="flex justify-end mb-4">
                <Button onClick={handleSaveNotice}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Arrival Notice
                </Button>
              </div>
              <ArrivalNotice data={selectedNotice} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OceanImportModule;
