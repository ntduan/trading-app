import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock localStorage if needed
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).localStorage = localStorageMock;

// Mock sessionStorage if needed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).sessionStorage = localStorageMock;
