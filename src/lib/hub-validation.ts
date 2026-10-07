import { z } from 'zod';

// Matches backend/src/modules/hub/hub.validation.ts
export const hubSchema = z.object({
  name: z.string().min(2, 'Hub name must be at least 2 characters'),
  city: z.string().min(2, 'City is required'),
  zone: z.string().min(1, 'Zone is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
});
export type HubInput = z.infer<typeof hubSchema>;
