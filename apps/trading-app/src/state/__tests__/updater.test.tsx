import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Updater } from '../updater';

describe('Updater', () => {
  it('renders without crashing', () => {
    render(<Updater />);
  });
});
