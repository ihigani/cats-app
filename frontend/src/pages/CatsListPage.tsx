import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CatCard } from '../components/CatCard';
import { Layout } from '../components/Layout';
import { Pagination } from '../components/Pagination';
import { useCats } from '../state/cats.state';

export const CatsListPage = () => {
  const navigate = useNavigate();
  const { catsResult, filters, isLoading, error, loadCats, removeCat } =
    useCats();
  const [catNameInput, setCatNameInput] = useState(filters.catName);
  const [mouseNameInput, setMouseNameInput] = useState(filters.mouseName);

  useEffect(() => {
    void loadCats();
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void loadCats({
      catName: catNameInput.trim(),
      mouseName: mouseNameInput.trim(),
      page: 1,
    });
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Delete this cat?');
    if (!confirmed) return;
    await removeCat(id);
  };

  return (
    <Layout title="Cats List">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <form
          onSubmit={handleSearch}
          className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <label className="block text-sm font-medium text-slate-700">
            Filter by cat name
            <input
              value={catNameInput}
              onChange={(event) => setCatNameInput(event.target.value)}
              className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2 outline-none ring-amber-400 focus:ring-2"
              placeholder="e.g. Luna"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Filter by mouse name
            <input
              value={mouseNameInput}
              onChange={(event) => setMouseNameInput(event.target.value)}
              className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2 outline-none ring-amber-400 focus:ring-2"
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

      {error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
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
            onPageChange={(page) => void loadCats({ page })}
          />
        </div>
      ) : null}
    </Layout>
  );
};
