import LoadingOverlay from '@components/ui/loading-overlay/loading-overlay';
import { render } from '@testing-library/react';

describe('LoadingOverlay Component', () => {
  it('should not render when visible is false', () => {
    const { container } = render(<LoadingOverlay visible={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render when visible is true', () => {
    const { container } = render(<LoadingOverlay visible={true} />);
    expect(container).not.toBeEmptyDOMElement();
  });
});
