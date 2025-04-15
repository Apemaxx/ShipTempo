import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import OceanExportBookingForm from "@/components/booking/OceanExportBookingForm";
import { OceanExportBooking } from "@/types/booking";
import {
  fetchOceanExportBookings,
  createOceanExportBooking,
} from "@/lib/api/booking";

const OceanExportBookingPage = () => {
  const [bookings, setBookings] = useState<OceanExportBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchOceanExportBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (
    booking: Omit<OceanExportBooking, "id">,
  ) => {
    try {
      // Generate a booking number if not provided
      if (!booking.bookingNumber) {
        booking.bookingNumber = `BK${Date.now().toString().slice(-8)}`;
      }

      const newBooking = await createOceanExportBooking(booking);
      setBookings([newBooking, ...bookings]);
      toast({
        title: "Success",
        description: "Booking created successfully.",
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadBooking = (id: string) => {
    // In a real application, this would generate a PDF or other document
    toast({
      title: "Download Started",
      description: `Downloading booking ${id}...`,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Ocean Export Bookings</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading bookings...</p>
        </div>
      ) : (
        <OceanExportBookingForm
          bookings={bookings}
          onCreateBooking={handleCreateBooking}
          onDownloadBooking={handleDownloadBooking}
        />
      )}
    </div>
  );
};

export default OceanExportBookingPage;
