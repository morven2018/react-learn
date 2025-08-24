import { Forms } from '../../src/shared/types/types';
import { createTestSubmission } from '../mock/test-data';

import formReducer, {
  openModal,
  closeModal,
  addSubmission,
  saveDraft,
  clearDraft,
} from '../../src/redux/slice/form-slice';

const initialState = {
  submissions: [],
  draftData: {
    [Forms.HookForm]: {},
    [Forms.Uncontrolled]: {},
  },
  currentFormData: null,
  isModalOpen: false,
  modalTitle: '',
  currentFormType: null,
};

describe('Form Slice Reducer', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('return initial state', () => {
    expect(formReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('handle openModal', () => {
    const action = openModal({
      title: 'Test Modal',
      type: Forms.Uncontrolled,
    });

    const newState = formReducer(initialState, action);

    expect(newState.isModalOpen).toBe(true);
    expect(newState.modalTitle).toBe('Test Modal');
    expect(newState.currentFormType).toBe(Forms.Uncontrolled);
  });

  it('handle closeModal', () => {
    const stateWithOpenModal = {
      ...initialState,
      isModalOpen: true,
      modalTitle: 'Test Modal',
      currentFormType: Forms.Uncontrolled,
    };

    const newState = formReducer(stateWithOpenModal, closeModal());

    expect(newState.isModalOpen).toBe(false);
    expect(newState.modalTitle).toBe('');
    expect(newState.currentFormType).toBe(null);
  });

  it('handle addSubmission', () => {
    const submission = createTestSubmission();

    const newState = formReducer(initialState, addSubmission(submission));

    expect(newState.submissions).toHaveLength(1);
    expect(newState.submissions[0]).toEqual(submission);
    expect(newState.draftData[Forms.Uncontrolled]).toEqual({});
  });

  it('handle saveDraft for HookForm', () => {
    const draftData = { name: 'John', email: 'john@example.com' };
    const action = saveDraft({
      formType: Forms.HookForm,
      data: draftData,
    });

    const newState = formReducer(initialState, action);

    expect(newState.draftData[Forms.HookForm]).toEqual(draftData);
    expect(newState.draftData[Forms.Uncontrolled]).toEqual({});
  });

  it('handle saveDraft for Uncontrolled form with number age', () => {
    const draftData = { name: 'Jane', age: 30 };
    const action = saveDraft({
      formType: Forms.Uncontrolled,
      data: draftData,
    });

    const newState = formReducer(initialState, action);

    expect(newState.draftData[Forms.Uncontrolled]).toEqual(draftData);
    expect(newState.draftData[Forms.HookForm]).toEqual({});
  });

  it('handle saveDraft for Uncontrolled form with undefined age', () => {
    const draftData = { name: 'Jane', age: undefined };
    const action = saveDraft({
      formType: Forms.Uncontrolled,
      data: draftData,
    });

    const newState = formReducer(initialState, action);

    expect(newState.draftData[Forms.Uncontrolled]).toEqual(draftData);
    expect(newState.draftData[Forms.HookForm]).toEqual({});
  });

  it('handle saveDraft for Uncontrolled form without age', () => {
    const draftData = { name: 'Jane', email: 'jane@example.com' };
    const action = saveDraft({
      formType: Forms.Uncontrolled,
      data: draftData,
    });

    const newState = formReducer(initialState, action);

    expect(newState.draftData[Forms.Uncontrolled]).toEqual(draftData);
    expect(newState.draftData[Forms.HookForm]).toEqual({});
  });

  it('handle clearDraft', () => {
    const stateWithDraft = {
      ...initialState,
      draftData: {
        [Forms.HookForm]: { name: 'John' },
        [Forms.Uncontrolled]: { name: 'Jane' },
      },
    };

    const newState = formReducer(stateWithDraft, clearDraft(Forms.HookForm));

    expect(newState.draftData[Forms.HookForm]).toEqual({});
    expect(newState.draftData[Forms.Uncontrolled]).toEqual({ name: 'Jane' });
  });

  it('should merge draft data on saveDraft', () => {
    const initialStateWithDraft = {
      ...initialState,
      draftData: {
        [Forms.HookForm]: { name: 'John', age: 25 },
        [Forms.Uncontrolled]: {},
      },
    };

    const newDraftData = { name: 'John Updated', email: 'john@example.com' };
    const action = saveDraft({
      formType: Forms.HookForm,
      data: newDraftData,
    });

    const newState = formReducer(initialStateWithDraft, action);

    expect(newState.draftData[Forms.HookForm]).toEqual({
      name: 'John Updated',
      age: 25,
      email: 'john@example.com',
    });
  });
});
