export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const buildPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): IPaginatedResponse<T> => ({
  data,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit) || 1,
});
