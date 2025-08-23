import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FormValues } from '../../schemas/formSchema';
import { Forms } from '../../shared/types/types';

interface Submission {
  type: Forms;
  name: string;
  timestamp: string;
}

interface FormState {
  submissions: Submission[];
  draftData: {
    [Forms.HookForm]: Partial<FormValues>;
    [Forms.Uncontrolled]: Partial<FormValues>;
  };
  currentFormData: FormValues | null;
  isModalOpen: boolean;
  modalTitle: string;
  modalContent: React.ReactNode | null;
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
  modalContent: null,
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
        content: React.ReactNode;
        type: Forms;
      }>
    ) => {
      state.isModalOpen = true;
      state.modalTitle = action.payload.title;
      state.modalContent = action.payload.content;
      state.currentFormType = action.payload.type;
    },

    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalTitle = '';
      state.modalContent = null;
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
      // Очищаем черновик только для этой формы
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
