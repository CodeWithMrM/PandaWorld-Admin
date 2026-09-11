import api from '@/lib/api';

export async function fetchCurrentUser() {
  const response = await api.get("/auth/me");

  console.log("AUTH ME STATUS:", response.status);
  console.log("AUTH ME RESPONSE:", response.data);

  return response.data?.data;
}

export async function fetchOrderById(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data.data;
}

/**
 * Admins hit the same GET /api/orders endpoint as customers — the backend
 * returns ALL orders (not just the caller's) when the caller is an admin.
 * Supports ?status=, ?paymentStatus=, ?userId= filters.
 */
export async function fetchAllOrders(params = {}) {
  const { data } = await api.get('/orders', { params });
  return { orders: data.data, meta: data.meta };
}

export async function updateOrderStatus(orderId, status) {
  const { data } = await api.patch(`/orders/${orderId}/status`, { status });
  return data.data;
}
