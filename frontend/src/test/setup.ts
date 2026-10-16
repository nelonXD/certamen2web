import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Limpieza automática tras cada prueba
afterEach(() => {
  cleanup();
  sessionStorage.clear();
  localStorage.clear();
});
