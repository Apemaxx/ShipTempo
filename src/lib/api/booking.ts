import { createClient } from "@/lib/utils";
import { OceanExportBooking } from "@/types/booking";

// Create a Supabase client
const getSupabaseClient = () => createClient();

// Function to fetch all ocean export bookings
export const fetchOceanExportBookings = async (): Promise<
  OceanExportBooking[]
> => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("ocean_export_bookings")
    .select(
      "*, shipper:ocean_export_booking_shippers(*), vessel:ocean_export_booking_vessels(*), cargo:ocean_export_booking_cargo(*), deliveryInfo:ocean_export_booking_delivery_info(*)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching ocean export bookings:", error);
    throw new Error("Failed to fetch ocean export bookings");
  }

  return data.map(mapDbBookingToBooking);
};

// Function to fetch a single ocean export booking by ID
export const fetchOceanExportBookingById = async (
  id: string,
): Promise<OceanExportBooking> => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("ocean_export_bookings")
    .select(
      "*, shipper:ocean_export_booking_shippers(*), vessel:ocean_export_booking_vessels(*), cargo:ocean_export_booking_cargo(*), deliveryInfo:ocean_export_booking_delivery_info(*)",
    )
    .eq("booking_number", id)
    .single();

  if (error) {
    console.error(`Error fetching ocean export booking with ID ${id}:`, error);
    throw new Error(`Failed to fetch ocean export booking with ID ${id}`);
  }

  return mapDbBookingToBooking(data);
};

// Function to create a new ocean export booking
export const createOceanExportBooking = async (
  booking: Omit<OceanExportBooking, "id">,
): Promise<OceanExportBooking> => {
  const supabase = getSupabaseClient();

  // Map the booking to the database structure
  const dbBooking = mapBookingToDbBooking(booking);

  // Insert the main booking record
  const { data: bookingData, error: bookingError } = await supabase
    .from("ocean_export_bookings")
    .insert({
      booking_number: dbBooking.booking_number,
      carrier_booking_number: dbBooking.carrier_booking_number,
      prepared_by: dbBooking.prepared_by,
      sales_by: dbBooking.sales_by,
      date: dbBooking.date,
      agent: dbBooking.agent,
      consignee: dbBooking.consignee,
      notify_party: dbBooking.notify_party,
      carrier: dbBooking.carrier,
      export_ref_no: dbBooking.export_ref_no,
      place_of_receipt: dbBooking.place_of_receipt,
      port_of_loading: dbBooking.port_of_loading,
      port_of_discharge: dbBooking.port_of_discharge,
      place_of_delivery: dbBooking.place_of_delivery,
      final_destination: dbBooking.final_destination,
      etd: dbBooking.etd,
      eta: dbBooking.eta,
      commodity: dbBooking.commodity,
      dangerous: dbBooking.dangerous,
      lc: dbBooking.lc,
      pre_quoted: dbBooking.pre_quoted,
      remarks: dbBooking.remarks,
    })
    .select()
    .single();

  if (bookingError) {
    console.error("Error creating ocean export booking:", bookingError);
    throw new Error("Failed to create ocean export booking");
  }

  // Insert the shipper record
  const { error: shipperError } = await supabase
    .from("ocean_export_booking_shippers")
    .insert({
      booking_id: bookingData.id,
      name: dbBooking.shipper.name,
      address: dbBooking.shipper.address,
      tel: dbBooking.shipper.tel,
      fax: dbBooking.shipper.fax,
      attn: dbBooking.shipper.attn,
    });

  if (shipperError) {
    console.error("Error creating shipper record:", shipperError);
    throw new Error("Failed to create shipper record");
  }

  // Insert the vessel record
  const { error: vesselError } = await supabase
    .from("ocean_export_booking_vessels")
    .insert({
      booking_id: bookingData.id,
      name: dbBooking.vessel.name,
      voyage_number: dbBooking.vessel.voyage_number,
    });

  if (vesselError) {
    console.error("Error creating vessel record:", vesselError);
    throw new Error("Failed to create vessel record");
  }

  // Insert the cargo record
  const { error: cargoError } = await supabase
    .from("ocean_export_booking_cargo")
    .insert({
      booking_id: bookingData.id,
      kgs: dbBooking.cargo.kgs,
      lbs: dbBooking.cargo.lbs,
      cbm: dbBooking.cargo.cbm,
      cft: dbBooking.cargo.cft,
      packages: dbBooking.cargo.packages,
      unit: dbBooking.cargo.unit,
    });

  if (cargoError) {
    console.error("Error creating cargo record:", cargoError);
    throw new Error("Failed to create cargo record");
  }

  // Insert the delivery info record
  const { error: deliveryInfoError } = await supabase
    .from("ocean_export_booking_delivery_info")
    .insert({
      booking_id: bookingData.id,
      to: dbBooking.delivery_info.to,
      port_rail: dbBooking.delivery_info.port_rail,
      cut_off_date: dbBooking.delivery_info.cut_off_date,
      cut_off_time: dbBooking.delivery_info.cut_off_time,
      warehouse: dbBooking.delivery_info.warehouse,
      sed_doc: dbBooking.delivery_info.sed_doc,
      move_type: dbBooking.delivery_info.move_type,
    });

  if (deliveryInfoError) {
    console.error("Error creating delivery info record:", deliveryInfoError);
    throw new Error("Failed to create delivery info record");
  }

  // Fetch the complete booking with all related records
  return fetchOceanExportBookingById(bookingData.booking_number);
};

// Function to update an existing ocean export booking
export const updateOceanExportBooking = async (
  id: string,
  booking: Partial<OceanExportBooking>,
): Promise<OceanExportBooking> => {
  const supabase = getSupabaseClient();

  // First, fetch the existing booking to get its ID
  const { data: existingBooking, error: fetchError } = await supabase
    .from("ocean_export_bookings")
    .select("id")
    .eq("booking_number", id)
    .single();

  if (fetchError) {
    console.error(
      `Error fetching ocean export booking with ID ${id}:`,
      fetchError,
    );
    throw new Error(`Failed to fetch ocean export booking with ID ${id}`);
  }

  const bookingId = existingBooking.id;

  // Map the booking to the database structure
  const dbBooking = mapPartialBookingToDbBooking(booking);

  // Update the main booking record
  if (Object.keys(dbBooking).length > 0) {
    const { error: bookingError } = await supabase
      .from("ocean_export_bookings")
      .update(dbBooking)
      .eq("id", bookingId);

    if (bookingError) {
      console.error("Error updating ocean export booking:", bookingError);
      throw new Error("Failed to update ocean export booking");
    }
  }

  // Update the shipper record if provided
  if (booking.shipper) {
    const { error: shipperError } = await supabase
      .from("ocean_export_booking_shippers")
      .update({
        name: booking.shipper.name,
        address: booking.shipper.address,
        tel: booking.shipper.tel,
        fax: booking.shipper.fax,
        attn: booking.shipper.attn,
      })
      .eq("booking_id", bookingId);

    if (shipperError) {
      console.error("Error updating shipper record:", shipperError);
      throw new Error("Failed to update shipper record");
    }
  }

  // Update the vessel record if provided
  if (booking.vessel) {
    const { error: vesselError } = await supabase
      .from("ocean_export_booking_vessels")
      .update({
        name: booking.vessel.name,
        voyage_number: booking.vessel.voyageNumber,
      })
      .eq("booking_id", bookingId);

    if (vesselError) {
      console.error("Error updating vessel record:", vesselError);
      throw new Error("Failed to update vessel record");
    }
  }

  // Update the cargo record if provided
  if (booking.cargo) {
    const { error: cargoError } = await supabase
      .from("ocean_export_booking_cargo")
      .update({
        kgs: booking.cargo.kgs,
        lbs: booking.cargo.lbs,
        cbm: booking.cargo.cbm,
        cft: booking.cargo.cft,
        packages: booking.cargo.packages,
        unit: booking.cargo.unit,
      })
      .eq("booking_id", bookingId);

    if (cargoError) {
      console.error("Error updating cargo record:", cargoError);
      throw new Error("Failed to update cargo record");
    }
  }

  // Update the delivery info record if provided
  if (booking.deliveryInfo) {
    const { error: deliveryInfoError } = await supabase
      .from("ocean_export_booking_delivery_info")
      .update({
        to: booking.deliveryInfo.to,
        port_rail: booking.deliveryInfo.portRail,
        cut_off_date: booking.deliveryInfo.cutOffDate,
        cut_off_time: booking.deliveryInfo.cutOffTime,
        warehouse: booking.deliveryInfo.warehouse,
        sed_doc: booking.deliveryInfo.sedDoc,
        move_type: booking.deliveryInfo.moveType,
      })
      .eq("booking_id", bookingId);

    if (deliveryInfoError) {
      console.error("Error updating delivery info record:", deliveryInfoError);
      throw new Error("Failed to update delivery info record");
    }
  }

  // Fetch the updated booking with all related records
  return fetchOceanExportBookingById(id);
};

// Function to delete an ocean export booking
export const deleteOceanExportBooking = async (id: string): Promise<void> => {
  const supabase = getSupabaseClient();

  // First, fetch the existing booking to get its ID
  const { data: existingBooking, error: fetchError } = await supabase
    .from("ocean_export_bookings")
    .select("id")
    .eq("booking_number", id)
    .single();

  if (fetchError) {
    console.error(
      `Error fetching ocean export booking with ID ${id}:`,
      fetchError,
    );
    throw new Error(`Failed to fetch ocean export booking with ID ${id}`);
  }

  const bookingId = existingBooking.id;

  // Delete the related records first (to maintain referential integrity)
  // Delete delivery info
  const { error: deliveryInfoError } = await supabase
    .from("ocean_export_booking_delivery_info")
    .delete()
    .eq("booking_id", bookingId);

  if (deliveryInfoError) {
    console.error("Error deleting delivery info record:", deliveryInfoError);
    throw new Error("Failed to delete delivery info record");
  }

  // Delete cargo
  const { error: cargoError } = await supabase
    .from("ocean_export_booking_cargo")
    .delete()
    .eq("booking_id", bookingId);

  if (cargoError) {
    console.error("Error deleting cargo record:", cargoError);
    throw new Error("Failed to delete cargo record");
  }

  // Delete vessel
  const { error: vesselError } = await supabase
    .from("ocean_export_booking_vessels")
    .delete()
    .eq("booking_id", bookingId);

  if (vesselError) {
    console.error("Error deleting vessel record:", vesselError);
    throw new Error("Failed to delete vessel record");
  }

  // Delete shipper
  const { error: shipperError } = await supabase
    .from("ocean_export_booking_shippers")
    .delete()
    .eq("booking_id", bookingId);

  if (shipperError) {
    console.error("Error deleting shipper record:", shipperError);
    throw new Error("Failed to delete shipper record");
  }

  // Finally, delete the main booking record
  const { error: bookingError } = await supabase
    .from("ocean_export_bookings")
    .delete()
    .eq("id", bookingId);

  if (bookingError) {
    console.error("Error deleting ocean export booking:", bookingError);
    throw new Error("Failed to delete ocean export booking");
  }
};

// Helper function to map a database booking to the frontend booking model
const mapDbBookingToBooking = (dbBooking: any): OceanExportBooking => {
  return {
    bookingNumber: dbBooking.booking_number,
    carrierBookingNumber: dbBooking.carrier_booking_number,
    preparedBy: dbBooking.prepared_by,
    salesBy: dbBooking.sales_by,
    date: dbBooking.date,
    shipper: {
      name: dbBooking.shipper.name,
      address: dbBooking.shipper.address,
      tel: dbBooking.shipper.tel,
      fax: dbBooking.shipper.fax,
      attn: dbBooking.shipper.attn,
    },
    agent: dbBooking.agent,
    consignee: dbBooking.consignee,
    notifyParty: dbBooking.notify_party,
    vessel: {
      name: dbBooking.vessel.name,
      voyageNumber: dbBooking.vessel.voyage_number,
    },
    carrier: dbBooking.carrier,
    exportRefNo: dbBooking.export_ref_no,
    placeOfReceipt: dbBooking.place_of_receipt,
    portOfLoading: dbBooking.port_of_loading,
    portOfDischarge: dbBooking.port_of_discharge,
    placeOfDelivery: dbBooking.place_of_delivery,
    finalDestination: dbBooking.final_destination,
    etd: dbBooking.etd,
    eta: dbBooking.eta,
    commodity: dbBooking.commodity,
    cargo: {
      kgs: dbBooking.cargo.kgs,
      lbs: dbBooking.cargo.lbs,
      cbm: dbBooking.cargo.cbm,
      cft: dbBooking.cargo.cft,
      packages: dbBooking.cargo.packages,
      unit: dbBooking.cargo.unit,
    },
    dangerous: dbBooking.dangerous,
    lc: dbBooking.lc,
    deliveryInfo: {
      to: dbBooking.deliveryInfo.to,
      portRail: dbBooking.deliveryInfo.port_rail,
      cutOffDate: dbBooking.deliveryInfo.cut_off_date,
      cutOffTime: dbBooking.deliveryInfo.cut_off_time,
      warehouse: dbBooking.deliveryInfo.warehouse,
      sedDoc: dbBooking.deliveryInfo.sed_doc,
      moveType: dbBooking.deliveryInfo.move_type,
    },
    containerPickup: {
      location: dbBooking.container_pickup?.location || "",
      tel: dbBooking.container_pickup?.tel || "",
      fax: dbBooking.container_pickup?.fax || "",
      cntrSize: dbBooking.container_pickup?.cntr_size || "",
    },
    cargoPickup: {
      location: dbBooking.cargo_pickup?.location || "",
      by: dbBooking.cargo_pickup?.by || "",
      tel: dbBooking.cargo_pickup?.tel || "",
    },
    preQuoted: dbBooking.pre_quoted,
    remarks: dbBooking.remarks || [],
  };
};

// Helper function to map a frontend booking to the database structure
const mapBookingToDbBooking = (booking: Omit<OceanExportBooking, "id">) => {
  return {
    booking_number: booking.bookingNumber,
    carrier_booking_number: booking.carrierBookingNumber,
    prepared_by: booking.preparedBy,
    sales_by: booking.salesBy,
    date: booking.date,
    shipper: {
      name: booking.shipper.name,
      address: booking.shipper.address,
      tel: booking.shipper.tel,
      fax: booking.shipper.fax,
      attn: booking.shipper.attn,
    },
    agent: booking.agent,
    consignee: booking.consignee,
    notify_party: booking.notifyParty,
    vessel: {
      name: booking.vessel.name,
      voyage_number: booking.vessel.voyageNumber,
    },
    carrier: booking.carrier,
    export_ref_no: booking.exportRefNo,
    place_of_receipt: booking.placeOfReceipt,
    port_of_loading: booking.portOfLoading,
    port_of_discharge: booking.portOfDischarge,
    place_of_delivery: booking.placeOfDelivery,
    final_destination: booking.finalDestination,
    etd: booking.etd,
    eta: booking.eta,
    commodity: booking.commodity,
    cargo: {
      kgs: booking.cargo.kgs,
      lbs: booking.cargo.lbs,
      cbm: booking.cargo.cbm,
      cft: booking.cargo.cft,
      packages: booking.cargo.packages,
      unit: booking.cargo.unit,
    },
    dangerous: booking.dangerous,
    lc: booking.lc,
    delivery_info: {
      to: booking.deliveryInfo.to,
      port_rail: booking.deliveryInfo.portRail,
      cut_off_date: booking.deliveryInfo.cutOffDate,
      cut_off_time: booking.deliveryInfo.cutOffTime,
      warehouse: booking.deliveryInfo.warehouse,
      sed_doc: booking.deliveryInfo.sedDoc,
      move_type: booking.deliveryInfo.moveType,
    },
    pre_quoted: booking.preQuoted,
    remarks: booking.remarks,
  };
};

// Helper function to map a partial frontend booking to the database structure
const mapPartialBookingToDbBooking = (booking: Partial<OceanExportBooking>) => {
  const dbBooking: any = {};

  if (booking.bookingNumber !== undefined)
    dbBooking.booking_number = booking.bookingNumber;
  if (booking.carrierBookingNumber !== undefined)
    dbBooking.carrier_booking_number = booking.carrierBookingNumber;
  if (booking.preparedBy !== undefined)
    dbBooking.prepared_by = booking.preparedBy;
  if (booking.salesBy !== undefined) dbBooking.sales_by = booking.salesBy;
  if (booking.date !== undefined) dbBooking.date = booking.date;
  if (booking.agent !== undefined) dbBooking.agent = booking.agent;
  if (booking.consignee !== undefined) dbBooking.consignee = booking.consignee;
  if (booking.notifyParty !== undefined)
    dbBooking.notify_party = booking.notifyParty;
  if (booking.carrier !== undefined) dbBooking.carrier = booking.carrier;
  if (booking.exportRefNo !== undefined)
    dbBooking.export_ref_no = booking.exportRefNo;
  if (booking.placeOfReceipt !== undefined)
    dbBooking.place_of_receipt = booking.placeOfReceipt;
  if (booking.portOfLoading !== undefined)
    dbBooking.port_of_loading = booking.portOfLoading;
  if (booking.portOfDischarge !== undefined)
    dbBooking.port_of_discharge = booking.portOfDischarge;
  if (booking.placeOfDelivery !== undefined)
    dbBooking.place_of_delivery = booking.placeOfDelivery;
  if (booking.finalDestination !== undefined)
    dbBooking.final_destination = booking.finalDestination;
  if (booking.etd !== undefined) dbBooking.etd = booking.etd;
  if (booking.eta !== undefined) dbBooking.eta = booking.eta;
  if (booking.commodity !== undefined) dbBooking.commodity = booking.commodity;
  if (booking.dangerous !== undefined) dbBooking.dangerous = booking.dangerous;
  if (booking.lc !== undefined) dbBooking.lc = booking.lc;
  if (booking.preQuoted !== undefined) dbBooking.pre_quoted = booking.preQuoted;
  if (booking.remarks !== undefined) dbBooking.remarks = booking.remarks;

  return dbBooking;
};
