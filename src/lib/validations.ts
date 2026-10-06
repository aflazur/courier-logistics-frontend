import { z } from 'zod';

// Matches backend/src/modules/auth/auth.validation.ts
export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['CUSTOMER', 'COURIER']),
});
export type RegisterInput = z.infer<typeof registerSchema>;

// Matches backend/src/modules/shipment/shipment.validation.ts - split into per-wizard-step
// pieces, then merged for the final submit.
export const shipmentRecipientStepSchema = z.object({
  recipientName: z.string().min(2, 'Recipient name is required'),
  recipientPhone: z.string().min(6, 'Enter a valid phone number'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
});
export type ShipmentRecipientStepInput = z.infer<typeof shipmentRecipientStepSchema>;

export const shipmentPackageStepSchema = z.object({
  pickupAddress: z.string().min(5, 'Pickup address is required'),
  weightKg: z.coerce.number().positive('Weight must be greater than 0'),
  parcelType: z.string().optional(),
  declaredValue: z.coerce.number().nonnegative().optional(),
});
export type ShipmentPackageStepInput = z.infer<typeof shipmentPackageStepSchema>;

export const createShipmentSchema = shipmentRecipientStepSchema.merge(shipmentPackageStepSchema);
export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().min(6, 'Enter a valid phone number').optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const courierProfileSchema = z.object({
  isAvailable: z.boolean().optional(),
  vehicleType: z.string().optional(),
  licenseNumber: z.string().optional(),
});
export type CourierProfileInput = z.infer<typeof courierProfileSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
export type ContactInput = z.infer<typeof contactSchema>;
