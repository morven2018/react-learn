import convertToBase64 from '../../src/shared/lib/converter';
import debounce from '../../src/shared/lib/debounce';

import {
  getPasswordStrength,
  strengthLabels,
} from '../../src/components/forms/fields';

describe('Password Strength Validation', () => {
  describe('getPasswordStrength function', () => {
    test('return 0 for empty password', () => {
      expect(getPasswordStrength('')).toBe(0);
      expect(getPasswordStrength()).toBe(0);
    });

    test('return 1 for password with only requirement met', () => {
      expect(getPasswordStrength('l')).toBe(1);
    });

    test('return 2 for password with only requirement met with length ', () => {
      expect(getPasswordStrength('longpass')).toBe(2);
    });

    test('return 3 for password with length and digit requirements met', () => {
      expect(getPasswordStrength('longpass1')).toBe(3);
    });

    test('return 4 for password with length, digit, and uppercase requirements met', () => {
      expect(getPasswordStrength('Longpass1')).toBe(4);
    });

    test('return 4 for password with length, digit, uppercase, and lowercase requirements met', () => {
      expect(getPasswordStrength('Longpass1')).toBe(4);
    });

    test('return 5 for password with all requirements met including special characters', () => {
      expect(getPasswordStrength('Longpass1!')).toBe(5);
    });

    test('handle passwords shorter than 8 characters', () => {
      expect(getPasswordStrength('short')).toBe(1);
      expect(getPasswordStrength('Short1')).toBe(3);
    });

    test('handle passwords with only special characters', () => {
      expect(getPasswordStrength('!!!!!!!!')).toBe(2);
    });

    test('handle passwords with only numbers', () => {
      expect(getPasswordStrength('12345678')).toBe(2);
    });

    test('handle passwords with only uppercase letters', () => {
      expect(getPasswordStrength('ABCDEFGH')).toBe(2);
    });

    test('handle passwords with only lowercase letters', () => {
      expect(getPasswordStrength('abcdefgh')).toBe(2);
    });

    test('handle complex passwords with all character types', () => {
      expect(getPasswordStrength('P@ssw0rd123!')).toBe(5);
      expect(getPasswordStrength('Very$tr0ngP@ss!')).toBe(5);
    });
  });

  describe('strengthLabels array', () => {
    test('have correct labels for each strength level', () => {
      expect(strengthLabels).toEqual([
        'Extra weak',
        'Weak',
        'Medium',
        'Good',
        'Excellent',
        'Ideal',
      ]);
    });

    test('have 6 strength levels (0-5)', () => {
      expect(strengthLabels.length).toBe(6);
    });

    test('map strength scores to appropriate labels', () => {
      expect(strengthLabels[0]).toBe('Extra weak');
      expect(strengthLabels[1]).toBe('Weak');
      expect(strengthLabels[2]).toBe('Medium');
      expect(strengthLabels[3]).toBe('Good');
      expect(strengthLabels[4]).toBe('Excellent');
      expect(strengthLabels[5]).toBe('Ideal');
    });
  });

  describe('Integration: strength score to label mapping', () => {
    test('map score 0 to "Extra weak"', () => {
      const score = getPasswordStrength('');
      expect(strengthLabels[score]).toBe('Extra weak');
    });

    test('map score 1 to "Weak"', () => {
      const score = getPasswordStrength('abcdefg');
      expect(strengthLabels[score]).toBe('Weak');
    });

    test('map score 2 to "Medium"', () => {
      const score = getPasswordStrength('12345678');
      expect(strengthLabels[score]).toBe('Medium');
    });

    test('map score 3 to "Good"', () => {
      const score = getPasswordStrength('Password');
      expect(strengthLabels[score]).toBe('Good');
    });

    test('map score 4 to "Excellent"', () => {
      const score = getPasswordStrength('Pd1!');
      expect(strengthLabels[score]).toBe('Excellent');
    });

    test('map score 5 to "Ideal"', () => {
      const score = getPasswordStrength('Very$tr0ngP@ss!');
      expect(strengthLabels[score]).toBe('Ideal');
    });
  });
});

describe('Base64 conversion', () => {
  const originalBtoa = global.btoa;

  beforeAll(() => {
    global.btoa = (str: string) =>
      Buffer.from(str, 'binary').toString('base64');
  });

  afterAll(() => {
    global.btoa = originalBtoa;
  });

  const stringToArrayBuffer = (str: string): ArrayBuffer => {
    const buffer = new ArrayBuffer(str.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < str.length; i++) {
      view[i] = str.charCodeAt(i);
    }
    return buffer;
  };

  it('convert a file to base64', async () => {
    const textContent = 'Lorem';
    const mockArrayBuffer = stringToArrayBuffer(textContent);

    const mockFile = {
      type: 'text/plain',
      arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer),
    } as unknown as File;

    const result = await convertToBase64(mockFile);

    const expectedBase64 = Buffer.from(textContent, 'binary').toString(
      'base64'
    );
    expect(result).toBe(`data:text/plain;base64,${expectedBase64}`);
    expect(mockFile.arrayBuffer).toHaveBeenCalledTimes(1);
  });

  it('preserve the file type in the data URL', async () => {
    const content = 'test content';
    const mockArrayBuffer = stringToArrayBuffer(content);
    const mockFile = {
      type: 'image/jpeg',
      arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer),
    } as unknown as File;

    const result = await convertToBase64(mockFile);

    expect(result).toContain('data:image/jpeg;base64,');
  });

  it('convert an image file to base64 with correct MIME type', async () => {
    const pngHeader = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    const mockArrayBuffer = pngHeader.buffer;

    const mockFile = {
      type: 'image/png',
      arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer),
    } as unknown as File;

    const result = await convertToBase64(mockFile);

    const headerString = String.fromCharCode(...pngHeader);
    const expectedBase64 = Buffer.from(headerString, 'binary').toString(
      'base64'
    );

    expect(result).toBe(`data:image/png;base64,${expectedBase64}`);
    expect(mockFile.arrayBuffer).toHaveBeenCalledTimes(1);
  });

  it('convert a JPEG image file to base64', async () => {
    const jpegData = new Uint8Array([255, 216, 255, 224]);
    const mockArrayBuffer = jpegData.buffer;

    const mockFile = {
      type: 'image/jpeg',
      arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer),
    } as unknown as File;

    const result = await convertToBase64(mockFile);

    const jpegString = String.fromCharCode(...jpegData);
    const expectedBase64 = Buffer.from(jpegString, 'binary').toString('base64');

    expect(result).toBe(`data:image/jpeg;base64,${expectedBase64}`);
    expect(result).toContain('data:image/jpeg;base64,');
  });

  it('throw an error if file.arrayBuffer fails', async () => {
    const mockFile = {
      type: 'image/png',
      arrayBuffer: jest
        .fn()
        .mockRejectedValue(new Error('Failed to read file')),
    } as unknown as File;

    await expect(convertToBase64(mockFile)).rejects.toThrow(
      'Failed to read file'
    );
  });
});

describe('debounce function', () => {
  jest.useFakeTimers();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('delay function execute', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn('test', 123);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(mockFn).toHaveBeenCalledWith('test', 123);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
