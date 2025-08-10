import { describe, expect, it } from 'vitest';

import refreshSlice, {
  triggerRefresh,
  initialState,
} from '@redux/refresh-slice';

describe('refreshSlice', () => {
  it('correct initial state', () => {
    expect(initialState).toEqual({
      version: 0,
    });
  });

  it('handle triggerRefresh action', () => {
    const state = refreshSlice(initialState, triggerRefresh());
    expect(state).toEqual({
      version: 1,
    });
  });

  it('increment version on each triggerRefresh', () => {
    let state = initialState;

    state = refreshSlice(state, triggerRefresh());
    expect(state.version).toBe(1);

    state = refreshSlice(state, triggerRefresh());
    expect(state.version).toBe(2);
  });

  it('not modify the original state', () => {
    const originalState = { version: 5 };
    const newState = refreshSlice(originalState, triggerRefresh());

    expect(newState.version).toBe(6);
    expect(originalState.version).toBe(5);
  });
});
