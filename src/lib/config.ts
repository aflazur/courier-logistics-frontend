// Server-side only - the real backend URL never needs to be exposed to the browser, since all
// client-side calls go through our own /api/proxy route handlers instead of hitting it directly.
export const BACKEND_URL = process.env.BACKEND_API_URL ?? 'http://localhost:5000/api/v1';
