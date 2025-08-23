import Accordion from '../accordion/accordion';
import React, { useCallback, useEffect, useRef } from 'react';
import convertToBase64 from '../../shared/lib/converter';
import debounce from '../../shared/lib/debounce';
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
  const imagePreviewRef = useRef<HTMLDivElement>(null);

  const nameErrorRef = useRef<HTMLSpanElement>(null);
  const ageErrorRef = useRef<HTMLSpanElement>(null);
  const emailErrorRef = useRef<HTMLSpanElement>(null);
  const passwordErrorRef = useRef<HTMLSpanElement>(null);
  const confirmPasswordErrorRef = useRef<HTMLSpanElement>(null);
  const genderErrorRef = useRef<HTMLSpanElement>(null);
  const acceptTermsErrorRef = useRef<HTMLSpanElement>(null);
  const pictureErrorRef = useRef<HTMLSpanElement>(null);
  const countryErrorRef = useRef<HTMLSpanElement>(null);

  const debouncedSaveDraftRef = useRef(
    debounce((...args: unknown[]) => {
      const draft = args[0] as DraftFormValues;
      onSaveDraft(draft);
    }, 500)
  );
  useEffect(() => {
    debouncedSaveDraftRef.current = debounce((...args: unknown[]) => {
      const draft = args[0] as DraftFormValues;
      onSaveDraft(draft);
    }, 500);
  }, [onSaveDraft]);

  const saveDraft = useCallback(() => {
    if (!formRef.current) return;

    const form = formRef.current;
    const ageValue = form.elements.age.value;

    let age: number | undefined;
    if (ageValue !== '') {
      const parsed = parseInt(ageValue);
      age = isNaN(parsed) ? undefined : parsed;
    }

    const draft: DraftFormValues = {
      name: form.elements.name.value,
      age: age,
      email: form.elements.email.value,
      password: form.elements.password.value,
      confirmPassword: form.elements.confirmPassword.value,
      gender: form.elements.gender.value as 'male' | 'female',
      acceptTerms: form.elements.acceptTerms.checked,
      picture: getCurrentPicture(),
      country: form.elements.country.value,
    };

    debouncedSaveDraftRef.current(draft);
  }, []);

  const getCurrentPicture = (): string | undefined => {
    if (!imagePreviewRef.current) return undefined;
    const img = imagePreviewRef.current.querySelector('img');
    return img ? img.src : undefined;
  };

  const updateImagePreview = (imageSrc: string | null) => {
    if (!imagePreviewRef.current) return;

    if (imageSrc) {
      imagePreviewRef.current.innerHTML = `
        <img src="${imageSrc}" alt="Preview" />
        <p>Image selected</p>
      `;
      imagePreviewRef.current.style.display = 'block';
    } else {
      imagePreviewRef.current.innerHTML = '';
      imagePreviewRef.current.style.display = 'none';
    }
  };

  useEffect(() => {
    const initializeFormFromDraft = () => {
      if (!formRef.current || !draftData) return;

      const form = formRef.current;
      const { elements } = form;

      const textFields = {
        name: draftData.name,
        age: draftData.age?.toString(),
        email: draftData.email,
        password: draftData.password,
        confirmPassword: draftData.confirmPassword,
        country: draftData.country,
      };

      Object.entries(textFields).forEach(([field, value]) => {
        if (value !== undefined) {
          const element = elements[field as keyof FormElements] as
            | HTMLInputElement
            | HTMLSelectElement;
          if (element) {
            element.value = value;
          }
        }
      });

      if (draftData.gender) {
        const radios = elements.gender;
        const targetRadio = Array.from(radios).find(
          (radio) => (radio as HTMLInputElement).value === draftData.gender
        ) as HTMLInputElement;
        if (targetRadio) {
          targetRadio.checked = true;
        }
      }

      if (draftData.acceptTerms !== undefined) {
        const acceptTermsElement = elements.acceptTerms;
        acceptTermsElement.checked = draftData.acceptTerms;
      }

      if (draftData.picture) {
        updateImagePreview(draftData.picture);
      }
    };

    initializeFormFromDraft();
  }, [draftData]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        updateImagePreview(base64);
        saveDraft();
      } catch {
        updateImagePreview(null);
        if (formRef.current) {
          formRef.current.elements.picture.value = '';
        }
      }
    } else {
      updateImagePreview(null);
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
      name: nameErrorRef,
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

    const ageValue = form.elements.age.value;
    let age: number;

    if (ageValue === '') {
      age = 0;
    } else {
      const parsed = parseInt(ageValue);
      age = isNaN(parsed) ? 0 : parsed;
    }

    const genderValue = form.elements.gender.value;
    const gender =
      genderValue === '' ? undefined : (genderValue as 'male' | 'female');

    const formData = {
      name: form.elements.name.value,
      age: age,
      email: form.elements.email.value,
      password: form.elements.password.value,
      confirmPassword: form.elements.confirmPassword.value,
      gender: gender,
      acceptTerms: form.elements.acceptTerms.checked,
      picture: getCurrentPicture() || '',
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
          type="text"
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
            <span>Male</span>
          </label>
          <label htmlFor="gender-female">
            <input
              type="radio"
              id="gender-female"
              name="gender"
              value="female"
            />
            <span>Female</span>
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
          <Accordion title={'Terms and Conditions Agreement'} />
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
        <div
          ref={imagePreviewRef}
          className={style.imagePreview}
          style={{ display: 'none' }}
        />
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
