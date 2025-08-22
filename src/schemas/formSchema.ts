import { z } from 'zod';

export interface FormValues {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: 'male' | 'female';
  acceptTerms: boolean;
  country: string;
  avatar?: FileList;
}

const GenderEnum = z.enum(['male', 'female']);

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'This field is mandatory')
      .regex(/^[A-ZА-Я]/, 'The name should start on UpperCase letter'),
    age: z.number().min(0, 'The age could not be under 0'),
    email: z.string().email('Input correct email'),
    password: z
      .string()
      .regex(/\d/, 'Password must contain at least 1 digit')
      .regex(/[A-Z]/, 'Password must have 1 uppercase letter')
      .regex(/[a-z]/, 'Password must have 1 lowercase letter')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character (e.g., !@#$%^&*)'
      )
      .min(8, 'The password should be at least 8 symbols'),
    confirmPassword: z.string(),
    gender: GenderEnum,
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, 'You should accept the condition'),
    avatar: z
      .instanceof(FileList)
      .optional()
      .refine(
        (files) => !files || files.length === 0 || files[0]?.size <= 5000000,
        'The file should be less than 5MB'
      )
      .refine(
        (files) =>
          !files ||
          files.length === 0 ||
          ['image/jpeg', 'image/png'].includes(files[0]?.type),
        'Only the JPEG и PNG files accepted'
      ),
    country: z.string().min(1, 'Choose country'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords should match',
    path: ['confirmPassword'],
  });

export type FormData = z.infer<typeof formSchema>;
