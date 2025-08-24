import Accordion from '../../src/components/accordion/accordion';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Accordion Component', () => {
  const defaultProps = {
    title: 'Test Accordion',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render accordion on closed state by default', () => {
    render(<Accordion {...defaultProps} />);

    expect(screen.getByText('Test Accordion')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(
      screen.queryByText('Terms and Conditions Agreement')
    ).not.toBeInTheDocument();
  });

  it('open accordion on header click', () => {
    render(<Accordion {...defaultProps} />);

    const accordionHeader = screen.getByText('Test Accordion');
    fireEvent.click(accordionHeader);

    expect(screen.getByText('−')).toBeInTheDocument();
    expect(
      screen.getByText('Terms and Conditions Agreement')
    ).toBeInTheDocument();
    expect(screen.getByText('1. Some header')).toBeInTheDocument();
  });

  it('close accordion on twice header click', () => {
    render(<Accordion {...defaultProps} />);

    const accordionHeader = screen.getByText('Test Accordion');

    fireEvent.click(accordionHeader);
    expect(screen.getByText('−')).toBeInTheDocument();

    fireEvent.click(accordionHeader);
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(
      screen.queryByText('Terms and Conditions Agreement')
    ).not.toBeInTheDocument();
  });

  it('toggle accordion on header button click', () => {
    render(<Accordion {...defaultProps} />);

    const accordionButton = screen.getByRole('button');

    fireEvent.click(accordionButton);
    expect(screen.getByText('−')).toBeInTheDocument();

    fireEvent.click(accordionButton);
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('display content sections if open', () => {
    render(<Accordion {...defaultProps} />);

    const accordionHeader = screen.getByText('Test Accordion');
    fireEvent.click(accordionHeader);

    expect(
      screen.getByText('Terms and Conditions Agreement')
    ).toBeInTheDocument();
    expect(screen.getByText('1. Some header')).toBeInTheDocument();
    expect(screen.getByText('2. Some header')).toBeInTheDocument();
    expect(screen.getByText('3. Some header')).toBeInTheDocument();
  });
});
