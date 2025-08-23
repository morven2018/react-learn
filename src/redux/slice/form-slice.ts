import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FormValues } from '../../schemas/formSchema';
import { Forms, Submission } from '../../shared/types/types';

interface FormState {
  submissions: Submission[];
  draftData: {
    [Forms.HookForm]: Partial<FormValues>;
    [Forms.Uncontrolled]: Partial<FormValues>;
  };
  currentFormData: FormValues | null;
  isModalOpen: boolean;
  modalTitle: string;
  currentFormType: Forms | null;
}

const loadStateFromStorage = (): FormState | undefined => {
  try {
    const serializedState = localStorage.getItem('formState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load state from localStorage', err);
    return undefined;
  }
};

const saveStateToStorage = (state: FormState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('formState', serializedState);
  } catch (err) {
    console.error('Could not save state to localStorage', err);
  }
};

const initialState: FormState = loadStateFromStorage() || {
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

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{
        title: string;
        type: Forms;
      }>
    ) => {
      state.isModalOpen = true;
      state.modalTitle = action.payload.title;
      state.currentFormType = action.payload.type;
      saveStateToStorage(state);
    },

    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalTitle = '';
      state.currentFormType = null;
      saveStateToStorage(state);
    },

    saveDraft: (
      state,
      action: PayloadAction<{
        formType: Forms;
        data: Partial<FormValues>;
      }>
    ) => {
      state.draftData[action.payload.formType] = {
        ...state.draftData[action.payload.formType],
        ...action.payload.data,
      };
      saveStateToStorage(state);
    },

    clearDraft: (state, action: PayloadAction<Forms>) => {
      state.draftData[action.payload] = {};
      saveStateToStorage(state);
    },

    addSubmission: (state, action: PayloadAction<Submission>) => {
      state.submissions.push(action.payload);
      state.draftData[action.payload.type] = {};
      saveStateToStorage(state);
    },

    setFormData: (state, action: PayloadAction<FormValues>) => {
      state.currentFormData = action.payload;
      saveStateToStorage(state);
    },

    clearFormData: (state) => {
      state.currentFormData = null;
      saveStateToStorage(state);
    },

    clearAllData: (state) => {
      state.submissions = [];
      state.draftData = {
        [Forms.HookForm]: {},
        [Forms.Uncontrolled]: {},
      };
      state.currentFormData = null;
      state.isModalOpen = false;
      state.modalTitle = '';
      state.currentFormType = null;
      localStorage.removeItem('formState');
    },
  },
});

export const {
  openModal,
  closeModal,
  addSubmission,
  setFormData,
  clearFormData,
  saveDraft,
  clearDraft,
  clearAllData,
} = formSlice.actions;
export default formSlice.reducer;
