import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from './card';

describe('Card components', () => {
  it('renders Card with default and custom className', () => {
    const { getByTestId } = render(
      <Card data-testid="card" className="custom-class">
        Content
      </Card>
    );
    const card = getByTestId('card');
    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveAttribute('data-slot', 'card');
    expect(card.textContent).toBe('Content');
  });

  it('renders CardHeader with default and custom className', () => {
    const { getByTestId } = render(
      <CardHeader data-testid="card-header" className="header-class">
        Header
      </CardHeader>
    );
    const header = getByTestId('card-header');
    expect(header).toHaveClass('header-class');
    expect(header).toHaveAttribute('data-slot', 'card-header');
    expect(header.textContent).toBe('Header');
  });

  it('renders CardTitle with default and custom className', () => {
    const { getByTestId } = render(
      <CardTitle data-testid="card-title" className="title-class">
        Title
      </CardTitle>
    );
    const title = getByTestId('card-title');
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveClass('title-class');
    expect(title).toHaveAttribute('data-slot', 'card-title');
    expect(title.textContent).toBe('Title');
  });

  it('renders CardDescription with default and custom className', () => {
    const { getByTestId } = render(
      <CardDescription data-testid="card-description" className="desc-class">
        Description
      </CardDescription>
    );
    const desc = getByTestId('card-description');
    expect(desc).toHaveClass('text-muted-foreground');
    expect(desc).toHaveClass('desc-class');
    expect(desc).toHaveAttribute('data-slot', 'card-description');
    expect(desc.textContent).toBe('Description');
  });

  it('renders CardAction with default and custom className', () => {
    const { getByTestId } = render(
      <CardAction data-testid="card-action" className="action-class">
        Action
      </CardAction>
    );
    const action = getByTestId('card-action');
    expect(action).toHaveClass('action-class');
    expect(action).toHaveAttribute('data-slot', 'card-action');
    expect(action.textContent).toBe('Action');
  });

  it('renders CardContent with default and custom className', () => {
    const { getByTestId } = render(
      <CardContent data-testid="card-content" className="content-class">
        Content
      </CardContent>
    );
    const content = getByTestId('card-content');
    expect(content).toHaveClass('px-6');
    expect(content).toHaveClass('content-class');
    expect(content).toHaveAttribute('data-slot', 'card-content');
    expect(content.textContent).toBe('Content');
  });

  it('renders CardFooter with default and custom className', () => {
    const { getByTestId } = render(
      <CardFooter data-testid="card-footer" className="footer-class">
        Footer
      </CardFooter>
    );
    const footer = getByTestId('card-footer');
    expect(footer).toHaveClass('footer-class');
    expect(footer).toHaveAttribute('data-slot', 'card-footer');
    expect(footer.textContent).toBe('Footer');
  });

  it('passes arbitrary props to Card', () => {
    const { getByTestId } = render(
      <Card data-testid="card" aria-label="my-card">
        Test
      </Card>
    );
    expect(getByTestId('card')).toHaveAttribute('aria-label', 'my-card');
  });

  it('passes arbitrary props to CardHeader', () => {
    const { getByTestId } = render(
      <CardHeader data-testid="card-header" aria-label="header">
        Test
      </CardHeader>
    );
    expect(getByTestId('card-header')).toHaveAttribute('aria-label', 'header');
  });

  it('passes arbitrary props to CardTitle', () => {
    const { getByTestId } = render(
      <CardTitle data-testid="card-title" aria-label="title">
        Test
      </CardTitle>
    );
    expect(getByTestId('card-title')).toHaveAttribute('aria-label', 'title');
  });

  it('passes arbitrary props to CardDescription', () => {
    const { getByTestId } = render(
      <CardDescription data-testid="card-description" aria-label="desc">
        Test
      </CardDescription>
    );
    expect(getByTestId('card-description')).toHaveAttribute('aria-label', 'desc');
  });

  it('passes arbitrary props to CardAction', () => {
    const { getByTestId } = render(
      <CardAction data-testid="card-action" aria-label="action">
        Test
      </CardAction>
    );
    expect(getByTestId('card-action')).toHaveAttribute('aria-label', 'action');
  });

  it('passes arbitrary props to CardContent', () => {
    const { getByTestId } = render(
      <CardContent data-testid="card-content" aria-label="content">
        Test
      </CardContent>
    );
    expect(getByTestId('card-content')).toHaveAttribute('aria-label', 'content');
  });

  it('passes arbitrary props to CardFooter', () => {
    const { getByTestId } = render(
      <CardFooter data-testid="card-footer" aria-label="footer">
        Test
      </CardFooter>
    );
    expect(getByTestId('card-footer')).toHaveAttribute('aria-label', 'footer');
  });
});
