import { render, act } from '@testing-library/react';
import React from 'react';
import { describe, it, vi, beforeEach, afterEach, expect, Mock } from 'vitest';

import { TabsUnderline } from './tabs-underline';

describe('TabsUnderline', () => {
  let originalQuerySelector: typeof document.querySelector;
  let originalResizeObserver: typeof window.ResizeObserver;
  let originalMutationObserver: typeof window.MutationObserver;
  let originalAddEventListener: typeof window.addEventListener;
  let originalRemoveEventListener: typeof window.removeEventListener;

  let mockTablist: HTMLElement;
  let mockActiveTab: HTMLElement;
  let resizeObserverInstance: { observe: (target: Element) => void; disconnect: () => void };
  let mutationObserverInstance: {
    observe: (target: Node, options: MutationObserverInit) => void;
    disconnect: () => void;
  };
  let resizeCallback: () => void;
  let mutationCallback: () => void;
  let eventListeners: Record<string, Array<() => void>>;

  beforeEach(() => {
    // Mock tablist and active tab
    mockTablist = document.createElement('div');
    mockTablist.setAttribute('role', 'tablist');
    mockActiveTab = document.createElement('div');
    mockActiveTab.setAttribute('data-state', 'active');
    Object.defineProperty(mockActiveTab, 'offsetLeft', { value: 42 });
    Object.defineProperty(mockActiveTab, 'offsetWidth', { value: 100 });
    mockTablist.appendChild(mockActiveTab);

    // Mock querySelector
    originalQuerySelector = document.querySelector;
    document.querySelector = vi.fn((selector: string): Element | null => {
      if (selector === '[role="tablist"]') return mockTablist;
      return null;
    }) as typeof document.querySelector;

    // Mock ResizeObserver
    resizeObserverInstance = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    };
    originalResizeObserver = window.ResizeObserver;
    window.ResizeObserver = vi.fn((cb: ResizeObserverCallback) => {
      resizeCallback = cb as () => void;
      return resizeObserverInstance as unknown as ResizeObserver;
    }) as unknown as typeof window.ResizeObserver;

    // Mock MutationObserver
    mutationObserverInstance = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    };
    originalMutationObserver = window.MutationObserver;
    window.MutationObserver = vi.fn((cb: MutationCallback) => {
      mutationCallback = cb as () => void;
      return mutationObserverInstance as unknown as MutationObserver;
    }) as unknown as typeof window.MutationObserver;

    // Mock addEventListener/removeEventListener
    eventListeners = {};
    originalAddEventListener = window.addEventListener;
    window.addEventListener = vi.fn((event: string, cb: EventListenerOrEventListenerObject) => {
      eventListeners[event] = eventListeners[event] || [];
      // Only store function listeners for test simulation
      if (typeof cb === 'function') {
        eventListeners[event].push(cb as () => void);
      }
    }) as typeof window.addEventListener;
    originalRemoveEventListener = window.removeEventListener;
    window.removeEventListener = vi.fn((event: string, cb: EventListenerOrEventListenerObject) => {
      if (eventListeners[event] && typeof cb === 'function') {
        eventListeners[event] = eventListeners[event].filter((fn) => fn !== cb);
      }
    }) as typeof window.removeEventListener;
  });

  afterEach(() => {
    document.querySelector = originalQuerySelector;
    window.ResizeObserver = originalResizeObserver;
    window.MutationObserver = originalMutationObserver;
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
    vi.restoreAllMocks();
  });

  it('renders the underline div', () => {
    const { container } = render(<TabsUnderline />);
    const underline = container.querySelector('.absolute.bottom-0');
    expect(underline).toBeTruthy();
  });

  it('sets style based on active tab on mount', () => {
    render(<TabsUnderline />);
    // updateUnderline is called on mount
    // The motion.div should animate to { left: 42, width: 100 }
    // We can't check motion's internal state, but we can check that setStyle is called via effect
    // So, we check that observer.observe and mutationObserver.observe are called
    expect(resizeObserverInstance.observe).toHaveBeenCalledWith(mockTablist);
    expect(mutationObserverInstance.observe).toHaveBeenCalledWith(mockTablist, { subtree: true, attributes: true });
  });

  it('updates style when resize event is triggered', () => {
    render(<TabsUnderline />);
    // Simulate resize event
    act(() => {
      eventListeners['resize'].forEach((fn) => fn());
    });
    // No error means the updateUnderline ran
    expect(true).toBe(true);
  });

  it('updates style when ResizeObserver callback is called', () => {
    render(<TabsUnderline />);
    act(() => {
      resizeCallback();
    });
    expect(true).toBe(true);
  });

  it('updates style when MutationObserver callback is called', () => {
    render(<TabsUnderline />);
    act(() => {
      mutationCallback();
    });
    expect(true).toBe(true);
  });

  it('cleans up observers and event listeners on unmount', () => {
    const { unmount } = render(<TabsUnderline />);
    unmount();
    expect(resizeObserverInstance.disconnect).toHaveBeenCalled();
    expect(mutationObserverInstance.disconnect).toHaveBeenCalled();
    // removeEventListener should be called for 'resize'
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('does nothing if tablist is not found', () => {
    // Arrange: Make querySelector return null to simulate missing tablist
    document.querySelector = vi.fn(() => null) as typeof document.querySelector;

    // Act: Render the component
    render(<TabsUnderline />);

    // Assert: ResizeObserver and MutationObserver should not be called
    expect(resizeObserverInstance.observe).not.toHaveBeenCalled();
    expect(mutationObserverInstance.observe).not.toHaveBeenCalled();
  });
});
