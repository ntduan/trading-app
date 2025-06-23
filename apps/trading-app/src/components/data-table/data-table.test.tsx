import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { DataTable, DataTableRow, EmptyState } from './data-table';

describe('DataTable', () => {
  it('renders columns as header', () => {
    render(
      <DataTable columns={['Col1', 'Col2']}>
        <div>Row</div>
      </DataTable>
    );
    expect(screen.getByText('Col1')).toBeInTheDocument();
    expect(screen.getByText('Col2')).toBeInTheDocument();
  });

  it('renders children as table content', () => {
    render(
      <DataTable columns={['Col1']}>
        <div>RowContent</div>
      </DataTable>
    );
    expect(screen.getByText('RowContent')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <DataTable columns={['Col1']} className="custom-class">
        <div>Row</div>
      </DataTable>
    );
    expect(screen.getByText('Row').parentElement?.parentElement).toHaveClass('custom-class');
  });

  it('renders correct grid-cols class based on columns length', () => {
    render(
      <DataTable columns={['A', 'B', 'C']}>
        <div>Row</div>
      </DataTable>
    );
    const header = screen.getByText('A').parentElement;
    expect(header?.className).toContain('grid-cols-3');
  });
});

describe('DataTableRow', () => {
  it('renders children', () => {
    render(<DataTableRow>RowChild</DataTableRow>);
    expect(screen.getByText('RowChild')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<DataTableRow onClick={onClick}>ClickableRow</DataTableRow>);
    fireEvent.click(screen.getByText('ClickableRow'));
    expect(onClick).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<DataTableRow className="row-class">Row</DataTableRow>);
    expect(screen.getByText('Row')).toHaveClass('row-class');
  });
});

describe('EmptyState', () => {
  it('renders message', () => {
    render(<EmptyState message="No data" />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders default icon if icon prop is not provided', () => {
    render(<EmptyState message="Empty" />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders custom icon if provided', () => {
    const CustomIcon = () => <span data-testid="custom-icon">Icon</span>;
    render(<EmptyState message="Empty" icon={<CustomIcon />} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
