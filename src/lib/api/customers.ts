import { supabase } from "@/lib/supabase-client";

export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "Active" | "Inactive";
  account_manager: string;
  created_at?: string;
}

/**
 * Get all customers from Supabase
 */
export async function getCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
}

/**
 * Create a new customer in Supabase
 */
export async function createCustomer(
  customer: Omit<Customer, "id" | "created_at">,
): Promise<Customer> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .insert(customer)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

/**
 * Update an existing customer in Supabase
 */
export async function updateCustomer(
  id: string,
  customer: Partial<Customer>,
): Promise<Customer> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .update(customer)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
}

/**
 * Delete a customer from Supabase
 */
export async function deleteCustomer(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("customers").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
}
