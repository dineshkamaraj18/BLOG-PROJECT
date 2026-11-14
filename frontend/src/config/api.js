// Base API URL
// In Vercel Multi-Service deployment or local Vite dev (via proxy): defaults to empty string ''
// Routes /api requests to the backend service under the unified domain
// Set VITE_API_URL only if pointing to an external backend host
const envUrl = import.meta.env.VITE_API_URL;
export const API_BASE_URL = envUrl ? envUrl.replace(/\/$/, '') : '';
