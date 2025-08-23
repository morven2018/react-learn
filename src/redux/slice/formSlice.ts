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

const initialState: FormState = {
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
    },

    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalTitle = '';
      state.currentFormType = null;
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
    },

    clearDraft: (state, action: PayloadAction<Forms>) => {
      state.draftData[action.payload] = {};
    },

    addSubmission: (state, action: PayloadAction<Submission>) => {
      state.submissions.push(action.payload);
      state.draftData[action.payload.type] = {};
    },

    setFormData: (state, action: PayloadAction<FormValues>) => {
      state.currentFormData = action.payload;
    },

    clearFormData: (state) => {
      state.currentFormData = null;
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
} = formSlice.actions;
export default formSlice.reducer;
