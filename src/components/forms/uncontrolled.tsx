import React, { useRef, useState } from 'react';
import style from './form.module.scss';
import { z } from 'zod';
import { countries } from '../../shared/constants/countries';

import {
  formSchema,
  FormData as FormDataSchema,
} from '../../schemas/formSchema';

type UncontrolledFormProps = {
  onSubmitSuccess: (data: FormDataSchema) => void;
};

function UncontrolledForm({
  onSubmitSuccess,
}: Readonly<UncontrolledFormProps>) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormDataSchema, string>>
  >({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    const rawData = {
      name: formData.get('name') as string,
      age: formData.get('age') ? parseInt(formData.get('age') as string) : NaN,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      gender: formData.get('gender') as string,
      acceptTerms: formData.get('acceptTerms') === 'on',
      avatar: formData.get('avatar') as unknown as FileList,
      country: formData.get('country') as string,
    };

    try {
      const validatedData = formSchema.parse(rawData);
      setErrors({});
      onSubmitSuccess(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormDataSchema, string>> = {};

        error.issues.forEach((issue) => {
          const path = issue.path[0] as keyof FormDataSchema;
          newErrors[path] = issue.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={style.form}>
      <div className={style.formGroup}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          className={style.formInput}
          placeholder="Your name"
        />
        {errors.name && <span className={style.error}>{errors.name}</span>}
      </div>

      <div className={style.formGroup}>
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          className={style.formInput}
          placeholder="Your age"
        />
        {errors.age && <span className={style.error}>{errors.age}</span>}
      </div>

      <div className={style.formGroup}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          className={style.formInput}
          placeholder="Your email"
        />
        {errors.email && <span className={style.error}>{errors.email}</span>}
      </div>

      <div className={style.formGroup}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          className={style.formInput}
          placeholder="Your password"
        />
        {errors.password && (
          <span className={style.error}>{errors.password}</span>
        )}
      </div>

      <div className={style.formGroup}>
        <label htmlFor="confirmPassword">Confirm password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className={style.formInput}
          placeholder="Confirm password"
        />
        {errors.confirmPassword && (
          <span className={style.error}>{errors.confirmPassword}</span>
        )}
      </div>

      <div className={style.formGroup}>
        <label>Gender:</label>
        <div className={style.radioGroup}>
          <label>
            <input type="radio" name="gender" value="male" />
            Male
          </label>
          <label>
            <input type="radio" name="gender" value="female" />
            Female
          </label>
        </div>
        {errors.gender && <span className={style.error}>{errors.gender}</span>}
      </div>

      <div className={style.formGroup}>
        <label className={style.checkboxLabel}>
          <input type="checkbox" name="acceptTerms" />I accepted condition
          <br />
          <a href="#" target="_blank">
            Terms and Conditions agreement
          </a>
        </label>
        {errors.acceptTerms && (
          <span className={style.error}>{errors.acceptTerms}</span>
        )}
      </div>

      <div className={style.formGroup}>
        <label htmlFor="avatar">Picture:</label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/jpeg,image/png"
        />
        {errors.avatar && <span className={style.error}>{errors.avatar}</span>}
      </div>

      <div className={style.formGroup}>
        <label htmlFor="country">Country:</label>
        <select id="country" name="country" className={style.formInput}>
          <option value="">Select country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.country && (
          <span className={style.error}>{errors.country}</span>
        )}
      </div>

      <button type="submit" className={style.submitButton}>
        Submit
      </button>
    </form>
  );
}

export default UncontrolledForm;
