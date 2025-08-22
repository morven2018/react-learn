import React, { useRef } from 'react';
import style from './form.module.scss';

type UncontrolledFormProps = {
  onSubmitSuccess: (name: string) => void;
};

function UncontrolledForm({
  onSubmitSuccess,
}: Readonly<UncontrolledFormProps>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = inputRef.current ? inputRef.current.value : '';
    onSubmitSuccess(value);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className={style.form}>
        <label htmlFor="name">name:</label>
        <input
          type="text"
          id="name"
          ref={inputRef}
          className="form-input"
          placeholder="dsdsds"
        />
      </div>
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
}

export default UncontrolledForm;
