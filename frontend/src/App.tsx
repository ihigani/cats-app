import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CatFormPage } from './pages/CatFormPage';
import { CatsListPage } from './pages/CatsListPage';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CatsListPage />} />
      <Route path="/cats/new" element={<CatFormPage />} />
      <Route path="/cats/:id/edit" element={<CatFormPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
