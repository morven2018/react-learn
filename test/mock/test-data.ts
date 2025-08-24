import { FormValues } from '../../src/schemas/formSchema';
import { Forms } from '../../src/shared/types/types';

export const createTestSubmission = (overrides = {}, index = 1) => ({
  type: Forms.Uncontrolled,
  name: `User ${index}`,
  email: 'john@example.com',
  password: 'password123',
  acceptTerms: 'true',
  age: '25',
  gender: 'male',
  picture: 'test.jpg',
  country: 'USA',
  ...overrides,
});

export enum TEST_PASSWORDS {
  VALID = 'Password123!',
  NO_DIGIT = 'Password!',
  NO_UPPERCASE = 'password123!',
  NO_LOWERCASE = 'PASSWORD123!',
  NO_SPECIAL = 'Password123',
  TOO_SHORT = 'Test1!',
  DIFFERENT = 'TestPassword!2',
}

export const validData: FormValues = {
  name: 'John Doe',
  age: 25,
  email: 'john.doe@example.com',
  password: TEST_PASSWORDS.VALID,
  confirmPassword: TEST_PASSWORDS.VALID,
  gender: 'male',
  acceptTerms: true,
  picture: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/',
  country: 'United States',
};
