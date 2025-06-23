import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

// Mock @radix-ui/react-tabs
vi.mock('@radix-ui/react-tabs', () => {
  return {
    __esModule: true,
    Root: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div data-mock="Root" {...props}>
        {children}
      </div>
    ),
    List: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div data-mock="List" {...props}>
        {children}
      </div>
    ),
    Trigger: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <button data-mock="Trigger" {...props}>
        {children}
      </button>
    ),
    Content: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div data-mock="Content" {...props}>
        {children}
      </div>
    ),
  };
});

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

describe('Tabs components', () => {
  it('renders Tabs with className and props', () => {
    render(<Tabs className="custom-tabs" data-testid="tabs" />);
    const el = screen.getByTestId('tabs');
    expect(el).toHaveClass('flex flex-col gap-2 custom-tabs');
    expect(el).toHaveAttribute('data-slot', 'tabs');
  });

  it('renders TabsList with className and props', () => {
    render(<TabsList className="custom-list" data-testid="tabs-list" />);
    const el = screen.getByTestId('tabs-list');
    expect(el).toHaveClass('relative py-2 border-b border-border select-none custom-list');
    expect(el).toHaveAttribute('data-slot', 'tabs-list');
  });

  it('renders TabsTrigger with className and props', () => {
    render(
      <TabsTrigger value="tab1" className="custom-trigger" data-testid="tabs-trigger">
        Tab 1
      </TabsTrigger>
    );
    const el = screen.getByTestId('tabs-trigger');
    expect(el).toHaveClass('cursor-pointer');
    expect(el).toHaveClass('custom-trigger');
    expect(el).toHaveAttribute('data-slot', 'tabs-trigger');
    expect(el).toHaveTextContent('Tab 1');
  });

  it('renders TabsContent with className and props', () => {
    render(
      <TabsContent value="tab1" className="custom-content" data-testid="tabs-content">
        Content
      </TabsContent>
    );
    const el = screen.getByTestId('tabs-content');
    expect(el).toHaveClass('flex-1 outline-none custom-content');
    expect(el).toHaveAttribute('data-slot', 'tabs-content');
    expect(el).toHaveTextContent('Content');
  });

  it('passes all extra props to underlying primitive', () => {
    render(
      <Tabs data-testid="tabs" aria-label="tabs-label">
        <TabsList data-testid="tabs-list" aria-label="list-label">
          <TabsTrigger value="trigger1" data-testid="tabs-trigger" aria-label="trigger-label">
            Trigger
          </TabsTrigger>
        </TabsList>
        <TabsContent value="trigger1" data-testid="tabs-content" aria-label="content-label">
          Content
        </TabsContent>
      </Tabs>
    );
    expect(screen.getByTestId('tabs')).toHaveAttribute('aria-label', 'tabs-label');
    expect(screen.getByTestId('tabs-list')).toHaveAttribute('aria-label', 'list-label');
    expect(screen.getByTestId('tabs-trigger')).toHaveAttribute('aria-label', 'trigger-label');
    expect(screen.getByTestId('tabs-content')).toHaveAttribute('aria-label', 'content-label');
  });
});
