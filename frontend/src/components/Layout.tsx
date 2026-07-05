import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ILayoutProps {
  children: ReactNode;
  title: string;
}

export const Layout = ({ children, title }: ILayoutProps) => (
  <div className="min-h-screen bg-amber-50 text-slate-800">
    <header className="border-b border-amber-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div>
          <p className="text-sm font-medium text-amber-700">Cats Management</p>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        </div>
        <Link
          to="/"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
        >
          Cats List
        </Link>
      </div>
    </header>
    <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
  </div>
);
