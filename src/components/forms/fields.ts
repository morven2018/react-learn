import { FormValues } from '../../schemas/formSchema';

export const getPasswordStrength = (password: string = '') => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/\d/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

export const strengthLabels = [
  'Extra weak',
  'Weak',
  'Medium',
  'Good',
  'Excellent',
  'Ideal',
];

export type FormsProps = {
  onSubmitSuccess: (data: FormValues) => void;
};
