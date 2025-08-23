import React, { useEffect, useRef, useState } from 'react';
import convertToBase64 from '../../shared/lib/converter';
import style from './form.module.scss';
import { z } from 'zod';
import { countries } from '../../shared/constants/countries';

import {
  formSchema,
  FormValues,
  DraftFormValues,
} from '../../schemas/formSchema';

type UncontrolledFormProps = {
  onSubmitSuccess: (data: FormValues) => void;
  draftData: DraftFormValues;
  onSaveDraft: (data: DraftFormValues) => void;
};

interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  age: HTMLInputElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
  confirmPassword: HTMLInputElement;
  gender: RadioNodeList;
  acceptTerms: HTMLInputElement;
  picture: HTMLInputElement;
  country: HTMLSelectElement;
}

interface UncontrolledFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

function UncontrolledForm({
  onSubmitSuccess,
  draftData,
  onSaveDraft,
}: Readonly<UncontrolledFormProps>) {
  const formRef = useRef<UncontrolledFormElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    draftData.picture || null
  );

  const nameErrorRef = useRef<HTMLSpanElement>(null);
  const ageErrorRef = useRef<HTMLSpanElement>(null);
  const emailErrorRef = useRef<HTMLSpanElement>(null);
  const passwordErrorRef = useRef<HTMLSpanElement>(null);
  const confirmPasswordErrorRef = useRef<HTMLSpanElement>(null);
  const genderErrorRef = useRef<HTMLSpanElement>(null);
  const acceptTermsErrorRef = useRef<HTMLSpanElement>(null);
  const pictureErrorRef = useRef<HTMLSpanElement>(null);
  const countryErrorRef = useRef<HTMLSpanElement>(null);

  const saveDraft = () => {
    if (!formRef.current) return;

    const form = formRef.current;
    const draft: DraftFormValues = {
      name: form.elements.name.value,
      age: form.elements.age.value
        ? parseInt(form.elements.age.value)
        : undefined,
      email: form.elements.email.value,
      password: form.elements.password.value,
      confirmPassword: form.elements.confirmPassword.value,
      gender: form.elements.gender.value as 'male' | 'female',
      acceptTerms: form.elements.acceptTerms.checked,
      picture: imagePreview || undefined,
      country: form.elements.country.value,
    };

    onSaveDraft(draft);
  };

  useEffect(() => {
    if (formRef.current && draftData) {
      const form = formRef.current;

      if (draftData.name) form.elements.name.value = draftData.name;
      if (draftData.age) form.elements.age.value = draftData.age.toString();
      if (draftData.email) form.elements.email.value = draftData.email;
      if (draftData.password) form.elements.password.value = draftData.password;
      if (draftData.confirmPassword)
        form.elements.confirmPassword.value = draftData.confirmPassword;
      if (draftData.country) form.elements.country.value = draftData.country;

      if (draftData.gender) {
        const radios = form.elements.gender;
        for (const element of radios) {
          const radio = element as HTMLInputElement;
          if (radio.value === draftData.gender) {
            radio.checked = true;
            break;
          }
        }
      }

      if (draftData.acceptTerms !== undefined) {
        form.elements.acceptTerms.checked = draftData.acceptTerms;
      }

      if (draftData.picture) {
        setImagePreview(draftData.picture);
      }

      saveDraft();
    }
  }, [draftData, saveDraft]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setImagePreview(base64);
        saveDraft();
      } catch (error) {
        setImagePreview(null);
        if (formRef.current) {
          formRef.current.elements.picture.value = '';
        }
        showError('picture', error instanceof Error ? error.message : '');
      }
    } else {
      setImagePreview(null);
      saveDraft();
    }
  };

  const handleChange = () => {
    saveDraft();
    clearErrors();
  };

  const clearErrors = () => {
    const errorRefs = [
      nameErrorRef,
      ageErrorRef,
      emailErrorRef,
      passwordErrorRef,
      confirmPasswordErrorRef,
      genderErrorRef,
      acceptTermsErrorRef,
      pictureErrorRef,
      countryErrorRef,
    ];

    errorRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.textContent = '';
        ref.current.style.display = 'none';
      }
    });
  };

  const showError = (field: keyof FormValues, message: string) => {
    const errorRefs: Record<
      keyof FormValues,
      React.RefObject<HTMLSpanElement | null>
    > = {
      name: nameErrorRef ?? '',
      age: ageErrorRef,
      email: emailErrorRef,
      password: passwordErrorRef,
      confirmPassword: confirmPasswordErrorRef,
      gender: genderErrorRef,
      acceptTerms: acceptTermsErrorRef,
      picture: pictureErrorRef,
      country: countryErrorRef,
    };

    if (errorRefs[field]?.current) {
      errorRefs[field].current.textContent = message;
      errorRefs[field].current.style.display = 'block';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!formRef.current) return;

    const form = formRef.current;

    const formData: FormValues = {
      name: form.elements.name.value,
      age: form.elements.age.value ? parseInt(form.elements.age.value) : NaN,
      email: form.elements.email.value,
      password: form.elements.password.value,
      confirmPassword: form.elements.confirmPassword.value,
      gender: form.elements.gender.value as 'male' | 'female',
      acceptTerms: form.elements.acceptTerms.checked,
      picture: imagePreview || '',
      country: form.elements.country.value,
    };

    try {
      const validatedData = formSchema.parse(formData);
      onSubmitSuccess(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof FormValues;
          showError(field, issue.message);
        });
      }
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onChange={handleChange}
      className={style.form}
    >
      <div className={style.formGroup}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          className={style.formInput}
          placeholder="Your name"
          autoComplete="given-name"
        />
        <span
          ref={nameErrorRef}
          className={style.error}
          style={{ display: 'none' }}
        ></span>
      </div>

      <div className={style.formGroup}>
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          className={style.formInput}
          placeholder="Your age"
          autoComplete="off"
        />
        <span
          ref={ageErrorRef}
          className={style.error}
          style={{ display: 'none' }}
        ></span>
      </div>

      <div className={style.formGroup}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          className={style.formInput}
          placeholder="Your email"
          autoComplete="email"
        />
        <span
          ref={emailErrorRef}
          className={style.error}
          style={{ display: 'none' }}
        ></span>
      </div>

      <div className={style.formGroup}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          className={style.formInput}
          placeholder="Your password"
          autoComplete="new-password"
        />
        <span
          ref={passwordErrorRef}
          className={style.error}
          style={{ display: 'none' }}
        ></span>
      </div>

      <div className={style.formGroup}>
        <label htmlFor="confirmPassword">Confirm password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className={style.formInput}
          placeholder="Confirm password"
          autoComplete="new-password"
        />
        <span
          ref={confirmPasswordErrorRef}
          className={style.error}
          style={{ display: 'none' }}
        ></span>
      </div>

      <div className={style.formGroup}>
        <div
          className={style.radioGroup}
          role="radiogroup"
          aria-labelledby="gender-label"
        >
          <span id="gender-label" className={style.legend}>
            Gender:
          </span>
          <label htmlFor="gender-male">
            <input type="radio" id="gender-male" name="gender" value="male" />
            Male
          </label>
          <label htmlFor="gender-female">
            <input
              type="radio"
              id="gender-female"
              name="gender"
              value="female"
            />
            Female
          </label>
        </div>
        <span
          ref={genderErrorRef}
          className={style.error}
          style={{ display: 'none' }}
        ></span>
      </div>

      <div className={style.formGroup}>
        <label className={style.checkboxLabel}>
          <input type="checkbox" name="acceptTerms" autoComplete="off" />
          I accepted condition
          <br />
          <a href="#" target="_blank">
            Terms and Conditions agreement
          </a>
        </label>
        <span
          ref={acceptTermsErrorRef}
          className={style.error}
          style={{ display: 'none' }}
        ></span>
      </div>

      <div className={style.formGroup}>
        <label htmlFor="picture">Picture (required):</label>
        <input
          type="file"
          id="picture"
          name="picture"
          accept="image/jpeg,image/png"
          autoComplete="off"
          onChange={handleImageChange}
          required
        />
        {imagePreview && (
          <div className={style.imagePreview}>
            <img src={imagePreview} alt="Preview" />
            <p>Image selected</p>
          </div>
        )}
        <span
          ref={pictureErrorRef}
          className={style.error}
          style={{ display: 'none' }}
        ></span>
      </div>

      <div className={style.formGroup}>
        <label htmlFor="country">Country:</label>
        <select
          id="country"
          name="country"
          className={style.formInput}
          autoComplete="country"
        >
          <option value="">Select country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <span
          ref={countryErrorRef}
          className={style.error}
          style={{ display: 'none' }}
        ></span>
      </div>

      <button type="submit" className={style.submitButton}>
        Submit
      </button>
    </form>
  );
}

export default UncontrolledForm;
