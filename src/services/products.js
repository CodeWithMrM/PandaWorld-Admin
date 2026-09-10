import api from '@/lib/api';

/**
 * Fetches products with pagination/search/filter/sort — maps straight onto
 * GET /api/products?search=&categoryId=&sortBy=price|name&order=asc|desc&page=&limit=
 */
export async function fetchProducts(params = {}) {
  const { data } = await api.get('/products', { params });
  return { products: data.data, meta: data.meta };
}

export async function fetchProductById(id) {
  const { data } = await api.get(`/products/${id}`);
  return data.data;
}

export async function fetchCategories() {
  const { data } = await api.get('/categories');
  return data.data;
}

export async function fetchCategoryById(id) {
  const { data } = await api.get(`/categories/${id}`);
  return data.data;
}

// ---------------------------------------------------------------------------
// Admin-only mutations (all require an ADMIN-role Clerk session)
// ---------------------------------------------------------------------------

/** Builds multipart form-data so the optional `imageFile` can ride along with the fields. */
function toProductFormData(fields) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (key === 'imageFile') return;
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  if (fields.imageFile) formData.append('image', fields.imageFile);
  return formData;
}

export async function createProduct(fields) {
  const { data } = await api.post('/products', toProductFormData(fields), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateProduct(id, fields) {
  const { data } = await api.put(`/products/${id}`, toProductFormData(fields), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function deleteProduct(id) {
  await api.delete(`/products/${id}`);
}

export async function createCategory(name) {
  const { data } = await api.post('/categories', { name });
  return data.data;
}

export async function updateCategory(id, name) {
  const { data } = await api.put(`/categories/${id}`, { name });
  return data.data;
}

export async function deleteCategory(id) {
  await api.delete(`/categories/${id}`);
}
