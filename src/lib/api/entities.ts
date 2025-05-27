import { supabase } from "@/lib/supabase-client";

// Base entity interface
export interface EntityBase {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "Active" | "Inactive";
  created_at?: string;
}

// Vendor interface
export interface Vendor extends EntityBase {
  services: string[];
}

// Broker interface
export interface Broker extends EntityBase {
  license_number: string;
}

// CFS Location interface
export interface CFSLocation extends EntityBase {
  operating_hours: string;
  services: string[];
}

// Trucking Company interface
export interface TruckingCompany extends EntityBase {
  fleet_size: number;
  service_areas: string[];
  pick_reference?: string;
  pro_number?: string;
  trucking_status?:
    | "quote"
    | "booked"
    | "dispatched"
    | "in Transit"
    | "Delivered";
}

// Insurance Provider interface
export interface InsuranceProvider extends EntityBase {
  coverage_types: string[];
}

// Generic function to get all entities from a table
async function getEntities<T>(tableName: string): Promise<T[]> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching ${tableName}:`, error);
    throw error;
  }
}

// Generic function to create an entity
async function createEntity<T extends object>(
  tableName: string,
  entity: Omit<T, "id" | "created_at">,
): Promise<T> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert(entity)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error creating ${tableName}:`, error);
    throw error;
  }
}

// Generic function to update an entity
async function updateEntity<T extends object>(
  tableName: string,
  id: string,
  entity: Partial<T>,
): Promise<T> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(entity)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating ${tableName}:`, error);
    throw error;
  }
}

// Generic function to delete an entity
async function deleteEntity(tableName: string, id: string): Promise<void> {
  try {
    const { error } = await supabase.from(tableName).delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting ${tableName}:`, error);
    throw error;
  }
}

// Vendor specific functions
export async function getVendors(): Promise<Vendor[]> {
  return getEntities<Vendor>("vendors");
}

export async function createVendor(
  vendor: Omit<Vendor, "id" | "created_at">,
): Promise<Vendor> {
  return createEntity<Vendor>("vendors", vendor);
}

export async function updateVendor(
  id: string,
  vendor: Partial<Vendor>,
): Promise<Vendor> {
  return updateEntity<Vendor>("vendors", id, vendor);
}

export async function deleteVendor(id: string): Promise<void> {
  return deleteEntity("vendors", id);
}

// Broker specific functions
export async function getBrokers(): Promise<Broker[]> {
  return getEntities<Broker>("brokers");
}

export async function createBroker(
  broker: Omit<Broker, "id" | "created_at">,
): Promise<Broker> {
  return createEntity<Broker>("brokers", broker);
}

export async function updateBroker(
  id: string,
  broker: Partial<Broker>,
): Promise<Broker> {
  return updateEntity<Broker>("brokers", id, broker);
}

export async function deleteBroker(id: string): Promise<void> {
  return deleteEntity("brokers", id);
}

// CFS Location specific functions
export async function getCFSLocations(): Promise<CFSLocation[]> {
  return getEntities<CFSLocation>("cfs_locations");
}

export async function createCFSLocation(
  cfsLocation: Omit<CFSLocation, "id" | "created_at">,
): Promise<CFSLocation> {
  return createEntity<CFSLocation>("cfs_locations", cfsLocation);
}

export async function updateCFSLocation(
  id: string,
  cfsLocation: Partial<CFSLocation>,
): Promise<CFSLocation> {
  return updateEntity<CFSLocation>("cfs_locations", id, cfsLocation);
}

export async function deleteCFSLocation(id: string): Promise<void> {
  return deleteEntity("cfs_locations", id);
}

// Trucking Company specific functions
export async function getTruckingCompanies(): Promise<TruckingCompany[]> {
  return getEntities<TruckingCompany>("trucking_companies");
}

export async function createTruckingCompany(
  truckingCompany: Omit<TruckingCompany, "id" | "created_at">,
): Promise<TruckingCompany> {
  return createEntity<TruckingCompany>("trucking_companies", truckingCompany);
}

export async function updateTruckingCompany(
  id: string,
  truckingCompany: Partial<TruckingCompany>,
): Promise<TruckingCompany> {
  return updateEntity<TruckingCompany>(
    "trucking_companies",
    id,
    truckingCompany,
  );
}

export async function deleteTruckingCompany(id: string): Promise<void> {
  return deleteEntity("trucking_companies", id);
}

// Insurance Provider specific functions
export async function getInsuranceProviders(): Promise<InsuranceProvider[]> {
  return getEntities<InsuranceProvider>("insurance_providers");
}

export async function createInsuranceProvider(
  insuranceProvider: Omit<InsuranceProvider, "id" | "created_at">,
): Promise<InsuranceProvider> {
  return createEntity<InsuranceProvider>(
    "insurance_providers",
    insuranceProvider,
  );
}

export async function updateInsuranceProvider(
  id: string,
  insuranceProvider: Partial<InsuranceProvider>,
): Promise<InsuranceProvider> {
  return updateEntity<InsuranceProvider>(
    "insurance_providers",
    id,
    insuranceProvider,
  );
}

export async function deleteInsuranceProvider(id: string): Promise<void> {
  return deleteEntity("insurance_providers", id);
}
