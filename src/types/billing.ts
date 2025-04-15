export interface BillingCode {
  id: string;
  code: string;
  description: string;
  rate: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillingTransaction {
  id: string;
  billingCodeId: string;
  shipmentId: string;
  amount: number;
  quantity: number;
  totalAmount: number;
  date: string;
  status: "pending" | "processed" | "invoiced" | "paid";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  billingCodeId: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  shipmentId: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "void";
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreditMemo {
  id: string;
  memoNumber: string;
  invoiceId?: string;
  invoiceNumber?: string;
  customerId: string;
  customerName: string;
  shipmentId: string;
  amount: number;
  status: "draft" | "issued" | "applied";
  issueDate: string;
  items: InvoiceItem[];
  reason: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GrossProfitReportItem {
  period: string;
  revenue: number;
  costOfSales: number;
  grossProfit: number;
  grossProfitMargin: number;
}

export interface SalesCommissionReportItem {
  salesPerson: string;
  totalSales: number;
  commissionRate: number;
  commissionAmount: number;
  period: string;
}

export interface EmailAccount {
  id: string;
  userId: string;
  provider: "gmail" | "outlook";
  email: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  connected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailAttachment {
  id: string;
  emailId: string;
  documentId: string;
  name: string;
  size: number;
  type: string;
  createdAt: string;
}

export interface Email {
  id: string;
  userId: string;
  emailAccountId: string;
  shipmentId?: string;
  subject: string;
  body: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  attachments?: EmailAttachment[];
  status: "draft" | "sent" | "failed";
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type TruckingStatus =
  | "quoted"
  | "booked"
  | "dispatched"
  | "in_transit"
  | "delivered"
  | "completed";

export interface TruckingShipment {
  id: string;
  shipmentId: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupDate: string;
  pickupTime: string;
  pickReference?: string;
  proNumber?: string;
  specialInstructions?: string;
  status: TruckingStatus;
  carrier?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleType?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}
