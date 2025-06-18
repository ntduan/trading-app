/* eslint-disable @typescript-eslint/no-explicit-any */
import * as nextServer from 'next/server';
import { describe, it, expect, vi } from 'vitest';

import { GET } from './route';

describe('GET /api/pairs', () => {
  it('should return trading pairs as JSON response', async () => {
    // Arrange
    const jsonSpy = vi.spyOn(nextServer.NextResponse, 'json');

    // Act
    await GET();

    // Assert
    expect(jsonSpy).toHaveBeenCalled();
    const [responseData] = jsonSpy.mock.calls[0] as any[];
    expect(Array.isArray(responseData.result)).toBe(true);
    expect(responseData.result.length).toBeGreaterThan(0);

    // Cleanup
    jsonSpy.mockRestore();
  });

  it('should return valid trading pair structure', async () => {
    // Arrange
    const jsonSpy = vi.spyOn(nextServer.NextResponse, 'json');

    // Act
    await GET();

    // Assert

    const [result] = jsonSpy.mock.calls[0] as any[];

    result.result.forEach((pair: any) => {
      expect(pair).toHaveProperty('symbol');
      expect(pair).toHaveProperty('baseAsset');
      expect(pair).toHaveProperty('quoteAsset');
      expect(typeof pair.symbol).toBe('string');
      expect(typeof pair.baseAsset).toBe('string');
      expect(typeof pair.quoteAsset).toBe('string');
    });

    // Cleanup
    jsonSpy.mockRestore();
  });
});
