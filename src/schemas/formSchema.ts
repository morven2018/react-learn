import { z } from 'zod';

const GenderEnum = z.enum(['male', 'female']);

const validateBase64Image = (base64: string) => {
  if (!base64.startsWith('data:image/')) {
    return false;
  }

  const mimeTypeMatch = RegExp(/^data:(image\/\w+);base64,/).exec(base64);
  if (!mimeTypeMatch) return false;

  const mimeType = mimeTypeMatch[1];
  if (mimeType !== 'image/jpeg' && mimeType !== 'image/png') {
    return false;
  }

  const base64Data = base64.split(',')[1];
  if (!base64Data) return false;

  const sizeInBytes = Math.ceil((base64Data.length * 3) / 4);
  if (sizeInBytes > 5 * 1024 * 1024) {
    return false;
  }

  return true;
};

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'This field is mandatory')
      .regex(/^[A-ZА-Я]/, 'The name should start on UpperCase letter'),
    age: z
      .union([
        z.number().min(0, 'The age should be over than 0'),
        z.undefined(),
      ])
      .refine((val) => val !== undefined, {
        message: 'This field is mandatory',
        path: ['age'],
      }),
    email: z
      .string()
      .min(1, 'This field is mandatory')
      .email('Input correct email'),
    password: z
      .string()
      .min(1, 'This field is mandatory')
      .regex(/\d/, 'Password must contain at least 1 digit')
      .regex(/[A-Z]/, 'Password must have 1 uppercase letter')
      .regex(/[a-z]/, 'Password must have 1 lowercase letter')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character (e.g., !@#$%^&*)'
      )
      .min(8, 'The password should be at least 8 symbols'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    gender: z
      .union([GenderEnum, z.undefined()])
      .refine((val) => val !== undefined, {
        message: 'This field is mandatory',
        path: ['gender'],
      }),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, 'You should accept the condition'),
    picture: z
      .string()
      .min(1, 'This field is mandatory')
      .refine((base64) => validateBase64Image(base64), {
        message: 'Only JPEG and PNG files up to 5MB are accepted',
      }),
    country: z.string().min(1, 'Choose country'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords should match',
    path: ['confirmPassword'],
  });

export type FormValues = z.infer<typeof formSchema>;
export type DraftFormValues = Partial<FormValues>;
