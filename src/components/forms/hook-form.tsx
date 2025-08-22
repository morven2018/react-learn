import style from './form.module.scss';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormValues, formSchema } from '../../schemas/formSchema';
import { countries } from '../../shared/constants/countries';
import { FormsProps, getPasswordStrength, strengthLabels } from './fields';

function HookForm({ onSubmitSuccess }: Readonly<FormsProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const password = watch('password');

  const onSubmit = (data: FormValues) => {
    onSubmitSuccess(data);
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
      <div className={style.formGroup}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          className={style.formInput}
          placeholder="Your name"
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
          type="email"
          id="email"
          className={style.formInput}
          placeholder="Your email"
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
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className={style.error}>{errors.confirmPassword.message}</span>
        )}
      </div>

      <div className={style.formGroup}>
        <label>Gender:</label>
        <div className={style.radioGroup}>
          <label>
            <input type="radio" value="male" {...register('gender')} />
            Male
          </label>
          <label>
            <input type="radio" value="female" {...register('gender')} />
            Female
          </label>
        </div>
        {errors.gender && (
          <span className={style.error}>{errors.gender.message}</span>
        )}
      </div>

      <div className={style.formGroup}>
        <label className={style.checkboxLabel}>
          <input type="checkbox" {...register('acceptTerms')} />I accepted
          condition
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
        <label htmlFor="avatar">Picture:</label>
        <input
          type="file"
          id="avatar"
          accept="image/jpeg,image/png"
          {...register('avatar')}
        />
        {errors.avatar && (
          <span className={style.error}>{errors.avatar.message}</span>
        )}
      </div>

      <div className={style.formGroup}>
        <label htmlFor="country">Country:</label>
        <select
          id="country"
          className={style.formInput}
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
