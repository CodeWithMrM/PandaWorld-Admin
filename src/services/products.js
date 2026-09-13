import api from '@/lib/api';
import axios from 'axios';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

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

export async function createProduct(fields) {
  const { data } = await api.post('/products', fields);
  return data.data;
}

export async function updateProduct(id, fields) {
  const { data } = await api.put(`/products/${id}`, fields);
  return data.data;
}

export async function uploadProductImage(file, onUploadProgress) {
  if (!file || !ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Choose a JPEG, PNG, WebP, or GIF image');
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Image must be 5 MB or smaller');
  }

  const { data: authResponse } = await api.get('/imagekit/auth');
  const { token, signature, expire, publicKey } = authResponse.data;
  const uploadData = new FormData();
  uploadData.append('file', file);
  uploadData.append('fileName', file.name);
  uploadData.append('token', token);
  uploadData.append('signature', signature);
  uploadData.append('expire', String(expire));
  uploadData.append('publicKey', publicKey);

  try {
    const { data } = await axios.post('https://upload.imagekit.io/api/v1/files/upload', uploadData, {
      onUploadProgress: (event) => {
        if (event.total && onUploadProgress) onUploadProgress(Math.round((event.loaded * 100) / event.total));
      },
    });
    return {
      url: data.url,
      fileId: data.fileId,
      filePath: data.filePath,
      name: data.name,
      width: data.width,
      height: data.height,
      size: data.size,
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Image upload failed');
  }
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
