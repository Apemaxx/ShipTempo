import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import {
  fetchProNumber,
  validateProNumber,
  storeProNumber,
  getCarrierEndpoints,
} from "@/lib/api";
import { trackShipmentEvent } from "@/App";

interface ProNumberManagerProps {
  shipmentId: string;
  initialProNumber?: string;
  initialCarrierId?: string;
}

export default function ProNumberManager({
  shipmentId = "",
  initialProNumber = "",
  initialCarrierId = "",
}: ProNumberManagerProps) {
  const [proNumber, setProNumber] = useState(initialProNumber);
  const [carrierId, setCarrierId] = useState(initialCarrierId);
  const [carriers, setCarriers] = useState<{ name: string; id: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPro, setFetchingPro] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    // Load carriers from the API
    const loadCarriers = async () => {
      setLoading(true);
      try {
        const endpoints = await getCarrierEndpoints();
        setCarriers(endpoints.map((e) => ({ name: e.name, id: e.name })));
      } catch (error) {
        console.error("Failed to load carriers:", error);
        setMessage({ type: "error", text: "Failed to load carriers" });
      } finally {
        setLoading(false);
      }
    };

    loadCarriers();
  }, []);

  // Validate PRO number on change
  const handleProNumberChange = (value: string) => {
    setProNumber(value);
    setIsValid(validateProNumber(value));
  };

  // Fetch PRO number from carrier API
  const handleFetchProNumber = async () => {
    if (!carrierId || !shipmentId) {
      setMessage({
        type: "error",
        text: "Carrier and shipment ID are required",
      });
      return;
    }

    setFetchingPro(true);
    setMessage({ type: "", text: "" });

    try {
      // Mock shipment details - in a real app, you'd fetch this from your state/database
      const shipmentDetails = {
        shipmentId,
        origin: "Los Angeles, CA",
        destination: "New York, NY",
        weight: 1500,
        pieces: 10,
        // Add other required fields for the carrier API
      };

      const proNumber = await fetchProNumber(carrierId, shipmentDetails);

      if (proNumber) {
        setProNumber(proNumber);
        setIsValid(true);
        setMessage({
          type: "success",
          text: "PRO number retrieved successfully",
        });

        // Track the event
        trackShipmentEvent("pro_number_retrieved", {
          shipmentId,
          carrierId,
          proNumber,
        });

        // Store in database
        await storeProNumber(shipmentId, carrierId, proNumber);
      } else {
        setMessage({
          type: "error",
          text: "Could not retrieve PRO number from carrier",
        });
      }
    } catch (error) {
      console.error("Error fetching PRO number:", error);
      setMessage({ type: "error", text: "Error connecting to carrier API" });
    } finally {
      setFetchingPro(false);
    }
  };

  // Save PRO number manually entered
  const handleSaveProNumber = async () => {
    if (!isValid) {
      setMessage({ type: "error", text: "Invalid PRO number format" });
      return;
    }

    if (!carrierId) {
      setMessage({ type: "error", text: "Please select a carrier" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const success = await storeProNumber(shipmentId, carrierId, proNumber);

      if (success) {
        setMessage({ type: "success", text: "PRO number saved successfully" });

        // Track the event
        trackShipmentEvent("pro_number_saved", {
          shipmentId,
          carrierId,
          proNumber,
          manual: true,
        });
      } else {
        setMessage({ type: "error", text: "Failed to save PRO number" });
      }
    } catch (error) {
      console.error("Error saving PRO number:", error);
      setMessage({ type: "error", text: "Error saving PRO number" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium mb-4">PRO Number Management</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="carrier">Carrier</Label>
          <Select
            value={carrierId}
            onValueChange={setCarrierId}
            disabled={loading}
          >
            <SelectTrigger id="carrier" className="w-full">
              <SelectValue placeholder="Select carrier" />
            </SelectTrigger>
            <SelectContent>
              {carriers.map((carrier) => (
                <SelectItem key={carrier.id} value={carrier.id}>
                  {carrier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="proNumber" className="flex justify-between">
            <span>PRO Number</span>
            {!isValid && proNumber && (
              <span className="text-red-500 text-xs">Invalid format</span>
            )}
          </Label>
          <div className="flex space-x-2">
            <Input
              id="proNumber"
              value={proNumber}
              onChange={(e) => handleProNumberChange(e.target.value)}
              className={!isValid && proNumber ? "border-red-500" : ""}
              placeholder="Enter or fetch PRO number"
              disabled={loading || fetchingPro}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleFetchProNumber}
              disabled={!carrierId || loading || fetchingPro}
              title="Fetch PRO number from carrier"
            >
              {fetchingPro ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {message.text && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSaveProNumber}
          disabled={!proNumber || !isValid || loading || !carrierId}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save PRO Number"
          )}
        </Button>
      </div>
    </div>
  );
}
