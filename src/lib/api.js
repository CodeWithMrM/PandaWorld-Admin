import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("PandaWorld API URL:", import.meta.env.VITE_API_URL);
console.log("PandaWorld Axios baseURL:", baseURL);

export const api = axios.create({ baseURL });

// Clerk's `getToken()` is only available inside React (via useAuth()), so
// we let a top-level provider component register it here once, and every
// outgoing request picks up a fresh token through this interceptor.
let getTokenFn = null;

export function registerAuthTokenGetter(fn) {
  getTokenFn = fn;
}

api.interceptors.request.use(async (config) => {
  console.log("API REQUEST:", config.method?.toUpperCase(), config.url);
  console.log("Token getter exists:", !!getTokenFn);

  if (getTokenFn) {
    try {
      const token = await getTokenFn();

      console.log("Clerk token received:", !!token);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Authorization header attached");
      }
    } catch (error) {
      console.error("Failed to get Clerk token:", error);
    }
  }

  return config;
});

// Normalizes backend error responses ({ success:false, message, errors })
// into a plain Error with a friendly message, so UI code can just do
// `catch (err) { toast(err.message) }`.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    const wrapped = new Error(message);
    wrapped.status = error.response?.status;
    wrapped.errors = error.response?.data?.errors;
    return Promise.reject(wrapped);
  }
);

export default api;
