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
