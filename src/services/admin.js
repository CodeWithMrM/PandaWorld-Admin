import api from '@/lib/api';

export async function fetchUsers(params = {}) {
  const { data } = await api.get('/users', { params });
  return { users: data.data, meta: data.meta };
}

export async function fetchUserById(id) {
  const { data } = await api.get(`/users/${id}`);
  return data.data;
}

export async function updateUserRole(userId, role) {
  const { data } = await api.patch(`/users/${userId}/role`, { role });
  return data.data;
}

export async function deleteUserById(userId) {
  await api.delete(`/users/${userId}`);
}
