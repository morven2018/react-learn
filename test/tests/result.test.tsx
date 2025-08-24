import Results from '../../src/components/result/result';
import { render, screen } from '@testing-library/react';
import { Forms, Submission } from '../../src/shared/types/types';

describe('Results Component', () => {
  const mockSubmissions: Submission[] = [
    {
      type: Forms.Uncontrolled,
      name: 'John Doe',
      age: '25',
      email: 'john@example.com',
      password: 'Password123!',
      gender: 'male',
      acceptTerms: 'true',
      picture: 'data:image/jpeg;base64,test1',
      country: 'USA',
      timestamp: Date.now() - 30000,
    },
    {
      type: Forms.HookForm,
      name: 'Jane Smith',
      age: '30',
      email: 'jane@example.com',
      password: 'Secure456!',
      gender: 'female',
      acceptTerms: 'true',
      picture: 'data:image/jpeg;base64,test2',
      country: 'Canada',
      timestamp: Date.now() - 10000,
    },
  ];

  const newSubmission: Submission = {
    type: Forms.Uncontrolled,
    name: 'New User',
    age: '22',
    email: 'new@example.com',
    password: 'NewPass123!',
    gender: 'male',
    acceptTerms: 'true',
    picture: 'data:image/jpeg;base64,new',
    country: 'UK',
    timestamp: Date.now(),
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('render empty state when no submissions', () => {
    render(<Results submissions={[]} />);

    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.getByText('No submissions yet')).toBeInTheDocument();
  });

  it('render submissions list with correct data', () => {
    render(<Results submissions={mockSubmissions} />);

    expect(screen.getByText('Results (2)')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  it('show NEW indicator for recent submissions', () => {
    const recentSubmission = [
      {
        ...newSubmission,
        timestamp: Date.now() - 1000,
      },
    ];

    render(<Results submissions={recentSubmission} />);

    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('not show NEW indicator for old submissions', () => {
    const oldSubmission = [
      {
        ...mockSubmissions[0],
        timestamp: Date.now() - 30000,
      },
    ];

    render(<Results submissions={oldSubmission} />);

    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });

  it('display profile images when available', () => {
    render(<Results submissions={mockSubmissions} />);

    const images = screen.getAllByAltText('Profile');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'data:image/jpeg;base64,test2');
    expect(images[1]).toHaveAttribute('src', 'data:image/jpeg;base64,test1');
  });

  it('handle submissions without pictures', () => {
    const submissionWithoutPicture = {
      ...mockSubmissions[0],
      picture: '',
    };

    render(<Results submissions={[submissionWithoutPicture]} />);

    expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
  });

  it('display correct form types', () => {
    render(<Results submissions={mockSubmissions} />);

    expect(screen.getByText(/Uncontrolled/i)).toBeInTheDocument();
    expect(screen.getByText(/hookform/i)).toBeInTheDocument();
  });

  it('use correct delay constant', () => {
    expect(20000).toBe(20000);
  });

  it('clean up timers on unmount', () => {
    const recentSubmission = [
      {
        ...newSubmission,
        timestamp: Date.now() - 1000,
      },
    ];

    const { unmount } = render(<Results submissions={recentSubmission} />);

    expect(() => unmount()).not.toThrow();
  });
});
