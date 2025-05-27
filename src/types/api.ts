// API response types for external services

// CFS Lot Details type for shipment information
export interface CFSLotDetail {
  amsBlNumber: string;
  houseBillNumber: string;
  piecesReceived: string;
  piecesManifested: string;
  piecesType: string;
  pounds: string;
  cbm: string;
  description: string;
  destination: string;
  headload: string;
  hold: string;
  marksHold: string;
  hazmat: string;
  shipDate: string;
  jobNumber: string;
  lotNumber: string;
}

// Xano Container API response type
export interface XanoContainerResponse {
  id: string;
  containerNumber: string;
  jobNumber: string;
  location: string;
  masterBillNumber: string;
  vesselName: string;
  customerReference: string;
  status: string;
  stgReferenceNumber: string | null;
  vesselETA: string;
  availableAtPier: string;
  appointmentDate: string;
  outgatedDate: string;
  dateIn: string;
  stripDate: string;
  availableAtSTG: string;
  returnEmptyDate: string;
  goDate: string;
  cfsLotDetails: CFSLotDetail[] | null;
  containerAttachments: string[];
  type?: string;
  carrier?: string;
  pol?: string;
  pod?: string;
}

// Xano ZIP Code Lookup API response type
export interface ZipCodeLookupResponse {
  success: boolean;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

// LTL Quote Request and Response types
export interface LTLQuoteLocation {
  country: string;
  zip: string;
  city: string;
  state: string;
}

export interface LTLQuoteCommodity {
  pieces: number;
  packaging_type: number;
  weight: number;
  weight_unit: "lb" | "kg";
  length: number;
  width: number;
  height: number;
  dimension_unit: "in" | "cm";
  freight_class: string;
  freight_class_auto: boolean;
  description: string;
  hazardous: boolean;
}

export interface LTLQuoteRequest {
  data: {
    AuthenticationKey: string;
    customer_id: string;
    customer_reference: string;
    origin: LTLQuoteLocation;
    destination: LTLQuoteLocation;
    commodity: LTLQuoteCommodity;
    accessorials: string[];
  };
}

export interface LTLQuoteCarrierRate {
  carrier_id: string;
  carrier_name: string;
  carrier_scac?: string;
  service_level: string;
  transit_days: number;
  total_cost: number;
  currency: string;
  expiration_date: string;
  quote_id: string;
  tariff_description?: string;
  accessorials?: string[];
  price_breakdown?: Record<string, string | number>;
  pricing_instructions?: string;
}

export interface LTLQuoteResponse {
  success: boolean;
  message?: string;
  quotes: LTLQuoteCarrierRate[];
  request_id: string;
}

// Database model for LTL Quotes
export interface LTLQuoteRecord {
  id: string;
  user_id: string;
  origin_zip: string;
  origin_country: string;
  destination_zip: string;
  destination_country: string;
  commodity: string;
  pieces: number;
  pallets: number;
  packaging_type: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  freight_class: string;
  accessorials: string[];
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  company_name?: string;
  request_payload: LTLQuoteRequest;
  response_payload: LTLQuoteResponse;
  status: "pending" | "completed" | "error";
  error_message?: string;
  created_at: string;
  updated_at: string;
}

// Book Shipment Request and Response types
export interface ShipmentStop {
  stopType: "Pickup" | "Delivery" | "Intermediate";
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  appointmentType?: "Required" | "Preferred" | "NotRequired";
  appointmentDate?: string;
  appointmentTime?: string;
  specialInstructions?: string;
}

export interface ShipmentCommodity {
  description: string;
  pieces: number;
  packaging_type: number;
  weight: number;
  weight_unit: "lbs" | "kg";
  length: number;
  width: number;
  height: number;
  dimension_unit: "in" | "cm";
  freight_class?: string;
  nmfc_code?: string;
  hazardous: boolean;
  hazmat_un_number?: string;
  hazmat_class?: string;
  hazmat_packing_group?: string;
}

export interface ShipmentReferenceNumber {
  type: string;
  value: string;
}

export interface ShipmentAlert {
  type: string;
  email: string;
  sms?: string;
}

export interface BookShipmentRequest {
  data: {
    AuthenticationKey: string;
    CustomerReferenceNumber: string;
    tariffDescription: string;
    allowNewShipmentNotifications: boolean;
    isCommitted: boolean;
    rateShipment: boolean;
    carrierSCAC: string;
    amount: string;
    customerId: string;
    shipmentType: "LTL" | "FTL" | "Parcel" | "Air" | "Ocean";
    stackable: boolean;
    trailerType: "None" | "Dry" | "Reefer" | "Flatbed" | "Other";
    trailerSize: "Full" | "Partial";
    weightUnits: "lbs" | "kg";
    dimensionUnits: "in" | "cm";
    serviceLevel: "NORMAL" | "EXPEDITED" | "GUARANTEED";
    importExport: "Import" | "Export" | "Domestic";
    shipmentReferenceNumbers: ShipmentReferenceNumber[];
    stops: ShipmentStop[];
    accessorialCodes: string[];
    shipmentAlerts: ShipmentAlert[];
    driverCellPhoneNumber?: string;
    hazmatEmergencyContactNumber?: string;
    commodities: ShipmentCommodity[];
  };
}

export interface BookShipmentResponse {
  success: boolean;
  message?: string;
  shipment_id?: string;
  tracking_number?: string;
  carrier_name?: string;
  carrier_scac?: string;
  estimated_delivery_date?: string;
  total_cost?: number;
  currency?: string;
  errors?: string[];
}

// Xano Rate Quote Request and Response types
export interface XanoRateQuoteLocation {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface XanoRateQuoteItem {
  description: string;
  pieces: number;
  packaging_type: string;
  weight: number;
  weight_unit: "lbs" | "kg";
  length: number;
  width: number;
  height: number;
  dimension_unit: "in" | "cm";
  freight_class?: string;
  nmfc_code?: string;
  hazardous: boolean;
  hazmat_un_number?: string;
  hazmat_class?: string;
  hazmat_packing_group?: string;
}

export interface XanoRateQuoteRequest {
  shipmentType: "LTL" | "FTL" | "Parcel" | "Air" | "Ocean";
  serviceLevel?: "Standard" | "Expedited" | "Guaranteed";
  pickupDate: string;
  origin: XanoRateQuoteLocation;
  destination: XanoRateQuoteLocation;
  items: XanoRateQuoteItem[];
  accessorials?: string[];
  customerReference?: string;
  specialInstructions?: string;
}

export interface XanoRateQuoteCarrier {
  carrier_id: string;
  carrier_name: string;
  carrier_scac: string;
  service_level: string;
  transit_days: number;
  total_cost: number;
  currency: string;
  expiration_date: string;
  quote_id: string;
  estimated_delivery_date?: string;
  price_breakdown?: {
    base_rate?: number;
    fuel_surcharge?: number;
    accessorials?: Record<string, number>;
    other_charges?: Record<string, number>;
  };
}

export interface XanoRateQuoteResponse {
  success: boolean;
  message?: string;
  request_id: string;
  quotes: XanoRateQuoteCarrier[];
  errors?: string[];
}
