import constate from 'constate';
import { useCallback, useState } from 'react';
import {
  createCat,
  deleteCat,
  fetchCat,
  fetchCats,
  updateCat,
} from '../api/cats.api';
import type {
  ICat,
  ICatFormData,
  ICatsFilters,
  IPaginatedCats,
} from '../types/cat.types';

const DEFAULT_FILTERS: ICatsFilters = {
  catName: '',
  mouseName: '',
  page: 1,
  limit: 6,
};

const useCatsState = () => {
  const [catsResult, setCatsResult] = useState<IPaginatedCats | null>(null);
  const [selectedCat, setSelectedCat] = useState<ICat | null>(null);
  const [filters, setFilters] = useState<ICatsFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCats = useCallback(async (nextFilters?: Partial<ICatsFilters>) => {
    setIsLoading(true);
    setError(null);

    const mergedFilters = { ...filters, ...nextFilters };
    setFilters(mergedFilters);

    try {
      const result = await fetchCats(mergedFilters);
      setCatsResult(result);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : 'Failed to load cats';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const loadCat = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const cat = await fetchCat(id);
      setSelectedCat(cat);
      return cat;
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : 'Failed to load cat';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveCat = useCallback(
    async (data: ICatFormData, id?: number) => {
      setIsLoading(true);
      setError(null);

      try {
        if (id) {
          await updateCat(id, data);
        } else {
          await createCat(data);
        }
        await loadCats({ page: 1 });
        return true;
      } catch (saveError) {
        const message =
          saveError instanceof Error ? saveError.message : 'Failed to save cat';
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [loadCats],
  );

  const removeCat = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);

      try {
        await deleteCat(id);
        await loadCats();
        return true;
      } catch (removeError) {
        const message =
          removeError instanceof Error
            ? removeError.message
            : 'Failed to delete cat';
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [loadCats],
  );

  const clearSelectedCat = useCallback(() => {
    setSelectedCat(null);
  }, []);

  return {
    catsResult,
    selectedCat,
    filters,
    isLoading,
    error,
    loadCats,
    loadCat,
    saveCat,
    removeCat,
    clearSelectedCat,
    setFilters,
  };
};

export const [CatsProvider, useCats] = constate(useCatsState);
