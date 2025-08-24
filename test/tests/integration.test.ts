import { store } from '../../src/redux/store';
import { Forms } from '../../src/shared/types/types';
import { createTestSubmission } from '../mock/test-data';

import {
  openModal,
  closeModal,
  addSubmission,
  saveDraft,
  clearAllData,
} from '../../src/redux/slice/form-slice';

describe('Store Integration Tests', () => {
  beforeEach(() => {
    store.dispatch(clearAllData());
  });

  it('handle complete form submission flow', () => {
    store.dispatch(
      openModal({
        title: 'Test Form',
        type: Forms.Uncontrolled,
      })
    );

    let state = store.getState();
    expect(state.form.isModalOpen).toBe(true);
    expect(state.form.currentFormType).toBe(Forms.Uncontrolled);

    store.dispatch(
      saveDraft({
        formType: Forms.Uncontrolled,
        data: { name: 'John', email: 'john@example.com' },
      })
    );

    state = store.getState();
    expect(state.form.draftData[Forms.Uncontrolled]).toEqual({
      name: 'John',
      email: 'john@example.com',
    });

    const submission = createTestSubmission();

    store.dispatch(addSubmission(submission));

    state = store.getState();
    expect(state.form.submissions).toHaveLength(1);
    expect(state.form.submissions[0]).toEqual(submission);
    expect(state.form.draftData[Forms.Uncontrolled]).toEqual({});

    store.dispatch(closeModal());
    state = store.getState();
    expect(state.form.isModalOpen).toBe(false);
  });

  it('handle multiple submissions', () => {
    const submission1 = createTestSubmission();
    const submission2 = createTestSubmission(2);

    store.dispatch(addSubmission(submission1));
    store.dispatch(addSubmission(submission2));

    const state = store.getState();
    expect(state.form.submissions).toHaveLength(2);
    expect(state.form.submissions[0]).toEqual(submission1);
    expect(state.form.submissions[1]).toEqual(submission2);
  });
});
