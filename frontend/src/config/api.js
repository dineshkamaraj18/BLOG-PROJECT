// Base API URL
// In local development: empty string '' (uses Vite proxy /api -> http://localhost:5000)
// In production on Vercel: set environment variable VITE_API_URL to your Render backend URL
const envUrl = import.meta.env.VITE_API_URL;
export const API_BASE_URL = envUrl ? envUrl.replace(/\/$/, '') : '';
