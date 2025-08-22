import style from './form.module.scss';
import { useForm } from 'react-hook-form';

type HookFormProps = {
  onSubmitSuccess: (name: string) => void;
};

type FormData = {
  name: string;
};

function HookForm({ onSubmitSuccess }: Readonly<HookFormProps>) {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    onSubmitSuccess(data.name);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className={style.form}>
        <label htmlFor="hook-name">name:</label>
        <input
          id="hook-name"
          type="text"
          className="form-input"
          placeholder="bdfbbbdg"
          {...register('name')}
        />
      </div>
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
}

export default HookForm;
