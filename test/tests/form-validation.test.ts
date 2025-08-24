import { FormValues, formSchema } from '../../src/schemas/formSchema';

describe('Form Validation', () => {
  describe('formSchema validation', () => {
    test('validate correct form data', () => {
      const validData: FormValues = {
        name: 'John Doe',
        age: 25,
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/',
        country: 'United States',
      };

      expect(() => formSchema.parse(validData)).not.toThrow();
    });

    test('reject empty name', () => {
      const invalidData = {
        name: '',
        age: 25,
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'This field is mandatory'
      );
    });

    test('reject name not starting with uppercase', () => {
      const invalidData = {
        name: 'john doe',
        age: 25,
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'The name should start on UpperCase letter'
      );
    });

    test('reject negative age', () => {
      const invalidData = {
        name: 'John Doe',
        age: -5,
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'The age should be over than 0'
      );
    });

    test('should reject undefined age', () => {
      const invalidData = {
        name: 'John Doe',
        age: undefined,
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'This field is mandatory'
      );
    });

    test('reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        age: 25,
        email: 'invalid-email',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'Input correct email'
      );
    });

    test('reject password without digit', () => {
      const invalidData = {
        name: 'John Doe',
        age: 25,
        email: 'john.doe@example.com',
        password: 'Password!',
        confirmPassword: 'Password!',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'Password must contain at least 1 digit'
      );
    });

    test('reject password without uppercase', () => {
      const invalidData = {
        name: 'John Doe',
        age: 25,
        email: 'john.doe@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'Password must have 1 uppercase letter'
      );
    });

    test('reject password without lowercase', () => {
      const invalidData = {
        name: 'John Doe',
        age: 25,
        email: 'john.doe@example.com',
        password: 'PASSWORD123!',
        confirmPassword: 'PASSWORD123!',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'Password must have 1 lowercase letter'
      );
    });

    test('reject password without special character', () => {
      const invalidData = {
        name: 'John Doe',
        age: 25,
        email: 'john.doe@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'Password must contain at least one special character'
      );
    });

    test('reject short password (less 8)', () => {
      const invalidData = {
        name: 'John Doe',
        age: 25,
        email: 'john.doe@example.com',
        password: 'Pass1!',
        confirmPassword: 'Pass1!',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'The password should be at least 8 symbols'
      );
    });

    test('reject mismatched passwords', () => {
      const invalidData = {
        name: 'John Doe',
        age: 25,
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'Passwords should match'
      );
    });

    test('reject undefined gender', () => {
      const invalidData = {
        name: 'John Doe',
        age: 25,
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: undefined,
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'This field is mandatory'
      );
    });

    test('reject not accepted terms', () => {
      const invalidData = {
        name: 'John Doe',
        age: 25,
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: false,
        picture: 'data:image/jpeg;base64,test',
        country: 'United States',
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'You should accept the condition'
      );
    });

    test('reject invalid image format', () => {
      const invalidData = {
        name: 'John Doe',
        age: 25,
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: true,
        picture: 'invalid-base64-string',
        country: 'United States',
      };

      expect(() => formSchema.parse(invalidData)).toThrow(
        'Only JPEG and PNG files up to 5MB are accepted'
      );
    });

    test('reject empty country', () => {
      const invalidData = {
        name: 'John Doe',
        age: 25,
        email: 'john.doe@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male',
        acceptTerms: true,
        picture: 'data:image/jpeg;base64,test',
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
