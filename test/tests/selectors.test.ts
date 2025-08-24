import { RootState } from '../../src/redux/store';
import { Forms } from '../../src/shared/types/types';
import { createTestSubmission } from '../mock/test-data';

describe('Form Selectors', () => {
  const mockState: RootState = {
    form: {
      submissions: [createTestSubmission()],
      draftData: {
        [Forms.HookForm]: { name: 'Draft User', email: 'draft@example.com' },
        [Forms.Uncontrolled]: { name: 'Test User' },
      },
      currentFormData: null,
      isModalOpen: true,
      modalTitle: 'Test Modal',
      currentFormType: Forms.Uncontrolled,
    },
    countries: {
      list: ['USA', 'Canada', 'Mexico'],
      loading: false,
      error: null,
    },
  } as RootState;

  it('select form state', () => {
    const formState = mockState.form;
    expect(formState).toEqual(mockState.form);
  });

  it('select submissions', () => {
    const submissions = mockState.form.submissions;
    expect(submissions).toHaveLength(1);
    expect(submissions[0].name).toBe('User 1');
  });

  it('select draft data for specific form type', () => {
    const hookFormDraft = mockState.form.draftData[Forms.HookForm];
    const uncontrolledDraft = mockState.form.draftData[Forms.Uncontrolled];

    expect(hookFormDraft).toEqual({
      name: 'Draft User',
      email: 'draft@example.com',
    });
    expect(uncontrolledDraft).toEqual({ name: 'Test User' });
  });

  it('select modal state', () => {
    expect(mockState.form.isModalOpen).toBe(true);
    expect(mockState.form.modalTitle).toBe('Test Modal');
    expect(mockState.form.currentFormType).toBe(Forms.Uncontrolled);
  });

  it('select countries list', () => {
    const countries = mockState.countries.list;
    expect(countries).toEqual(['USA', 'Canada', 'Mexico']);
    expect(countries).toHaveLength(3);
  });
});
