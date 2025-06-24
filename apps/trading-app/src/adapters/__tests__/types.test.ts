import * as Types from '../types';
import { describe, expect, it } from 'vitest';

describe('adapters/types', () => {
  it('should import without error', () => {
    expect(Types).toBeDefined();
  });
});
