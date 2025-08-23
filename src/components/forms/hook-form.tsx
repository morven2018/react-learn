import convertToBase64 from '../../shared/lib/converter';
import style from './form.module.scss';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { countries } from '../../shared/constants/countries';
import { FormsProps, getPasswordStrength, strengthLabels } from './fields';

import {
  FormValues,
  formSchema,
  DraftFormValues,
} from '../../schemas/formSchema';

interface HookFormProps extends FormsProps {
  draftData: DraftFormValues;
  onSaveDraft: (data: DraftFormValues) => void;
}

function HookForm({
  onSubmitSuccess,
  draftData,
  onSaveDraft,
}: Readonly<HookFormProps>) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    draftData.picture || null
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: draftData.name || '',
      age: draftData.age || undefined,
      email: draftData.email || '',
      gender: draftData.gender || 'male',
      country: draftData.country || '',
      acceptTerms: draftData.acceptTerms || false,
      picture: draftData.picture || '',
    },
  });

  const password = watch('password');
  const formValues = watch();

  useEffect(() => {
    const draft: DraftFormValues = {
      name: formValues.name,
      age: formValues.age,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirmPassword,
      gender: formValues.gender,
      acceptTerms: formValues.acceptTerms,
      country: formValues.country,
      picture: formValues.picture,
    };
    onSaveDraft(draft);
  }, [formValues, onSaveDraft]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setImagePreview(base64);
        setValue('picture', base64, { shouldValidate: true });
      } catch {
        setValue('picture', '', { shouldValidate: true });
        setImagePreview(null);
      }
    } else {
      setValue('picture', '', { shouldValidate: true });
      setImagePreview(null);
    }
  };

  useEffect(() => {
    if (draftData.picture && typeof draftData.picture === 'string') {
      setImagePreview(draftData.picture);
      setValue('picture', draftData.picture);
    }
  }, [draftData.picture, setValue]);

  const onSubmit = (data: FormValues) => {
    onSubmitSuccess(data);
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={style.form}
      autoComplete="on"
    >
      <div className={style.formGroup}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          className={style.formInput}
          placeholder="Your name"
          autoComplete="given-name"
          {...register('name')}
        />
        {errors.name && (
          <span className={style.error}>{errors.name.message}</span>
        )}
      </div>

      <div className={style.formGroup}>
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          autoComplete="off"
          className={style.formInput}
          placeholder="Your age"
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && (
          <span className={style.error}>{errors.age.message}</span>
        )}
      </div>

      <div className={style.formGroup}>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          className={style.formInput}
          placeholder="Your email"
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && (
          <span className={style.error}>{errors.email.message}</span>
        )}
      </div>

      <div className={style.formGroup}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          className={style.formInput}
          placeholder="Your password"
          autoComplete="new-password"
          {...register('password')}
        />
        {errors.password && (
          <span className={style.error}>{errors.password.message}</span>
        )}
        {password && (
          <div className={style.passwordStrength}>
            Password Strength: {strengthLabels[passwordStrength]}
            <div className={style.strengthBar}>
              <div
                className={style.strengthFill}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className={style.formGroup}>
        <label htmlFor="confirmPassword">Confirm password:</label>
        <input
          type="password"
          id="confirmPassword"
          className={style.formInput}
          placeholder="Confirm password"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className={style.error}>{errors.confirmPassword.message}</span>
        )}
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
            <input
              type="radio"
              id="gender-male"
              value="male"
              {...register('gender')}
            />
            Male
          </label>
          <label htmlFor="gender-female">
            <input
              type="radio"
              id="gender-female"
              value="female"
              {...register('gender')}
            />
            Female
          </label>
        </div>
        {errors.gender && (
          <span className={style.error}>{errors.gender.message}</span>
        )}
      </div>

      <div className={style.formGroup}>
        <label className={style.checkboxLabel}>
          <input
            type="checkbox"
            autoComplete="off"
            {...register('acceptTerms')}
          />
          I accepted condition
          <br />
          <a href="#" target="_blank">
            Terms and Conditions agreement
          </a>
        </label>
        {errors.acceptTerms && (
          <span className={style.error}>{errors.acceptTerms.message}</span>
        )}
      </div>

      <div className={style.formGroup}>
        <label htmlFor="picture">Picture (required):</label>
        <input
          type="file"
          id="picture"
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
        {errors.picture && (
          <span className={style.error}>{errors.picture.message}</span>
        )}
      </div>

      <div className={style.formGroup}>
        <label htmlFor="country">Country:</label>
        <select
          id="country"
          className={style.formInput}
          autoComplete="country"
          {...register('country')}
        >
          <option value="">Select country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.country && (
          <span className={style.error}>{errors.country.message}</span>
        )}
      </div>

      <button type="submit" className={style.submitButton} disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}

export default HookForm;
