import Accordion from '../accordion/accordion';
import AutocompleteCountry from '../autocomplete-country/autocomplete-country';
import convertToBase64 from '../../shared/lib/converter';
import debounce from '../../shared/lib/debounce';
import style from './form.module.scss';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormsProps, getPasswordStrength, strengthLabels } from './fields';

import {
  FormValues,
  formSchema,
  DraftFormValues,
} from '../../schemas/formSchema';

interface HookFormProps extends FormsProps {
  draftData: DraftFormValues;
  onSaveDraft: (data: DraftFormValues) => void;
  onReset?: boolean;
}

function HookForm({
  onSubmitSuccess,
  draftData,
  onSaveDraft,
  onReset,
}: Readonly<HookFormProps>) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    draftData.picture || null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: draftData.name || '',
      age: draftData.age || undefined,
      email: draftData.email || '',
      password: draftData.password || '',
      confirmPassword: draftData.confirmPassword || '',
      gender: draftData.gender || 'male',
      country: draftData.country || '',
      acceptTerms: draftData.acceptTerms || false,
      picture: draftData.picture || '',
    },
  });

  const password = watch('password');

  useEffect(() => {
    if (onReset) {
      reset({
        name: '',
        age: undefined,
        email: '',
        password: '',
        confirmPassword: '',
        gender: 'male',
        country: '',
        acceptTerms: false,
        picture: '',
      });
      setImagePreview(null);
      setShowPassword(false);
      setShowConfirmPassword(false);

      const fileInput = document.getElementById('picture') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }, [onReset, reset]);

  const debouncedSaveDraft = useCallback(
    (data: DraftFormValues) => {
      return debounce(() => {
        onSaveDraft(data);
      }, 500)();
    },
    [onSaveDraft]
  );

  useEffect(() => {
    const subscription = watch((value) => {
      const formValues = value as Partial<FormValues>;
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

      debouncedSaveDraft(draft);
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedSaveDraft]);

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

  const passwordStrength = getPasswordStrength(password || '');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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
        <div className={style.passwordInputWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className={style.formInput}
            placeholder="Your password"
            autoComplete="new-password"
            {...register('password')}
          />
          <button
            type="button"
            className={style.togglePasswordButton}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
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
        <div className={style.passwordInputWrapper}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            className={style.formInput}
            placeholder="Confirm password"
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
          <button
            type="button"
            className={style.togglePasswordButton}
            onClick={toggleConfirmPasswordVisibility}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </button>
        </div>
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
            <span>Male</span>
          </label>
          <label htmlFor="gender-female">
            <input
              type="radio"
              id="gender-female"
              value="female"
              {...register('gender')}
            />
            <span>Female</span>
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
          <Accordion title={'Terms and Conditions Agreement'} />
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
        <div className={style.formGroup}>
          <label htmlFor="country">Country:</label>
          <AutocompleteCountry
            id="country"
            name="country"
            value={watch('country') || ''}
            onChange={(value) =>
              setValue('country', value, { shouldValidate: true })
            }
            error={errors.country?.message}
          />
        </div>
      </div>

      <button type="submit" className={style.submitButton} disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}

export default HookForm;
