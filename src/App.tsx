import Controls from './components/controls/controls';
import HookForm from './components/forms/hook-form';
import Modal from './components/modal/modal';
import Results from './components/result/result';
import UncontrolledForm from './components/forms/uncontrolled';
import { useState } from 'react';
import { Forms, Submission } from './shared/types/types';

enum ModalTitle {
  Uncontrolled = 'Form with uncontrolled Elements',
  HookForm = 'Form with React Hook Form',
}

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const handleFormSelect = (formType: Forms) => {
    setModalOpen(true);

    if (formType === Forms.Uncontrolled) {
      setModalTitle(ModalTitle.Uncontrolled);
      setModalContent(
        <UncontrolledForm
          onSubmitSuccess={(name: string) =>
            handleFormSubmit(Forms.Uncontrolled, name)
          }
        />
      );
    } else {
      setModalTitle(ModalTitle.HookForm);
      setModalContent(
        <HookForm
          onSubmitSuccess={(name: string) =>
            handleFormSubmit(Forms.HookForm, name)
          }
        />
      );
    }
  };

  const handleFormSubmit = (type: Forms, name: string) => {
    const newSubmission: Submission = {
      type,
      name,
    };

    setSubmissions((prev) => [...prev, newSubmission]);
    setModalOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <header>React Forms</header>
      <Controls onFormSelect={handleFormSelect} />
      <Modal isOpen={modalOpen} title={modalTitle} onClose={closeModal}>
        {modalContent}
      </Modal>
      <Results submissions={submissions} />
    </>
  );
}

export default App;
