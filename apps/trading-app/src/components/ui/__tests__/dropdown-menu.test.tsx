/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, fireEvent, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '../dropdown-menu';

// Mock @radix-ui/react-dropdown-menu
vi.mock('@radix-ui/react-dropdown-menu', () => {
  return {
    Root: React.forwardRef((props: any, ref) => <div ref={ref} {...props} />),
    Portal: React.forwardRef((props: any, ref) => <div ref={ref} {...props} />),
    Trigger: React.forwardRef((props: any, ref) => <button ref={ref} {...props} />),
    Content: React.forwardRef((props: any, ref) => <div ref={ref} {...props} />),
    Group: React.forwardRef((props: any, ref) => <div ref={ref} {...props} />),
    Label: React.forwardRef((props: any, ref) => <label ref={ref} {...props} />),
    Item: React.forwardRef((props: any, ref) => <div ref={ref} {...props} />),
    CheckboxItem: React.forwardRef((props: any, ref) => <div ref={ref} {...props} />),
    RadioGroup: React.forwardRef((props: any, ref) => <div ref={ref} {...props} />),
    RadioItem: React.forwardRef((props: any, ref) => <div ref={ref} {...props} />),
    Separator: React.forwardRef((props: any, ref) => <hr ref={ref} {...props} />),
    Sub: React.forwardRef((props: any, ref) => <div ref={ref} {...props} />),
    SubTrigger: React.forwardRef((props: any, ref) => <button ref={ref} {...props} />),
    SubContent: React.forwardRef((props: any, ref) => <div ref={ref} {...props} />),
    ItemIndicator: (props: any) => <span {...props} />,
  };
});

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  CheckIcon: (props: any) => <svg data-testid="check-icon" {...props} />,
  ChevronRightIcon: (props: any) => <svg data-testid="chevron-right-icon" {...props} />,
  CircleIcon: (props: any) => <svg data-testid="circle-icon" {...props} />,
}));

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('DropdownMenu components', () => {
  it('renders DropdownMenu', () => {
    render(<DropdownMenu>Menu</DropdownMenu>);
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders DropdownMenuPortal', () => {
    render(<DropdownMenuPortal>Portal</DropdownMenuPortal>);
    expect(screen.getByText('Portal')).toBeInTheDocument();
  });

  it('renders DropdownMenuTrigger', () => {
    render(<DropdownMenuTrigger>Trigger</DropdownMenuTrigger>);
    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

  it('renders DropdownMenuContent with custom className and sideOffset', () => {
    render(
      <DropdownMenuContent className="custom-class" sideOffset={10}>
        Content
      </DropdownMenuContent>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
    const content = screen.getByText('Content');
    expect(content?.className).toContain('custom-class');
  });

  it('renders DropdownMenuGroup', () => {
    render(<DropdownMenuGroup>Group</DropdownMenuGroup>);
    expect(screen.getByText('Group')).toBeInTheDocument();
    expect(screen.getByText('Group')).toHaveAttribute('data-slot', 'dropdown-menu-group');
  });

  it('renders DropdownMenuItem with default and destructive variant', () => {
    render(<DropdownMenuItem>Item</DropdownMenuItem>);
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Item')).toHaveAttribute('data-slot', 'dropdown-menu-item');
    render(<DropdownMenuItem variant="destructive">Destructive</DropdownMenuItem>);
    expect(screen.getByText('Destructive')).toHaveAttribute('data-variant', 'destructive');
  });

  it('renders DropdownMenuItem with inset', () => {
    render(<DropdownMenuItem inset>InsetItem</DropdownMenuItem>);
    expect(screen.getByText('InsetItem')).toHaveAttribute('data-inset', 'true');
  });

  it('renders DropdownMenuCheckboxItem checked and unchecked', () => {
    render(<DropdownMenuCheckboxItem checked>Checked</DropdownMenuCheckboxItem>);
    expect(screen.getByText('Checked')).toHaveAttribute('data-slot', 'dropdown-menu-checkbox-item');
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    render(<DropdownMenuCheckboxItem checked={false}>Unchecked</DropdownMenuCheckboxItem>);
    expect(screen.getByText('Unchecked')).toBeInTheDocument();
  });

  it('renders DropdownMenuRadioGroup', () => {
    render(<DropdownMenuRadioGroup>RadioGroup</DropdownMenuRadioGroup>);
    expect(screen.getByText('RadioGroup')).toHaveAttribute('data-slot', 'dropdown-menu-radio-group');
  });

  it('renders DropdownMenuRadioItem', () => {
    render(<DropdownMenuRadioItem value="radio-item">RadioItem</DropdownMenuRadioItem>);
    expect(screen.getByText('RadioItem')).toHaveAttribute('data-slot', 'dropdown-menu-radio-item');
    expect(screen.getByTestId('circle-icon')).toBeInTheDocument();
  });

  it('renders DropdownMenuLabel with and without inset', () => {
    render(<DropdownMenuLabel>Label</DropdownMenuLabel>);
    expect(screen.getByText('Label')).toHaveAttribute('data-slot', 'dropdown-menu-label');
    render(<DropdownMenuLabel inset>InsetLabel</DropdownMenuLabel>);
    expect(screen.getByText('InsetLabel')).toHaveAttribute('data-inset', 'true');
  });

  it('renders DropdownMenuSeparator', () => {
    render(<DropdownMenuSeparator className="sep-class" />);
    const sep = screen.getByRole('separator');
    expect(sep).toHaveAttribute('data-slot', 'dropdown-menu-separator');
    expect(sep.className).toContain('sep-class');
  });

  it('renders DropdownMenuShortcut', () => {
    render(<DropdownMenuShortcut className="shortcut-class">⌘K</DropdownMenuShortcut>);
    expect(screen.getByText('⌘K')).toHaveAttribute('data-slot', 'dropdown-menu-shortcut');
    expect(screen.getByText('⌘K').className).toContain('shortcut-class');
  });

  it('renders DropdownMenuSub', () => {
    render(<DropdownMenuSub>Sub</DropdownMenuSub>);
    expect(screen.getByText('Sub')).toHaveAttribute('data-slot', 'dropdown-menu-sub');
  });

  it('renders DropdownMenuSubTrigger with and without inset', () => {
    render(<DropdownMenuSubTrigger>SubTrigger</DropdownMenuSubTrigger>);
    expect(screen.getByText('SubTrigger')).toHaveAttribute('data-slot', 'dropdown-menu-sub-trigger');
    expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
    render(<DropdownMenuSubTrigger inset>InsetSubTrigger</DropdownMenuSubTrigger>);
    expect(screen.getByText('InsetSubTrigger')).toHaveAttribute('data-inset', 'true');
  });

  it('renders DropdownMenuSubContent', () => {
    render(<DropdownMenuSubContent className="sub-content-class">SubContent</DropdownMenuSubContent>);
    expect(screen.getByText('SubContent')).toHaveAttribute('data-slot', 'dropdown-menu-sub-content');
    expect(screen.getByText('SubContent')?.className).toContain('sub-content-class');
  });

  it('DropdownMenuItem passes through all props', () => {
    const onClick = vi.fn();
    render(
      <DropdownMenuItem data-testid="item" onClick={onClick}>
        Test
      </DropdownMenuItem>
    );
    fireEvent.click(screen.getByTestId('item'));
    expect(onClick).toHaveBeenCalled();
  });

  it('DropdownMenuSubTrigger passes through all props', () => {
    const onClick = vi.fn();
    render(
      <DropdownMenuSubTrigger data-testid="subtrigger" onClick={onClick}>
        SubTrigger
      </DropdownMenuSubTrigger>
    );
    fireEvent.click(screen.getByTestId('subtrigger'));
    expect(onClick).toHaveBeenCalled();
  });

  it('DropdownMenuLabel passes through all props', () => {
    const onClick = vi.fn();
    render(
      <DropdownMenuLabel data-testid="label" onClick={onClick}>
        Label
      </DropdownMenuLabel>
    );
    fireEvent.click(screen.getByTestId('label'));
    expect(onClick).toHaveBeenCalled();
  });

  it('DropdownMenuShortcut passes through all props', () => {
    const onClick = vi.fn();
    render(
      <DropdownMenuShortcut data-testid="shortcut" onClick={onClick}>
        Shortcut
      </DropdownMenuShortcut>
    );
    fireEvent.click(screen.getByTestId('shortcut'));
    expect(onClick).toHaveBeenCalled();
  });
});
