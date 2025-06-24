import AboutPage from '../page';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('AboutPage', () => {
  it('renders coming soon message', () => {
    const { getByText } = render(<AboutPage />);
    expect(getByText(/Comming soon/i)).toBeInTheDocument();
  });
});
