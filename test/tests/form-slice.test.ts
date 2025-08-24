import { Forms } from '../../src/shared/types/types';
import { createTestSubmission } from '../mock/test-data';

import {
  openModal,
  closeModal,
  addSubmission,
  saveDraft,
  clearDraft,
} from '../../src/redux/slice/form-slice';

describe('Form Slice Actions', () => {
  it('create openModal action with correct payload', () => {
    const action = openModal({
      title: 'Test Modal',
      type: Forms.Uncontrolled,
    });

    expect(action).toEqual({
      type: 'form/openModal',
      payload: {
        title: 'Test Modal',
        type: Forms.Uncontrolled,
      },
    });
  });

  it('create closeModal action', () => {
    const action = closeModal();
    expect(action).toEqual({ type: 'form/closeModal' });
  });

  it('create addSubmission action with correct payload', () => {
    const submission1 = createTestSubmission();

    const action = addSubmission(submission1);
    expect(action).toEqual({
      type: 'form/addSubmission',
      payload: submission1,
    });
  });

  it('create saveDraft action with correct payload', () => {
    const draftData = { name: 'John', email: 'john@example.com' };
    const action = saveDraft({
      formType: Forms.HookForm,
      data: draftData,
    });

    expect(action).toEqual({
      type: 'form/saveDraft',
      payload: {
        formType: Forms.HookForm,
        data: draftData,
      },
    });
  });

  it('clearDraft action with correct payload', () => {
    const action = clearDraft(Forms.Uncontrolled);
    expect(action).toEqual({
      type: 'form/clearDraft',
      payload: Forms.Uncontrolled,
    });
  });
});
