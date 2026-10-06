// These mirror the B7A6 backend's Prisma schema and response contract exactly -
// see courier-backend/prisma/schema/*.prisma and src/utils/sendResponse.ts.

export type Role = 'CUSTOMER' | 'COURIER' | 'ADMIN';

export type ShipmentStatus =
  | 'PENDING'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'AT_ORIGIN_HUB'
  | 'IN_TRANSIT'
  | 'AT_DESTINATION_HUB'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED_DELIVERY'
  | 'RETURNED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
  errors?: { path: string; message: string }[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  authProvider: 'CREDENTIALS' | 'GOOGLE';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Hub {
  id: string;
  name: string;
  city: string;
  zone: string;
  address: string;
}

export interface CourierProfile {
  id: string;
  userId: string;
  vehicleType: string | null;
  licenseNumber: string | null;
  isAvailable: boolean;
  currentHubId: string | null;
  currentHub?: Hub | null;
  rating: number;
  totalEarnings: string;
  user?: Pick<User, 'id' | 'name' | 'email' | 'phone'>;
  createdAt: string;
}

export interface ShipmentStatusHistoryEntry {
  id: string;
  shipmentId: string;
  fromStatus: ShipmentStatus | null;
  toStatus: ShipmentStatus;
  note: string | null;
  changedBy: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  shipmentId: string;
  amount: string;
  method: 'SSLCOMMERZ' | 'STRIPE' | 'BKASH';
  status: PaymentStatus;
  transactionId: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface Shipment {
  id: string;
  trackingCode: string;
  senderId: string;
  recipientName: string;
  recipientPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  originHubId: string | null;
  destinationHubId: string | null;
  courierId: string | null;
  weightKg: number;
  parcelType: string;
  declaredValue: string;
  deliveryFee: string;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
  sender?: Pick<User, 'id' | 'name' | 'email' | 'phone'>;
  courier?: CourierProfile | null;
  originHub?: Hub | null;
  destinationHub?: Hub | null;
  statusHistory?: ShipmentStatusHistoryEntry[];
  payment?: Payment | null;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown> | null;
  createdAt: string;
  actor?: Pick<User, 'id' | 'name' | 'email'>;
}

export interface DashboardStats {
  totalUsers: number;
  totalCouriers: number;
  totalShipments: number;
  deliveredCount: number;
  pendingCount: number;
  totalRevenue: string;
}

export interface AuthPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}
