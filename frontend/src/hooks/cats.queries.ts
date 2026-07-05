import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCat,
  deleteCat,
  fetchCat,
  fetchCats,
  updateCat,
} from '../api/cats.api';
import type { ICatFormData, ICatsFilters } from '../types/cat.types';

export const catKeys = {
  all: ['cats'] as const,
  lists: () => [...catKeys.all, 'list'] as const,
  list: (filters: ICatsFilters) => [...catKeys.lists(), filters] as const,
  details: () => [...catKeys.all, 'detail'] as const,
  detail: (id: number) => [...catKeys.details(), id] as const,
};

export const useCatsQuery = (filters: ICatsFilters) =>
  useQuery({
    queryKey: catKeys.list(filters),
    queryFn: () => fetchCats(filters),
  });

export const useCatQuery = (id?: number) =>
  useQuery({
    queryKey: catKeys.detail(id ?? 0),
    queryFn: () => fetchCat(id!),
    enabled: Boolean(id) && !Number.isNaN(id),
  });

export const useCreateCatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICatFormData) => createCat(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: catKeys.lists() });
    },
  });
};

export const useUpdateCatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ICatFormData }) =>
      updateCat(id, data),
    onSuccess: (_cat, { id }) => {
      void queryClient.invalidateQueries({ queryKey: catKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: catKeys.detail(id) });
    },
  });
};

export const useDeleteCatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCat(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: catKeys.lists() });
    },
  });
};
