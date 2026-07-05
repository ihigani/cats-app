import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import {
  useCatQuery,
  useCreateCatMutation,
  useDeleteCatMutation,
  useUpdateCatMutation,
} from '../hooks/cats.queries';
import type { ICatFormData } from '../types/cat.types';

const EMPTY_FORM: ICatFormData = {
  firstName: '',
  lastName: '',
  description: '',
  image: '',
  mice: [{ name: '' }],
};

const inputClassName =
  'mt-1 w-full rounded-lg border border-amber-200 px-3 py-2 outline-none ring-amber-400 focus:ring-2';

export const CatFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const catId = id ? Number(id) : undefined;

  const {
    data: cat,
    isLoading: isLoadingCat,
    error: loadError,
  } = useCatQuery(isEditing ? catId : undefined);

  const createCatMutation = useCreateCatMutation();
  const updateCatMutation = useUpdateCatMutation();
  const deleteCatMutation = useDeleteCatMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ICatFormData>({
    defaultValues: EMPTY_FORM,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'mice',
  });

  useEffect(() => {
    if (!cat) return;

    reset({
      firstName: cat.firstName,
      lastName: cat.lastName,
      description: cat.description,
      image: cat.image,
      mice: cat.mice.length
        ? cat.mice.map((mouse) => ({ name: mouse.name }))
        : [{ name: '' }],
    });
  }, [cat, reset]);

  const isSaving =
    isSubmitting || createCatMutation.isPending || updateCatMutation.isPending;
  const isDeleting = deleteCatMutation.isPending;

  const mutationError =
    createCatMutation.error ??
    updateCatMutation.error ??
    deleteCatMutation.error;

  const errorMessage =
    loadError instanceof Error
      ? loadError.message
      : mutationError instanceof Error
        ? mutationError.message
        : null;

  const onSubmit = handleSubmit(async (formData) => {
    const payload: ICatFormData = {
      ...formData,
      mice: formData.mice.filter((mouse) => mouse.name.trim()),
    };

    if (isEditing && catId) {
      await updateCatMutation.mutateAsync({ id: catId, data: payload });
    } else {
      await createCatMutation.mutateAsync(payload);
    }

    navigate('/');
  });

  const handleDelete = async () => {
    if (!catId) return;

    const confirmed = window.confirm('Delete this cat permanently?');
    if (!confirmed) return;

    await deleteCatMutation.mutateAsync(catId);
    navigate('/');
  };

  return (
    <Layout title={isEditing ? 'Edit Cat' : 'Add Cat'}>
      {errorMessage ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {isLoadingCat && isEditing && !cat ? (
        <p className="text-slate-600">Loading cat...</p>
      ) : (
        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-2xl border border-amber-100 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              First name
              <input
                {...register('firstName', { required: 'First name is required' })}
                className={inputClassName}
              />
              {errors.firstName ? (
                <span className="mt-1 block text-sm text-red-600">
                  {errors.firstName.message}
                </span>
              ) : null}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Last name
              <input
                {...register('lastName', { required: 'Last name is required' })}
                className={inputClassName}
              />
              {errors.lastName ? (
                <span className="mt-1 block text-sm text-red-600">
                  {errors.lastName.message}
                </span>
              ) : null}
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              {...register('description')}
              rows={4}
              className={inputClassName}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Image URL
            <input
              type="url"
              {...register('image')}
              className={inputClassName}
              placeholder="https://..."
            />
          </label>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Mice</p>
              <button
                type="button"
                onClick={() => append({ name: '' })}
                className="rounded-lg border border-amber-300 px-3 py-1 text-sm font-semibold text-amber-800 transition hover:bg-amber-50"
              >
                Add Mouse
              </button>
            </div>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <input
                    {...register(`mice.${index}.name` as const)}
                    className="flex-1 rounded-lg border border-amber-200 px-3 py-2 outline-none ring-amber-400 focus:ring-2"
                    placeholder="Mouse name"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
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
              disabled={isSaving || isDeleting}
              className="rounded-lg bg-amber-500 px-5 py-2 font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
            >
              {isEditing ? 'Update' : 'Save'}
            </button>
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving || isDeleting}
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
