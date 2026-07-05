import type { ICat } from '../types/cat.types';

interface ICatCardProps {
  cat: ICat;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const CatCard = ({ cat, onEdit, onDelete }: ICatCardProps) => (
  <article className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
    <div className="flex flex-col gap-4 p-5 sm:flex-row">
      {cat.image ? (
        <img
          src={cat.image}
          alt={`${cat.firstName} ${cat.lastName}`}
          className="h-40 w-full rounded-xl object-cover sm:w-40"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded-xl bg-amber-100 text-4xl sm:w-40">
          🐱
        </div>
      )}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-slate-900">
          {cat.firstName} {cat.lastName}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {cat.description || 'No description provided.'}
        </p>
        <div className="mt-4">
          <p className="text-sm font-semibold text-amber-800">Mice</p>
          {cat.mice.length ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {cat.mice.map((mouse) => (
                <li
                  key={mouse.id}
                  className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900"
                >
                  🐭 {mouse.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No mice yet.</p>
          )}
        </div>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => onEdit(cat.id)}
            className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(cat.id)}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </article>
);
