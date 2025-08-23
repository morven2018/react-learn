import Controls from './components/controls/controls';
import HookForm from './components/forms/hook-form';
import Modal from './components/modal/modal';
import Results from './components/result/result';
import UncontrolledForm from './components/forms/uncontrolled';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { FormValues } from './schemas/formSchema';
import { Forms } from './shared/types/types';

import {
  addSubmission,
  closeModal,
  openModal,
  saveDraft,
  clearDraft,
} from './redux/slice/formSlice';

enum ModalTitle {
  Uncontrolled = 'Form with uncontrolled Elements',
  HookForm = 'Form with React Hook Form',
}

function App() {
  const dispatch = useAppDispatch();
  const [resetSignal, setResetSignal] = useState(0);

  const { isModalOpen, modalTitle, currentFormType, submissions, draftData } =
    useAppSelector((state) => state.form);

  const handleFormSelect = (formType: Forms) => {
    if (formType === Forms.Uncontrolled) {
      dispatch(
        openModal({
          title: ModalTitle.Uncontrolled,
          type: Forms.Uncontrolled,
        })
      );
    } else {
      dispatch(
        openModal({
          title: ModalTitle.HookForm,
          type: Forms.HookForm,
        })
      );
    }
  };

  const handleResetForm = () => {
    if (currentFormType) {
      dispatch(clearDraft(currentFormType));
      setResetSignal((prev) => prev + 1);
    }
  };

  const renderModalContent = () => {
    switch (currentFormType) {
      case Forms.Uncontrolled:
        return (
          <UncontrolledForm
            key={`uncontrolled-${resetSignal}`}
            draftData={draftData[Forms.Uncontrolled]}
            onSaveDraft={(data) =>
              dispatch(
                saveDraft({
                  formType: Forms.Uncontrolled,
                  data,
                })
              )
            }
            onSubmitSuccess={(data: FormValues) =>
              handleFormSubmit(Forms.Uncontrolled, data)
            }
          />
        );
      case Forms.HookForm:
        return (
          <HookForm
            key={`hookform-${resetSignal}`}
            draftData={draftData[Forms.HookForm]}
            onSaveDraft={(data) =>
              dispatch(
                saveDraft({
                  formType: Forms.HookForm,
                  data,
                })
              )
            }
            onSubmitSuccess={(data: FormValues) =>
              handleFormSubmit(Forms.HookForm, data)
            }
          />
        );
      default:
        return null;
    }
  };

  const handleFormSubmit = (type: Forms, data: FormValues) => {
    const newSubmission = {
      type,
      name: data.name,
      age: data.age?.toString() ?? '',
      email: data.email,
      password: data.password,
      gender: data.gender,
      acceptTerms: data.acceptTerms.toString(),
      picture: data.picture,
      country: data.country,
    };

    dispatch(addSubmission(newSubmission));
    dispatch(closeModal());
  };

  const closeModalHandler = () => {
    dispatch(closeModal());
  };

  return (
    <>
      <header>React Forms</header>
      <Controls onFormSelect={handleFormSelect} />
      <Modal
        isOpen={isModalOpen}
        title={modalTitle}
        onClose={closeModalHandler}
        onResetForm={handleResetForm}
      >
        {renderModalContent()}
      </Modal>
      <Results submissions={submissions} />
    </>
  );
}

export default App;
