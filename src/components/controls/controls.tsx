import styles from './controls.module.scss';
import { Forms } from '../../shared/types/types';

type ControlsProps = {
  onFormSelect: (formType: Forms) => void;
};

function Controls({ onFormSelect }: Readonly<ControlsProps>) {
  return (
    <div className={styles.wrapper}>
      <button onClick={() => onFormSelect(Forms.Uncontrolled)}>
        Uncontrolled components form
      </button>
      <button onClick={() => onFormSelect(Forms.HookForm)}>
        With React Hook Form
      </button>
    </div>
  );
}

export default Controls;
