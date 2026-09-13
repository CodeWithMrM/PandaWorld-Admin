import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Clerk's getToken() is only available inside React.
 *
 * AuthBootstrap registers it once, allowing Axios to
 * retrieve a fresh Clerk token for every request.
 */
let getTokenFn = null;

export function registerAuthTokenGetter(fn) {
  getTokenFn = fn;
}

/**
 * Attach the current Clerk session token to requests.
 */
api.interceptors.request.use(
  async (config) => {
    if (!getTokenFn) {
      return config;
    }

    try {
      const token = await getTokenFn();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Request continues without authentication.
      // Protected endpoints will return 401.
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Normalize API errors into a standard Error object.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    const wrapped = new Error(message);

    wrapped.status = error.response?.status;
    wrapped.errors = error.response?.data?.errors;

    return Promise.reject(wrapped);
  }
);

export default api;