import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { CatCard } from '../components/CatCard';
import { Layout } from '../components/Layout';
import { Pagination } from '../components/Pagination';
import { useCatsQuery, useDeleteCatMutation } from '../hooks/cats.queries';
import type { ICatsFilters } from '../types/cat.types';

const DEFAULT_FILTERS: ICatsFilters = {
  catName: '',
  mouseName: '',
  page: 1,
  limit: 6,
};

interface ISearchFormData {
  catName: string;
  mouseName: string;
}

const searchInputClassName =
  'mt-1 w-full rounded-lg border border-amber-200 px-3 py-2 outline-none ring-amber-400 focus:ring-2';

export const CatsListPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ICatsFilters>(DEFAULT_FILTERS);

  const { data: catsResult, isLoading, error } = useCatsQuery(filters);
  const deleteCatMutation = useDeleteCatMutation();

  const { register, handleSubmit } = useForm<ISearchFormData>({
    defaultValues: {
      catName: DEFAULT_FILTERS.catName,
      mouseName: DEFAULT_FILTERS.mouseName,
    },
  });

  const onSearch = handleSubmit((values) => {
    setFilters((current) => ({
      ...current,
      catName: values.catName.trim(),
      mouseName: values.mouseName.trim(),
      page: 1,
    }));
  });

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Delete this cat?');
    if (!confirmed) return;

    await deleteCatMutation.mutateAsync(id);
  };

  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <Layout title="Cats List">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <form
          onSubmit={onSearch}
          className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <label className="block text-sm font-medium text-slate-700">
            Filter by cat name
            <input
              {...register('catName')}
              className={searchInputClassName}
              placeholder="e.g. Luna"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Filter by mouse name
            <input
              {...register('mouseName')}
              className={searchInputClassName}
              placeholder="e.g. Jerry"
            />
          </label>
          <button
            type="submit"
            className="h-fit rounded-lg bg-amber-500 px-4 py-2 font-semibold text-white transition hover:bg-amber-600 sm:mt-6"
          >
            Search
          </button>
        </form>
        <Link
          to="/cats/new"
          className="rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Add Cat
        </Link>
      </div>

      {errorMessage ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {isLoading && !catsResult ? (
        <p className="text-center text-slate-600">Loading cats...</p>
      ) : null}

      <div className="grid gap-5">
        {catsResult?.data.map((cat) => (
          <CatCard
            key={cat.id}
            cat={cat}
            onEdit={(id) => navigate(`/cats/${id}/edit`)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {!isLoading && catsResult?.data.length === 0 ? (
        <p className="mt-8 text-center text-slate-600">No cats found.</p>
      ) : null}

      {catsResult ? (
        <div className="mt-8">
          <Pagination
            page={catsResult.page}
            totalPages={catsResult.totalPages}
            onPageChange={(page) =>
              setFilters((current) => ({ ...current, page }))
            }
          />
        </div>
      ) : null}
    </Layout>
  );
};
