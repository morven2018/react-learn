import AboutPage from '@pages/about/about';
import { render, screen } from '@testing-library/react';

describe('AboutPage', () => {
  beforeEach(() => {
    render(<AboutPage />);
  });

  it('render correctly', () => {
    expect(
      screen.getByRole('heading', { name: /about page/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/done by alena pudina/i)).toBeInTheDocument();

    expect(
      screen.getByText(/completed as part of the course/i)
    ).toBeInTheDocument();
  });

  it('contain GitHub link', () => {
    const gitHubLink = screen.getByRole('link', { name: /github profile/i });

    expect(gitHubLink).toHaveAttribute('href', 'https://github.com/morven2018');
    expect(gitHubLink).toHaveAttribute('target', '_blank');
    expect(gitHubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('contain RS School course link', () => {
    const courseLink = screen.getByRole('link', { name: /react course/i });
    expect(courseLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    expect(courseLink).toHaveAttribute('target', '_blank');
    expect(courseLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
