import Controls from './components/controls/controls';
import HookForm from './components/forms/hook-form';
import Modal from './components/modal/modal';
import Results from './components/result/result';
import UncontrolledForm from './components/forms/uncontrolled';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import {
  addSubmission,
  closeModal,
  openModal,
  saveDraft,
} from './redux/slice/formSlice';
import { FormValues } from './schemas/formSchema';
import { Forms } from './shared/types/types';

enum ModalTitle {
  Uncontrolled = 'Form with uncontrolled Elements',
  HookForm = 'Form with React Hook Form',
}

function App() {
  const dispatch = useAppDispatch();
  const { isModalOpen, modalTitle, modalContent, submissions, draftData } =
    useAppSelector((state) => state.form);

  const handleFormSelect = (formType: Forms) => {
    if (formType === Forms.Uncontrolled) {
      dispatch(
        openModal({
          title: ModalTitle.Uncontrolled,
          content: (
            <UncontrolledForm
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
                handleFormSubmit(Forms.Uncontrolled, data.name)
              }
            />
          ),
          type: Forms.Uncontrolled,
        })
      );
    } else {
      dispatch(
        openModal({
          title: ModalTitle.HookForm,
          content: (
            <HookForm
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
                handleFormSubmit(Forms.HookForm, data.name)
              }
            />
          ),
          type: Forms.HookForm,
        })
      );
    }
  };

  const handleFormSubmit = (type: Forms, name: string) => {
    const newSubmission = {
      type,
      name,
      timestamp: new Date().toISOString(),
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
      >
        {modalContent}
      </Modal>
      <Results submissions={submissions} />
    </>
  );
}

export default App;
