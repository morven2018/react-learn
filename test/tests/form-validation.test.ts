import { FormValues, formSchema } from '../../src/schemas/formSchema';
import { TEST_PASSWORDS, validData } from '../mock/test-data';

describe('Form Validation', () => {
  describe('formSchema validation', () => {
    test('validate correct form data', () => {
      expect(() => formSchema.parse(validData)).not.toThrow();
    });

    test('reject empty name', () => {
      const invalidData = { ...validData, name: '' };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'This field is mandatory'
      );
    });

    test('reject name not starting with uppercase', () => {
      const invalidData = { ...validData, name: 'john doe' };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'The name should start on UpperCase letter'
      );
    });

    test('reject negative age', () => {
      const invalidData = { ...validData, age: -5 };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'The age should be over than 0'
      );
    });

    test('should reject undefined age', () => {
      const invalidData = { ...validData, age: undefined };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'This field is mandatory'
      );
    });

    test('reject invalid email', () => {
      const invalidData = { ...validData, email: 'invalid-email' };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'Input correct email'
      );
    });

    test('reject password without digit', () => {
      const invalidData = {
        ...validData,
        password: TEST_PASSWORDS.NO_DIGIT,
        confirmPassword: TEST_PASSWORDS.NO_DIGIT,
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'Password must contain at least 1 digit'
      );
    });

    test('reject password without uppercase', () => {
      const invalidData = {
        ...validData,
        password: TEST_PASSWORDS.NO_UPPERCASE,
        confirmPassword: TEST_PASSWORDS.NO_UPPERCASE,
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'Password must have 1 uppercase letter'
      );
    });

    test('reject password without lowercase', () => {
      const invalidData = {
        ...validData,
        password: TEST_PASSWORDS.NO_LOWERCASE,
        confirmPassword: TEST_PASSWORDS.NO_LOWERCASE,
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'Password must have 1 lowercase letter'
      );
    });

    test('reject password without special character', () => {
      const invalidData = {
        ...validData,
        password: TEST_PASSWORDS.NO_SPECIAL,
        confirmPassword: TEST_PASSWORDS.NO_SPECIAL,
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'Password must contain at least one special character'
      );
    });

    test('reject short password (less 8)', () => {
      const invalidData = {
        ...validData,
        password: TEST_PASSWORDS.TOO_SHORT,
        confirmPassword: TEST_PASSWORDS.TOO_SHORT,
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'The password should be at least 8 symbols'
      );
    });

    test('reject mismatched passwords', () => {
      const invalidData = {
        ...validData,
        password: TEST_PASSWORDS.VALID,
        confirmPassword: TEST_PASSWORDS.DIFFERENT,
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'Passwords should match'
      );
    });

    test('reject undefined gender', () => {
      const invalidData = {
        ...validData,
        gender: undefined,
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'This field is mandatory'
      );
    });

    test('reject not accepted terms', () => {
      const invalidData = {
        ...validData,
        acceptTerms: false,
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'You should accept the condition'
      );
    });

    test('reject invalid image format', () => {
      const invalidData = {
        ...validData,
        picture: 'invalid-base64-string',
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'Only JPEG and PNG files up to 5MB are accepted'
      );
    });

    test('reject empty country', () => {
      const invalidData = {
        ...validData,
        country: '',
      };

      expect(() => formSchema.parse(invalidData)).toThrow('Choose country');
    });
  });

  describe('Form Values Type', () => {
    test('match schema', () => {
      const validData: FormValues = {
        name: 'Test',
        age: 30,
        email: 'test@example.com',
        password: 'Test123!',
        confirmPassword: 'Test123!',
        gender: 'female',
        acceptTerms: true,
        picture: 'data:image/png;base64,test',
        country: 'Canada',
      };

      expect(() => formSchema.parse(validData)).not.toThrow();
    });
  });
});
