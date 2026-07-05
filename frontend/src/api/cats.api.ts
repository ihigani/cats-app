import type {
  ICat,
  ICatFormData,
  ICatsFilters,
  IPaginatedCats,
} from '../types/cat.types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

const buildQueryString = (filters: Partial<ICatsFilters>): string => {
  const params = new URLSearchParams();

  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.catName) params.set('catName', filters.catName);
  if (filters.mouseName) params.set('mouseName', filters.mouseName);

  const query = params.toString();
  return query ? `?${query}` : '';
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const fetchCats = async (
  filters: ICatsFilters,
): Promise<IPaginatedCats> => {
  const response = await fetch(
    `${API_BASE_URL}/cats${buildQueryString(filters)}`,
  );
  return handleResponse<IPaginatedCats>(response);
};

export const fetchCat = async (id: number): Promise<ICat> => {
  const response = await fetch(`${API_BASE_URL}/cats/${id}`);
  return handleResponse<ICat>(response);
};

export const createCat = async (data: ICatFormData): Promise<ICat> => {
  const response = await fetch(`${API_BASE_URL}/cats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<ICat>(response);
};

export const updateCat = async (
  id: number,
  data: ICatFormData,
): Promise<ICat> => {
  const response = await fetch(`${API_BASE_URL}/cats/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<ICat>(response);
};

export const deleteCat = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/cats/${id}`, {
    method: 'DELETE',
  });
  await handleResponse<{ deleted: boolean }>(response);
};
