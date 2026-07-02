import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useCats } from '../state/cats.state';
import type { ICatFormData } from '../types/cat.types';

const EMPTY_FORM: ICatFormData = {
  firstName: '',
  lastName: '',
  description: '',
  image: '',
  mice: [{ name: '' }],
};

export const CatFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const catId = id ? Number(id) : undefined;
  const { selectedCat, isLoading, error, loadCat, saveCat, removeCat, clearSelectedCat } =
    useCats();
  const [formData, setFormData] = useState<ICatFormData>(EMPTY_FORM);

  useEffect(() => {
    if (!isEditing || !catId || Number.isNaN(catId)) return;

    const load = async () => {
      const cat = await loadCat(catId);
      if (!cat) return;

      setFormData({
        firstName: cat.firstName,
        lastName: cat.lastName,
        description: cat.description,
        image: cat.image,
        mice: cat.mice.length
          ? cat.mice.map((mouse) => ({ name: mouse.name }))
          : [{ name: '' }],
      });
    };

    void load();

    return () => {
      clearSelectedCat();
    };
  }, [catId, clearSelectedCat, isEditing, loadCat]);

  const updateField = <K extends keyof ICatFormData>(
    field: K,
    value: ICatFormData[K],
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateMouseName = (index: number, name: string) => {
    setFormData((current) => ({
      ...current,
      mice: current.mice.map((mouse, mouseIndex) =>
        mouseIndex === index ? { name } : mouse,
      ),
    }));
  };

  const addMouseField = () => {
    setFormData((current) => ({
      ...current,
      mice: [...current.mice, { name: '' }],
    }));
  };

  const removeMouseField = (index: number) => {
    setFormData((current) => ({
      ...current,
      mice: current.mice.filter((_, mouseIndex) => mouseIndex !== index),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: ICatFormData = {
      ...formData,
      mice: formData.mice.filter((mouse) => mouse.name.trim()),
    };

    const saved = await saveCat(payload, catId);
    if (saved) navigate('/');
  };

  const handleDelete = async () => {
    if (!catId) return;

    const confirmed = window.confirm('Delete this cat permanently?');
    if (!confirmed) return;

    const deleted = await removeCat(catId);
    if (deleted) navigate('/');
  };

  return (
    <Layout title={isEditing ? 'Edit Cat' : 'Add Cat'}>
      {error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {isLoading && isEditing && !selectedCat ? (
        <p className="text-slate-600">Loading cat...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              First name
              <input
                required
                value={formData.firstName}
                onChange={(event) => updateField('firstName', event.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2 outline-none ring-amber-400 focus:ring-2"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Last name
              <input
                required
                value={formData.lastName}
                onChange={(event) => updateField('lastName', event.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2 outline-none ring-amber-400 focus:ring-2"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              value={formData.description}
              onChange={(event) => updateField('description', event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2 outline-none ring-amber-400 focus:ring-2"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Image URL
            <input
              type="url"
              value={formData.image}
              onChange={(event) => updateField('image', event.target.value)}
              className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2 outline-none ring-amber-400 focus:ring-2"
              placeholder="https://..."
            />
          </label>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Mice</p>
              <button
                type="button"
                onClick={addMouseField}
                className="rounded-lg border border-amber-300 px-3 py-1 text-sm font-semibold text-amber-800 transition hover:bg-amber-50"
              >
                Add Mouse
              </button>
            </div>
            <div className="space-y-3">
              {formData.mice.map((mouse, index) => (
                <div key={`mouse-${index}`} className="flex gap-3">
                  <input
                    value={mouse.name}
                    onChange={(event) => updateMouseName(index, event.target.value)}
                    className="flex-1 rounded-lg border border-amber-200 px-3 py-2 outline-none ring-amber-400 focus:ring-2"
                    placeholder="Mouse name"
                  />
                  <button
                    type="button"
                    onClick={() => removeMouseField(index)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-amber-500 px-5 py-2 font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
            >
              {isEditing ? 'Update' : 'Save'}
            </button>
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="rounded-lg border border-red-200 px-5 py-2 font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
              >
                Delete Cat
              </button>
            ) : null}
            <Link
              to="/"
              className="rounded-lg border border-slate-300 px-5 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to List
            </Link>
          </div>
        </form>
      )}
    </Layout>
  );
};
