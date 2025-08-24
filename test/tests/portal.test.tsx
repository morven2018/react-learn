import Portal from '../../src/components/modal/portal';
import { render } from '@testing-library/react';

describe('Portal', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('create and append portal wrapper to body', () => {
    const wrapperId = 'test-portal';
    const testContent = 'Portal Content';

    render(<Portal wrapperId={wrapperId}>{testContent}</Portal>);

    const wrapper = document.getElementById(wrapperId);
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveTextContent(testContent);

    if (wrapper?.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  });

  test('use existing wrapper element if found', () => {
    const wrapperId = 'existing-portal';
    const existingWrapper = document.createElement('div');
    existingWrapper.id = wrapperId;
    document.body.appendChild(existingWrapper);

    const testContent = 'Portal Content';
    render(<Portal wrapperId={wrapperId}>{testContent}</Portal>);

    const wrapper = document.getElementById(wrapperId);
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveTextContent(testContent);

    document.body.removeChild(existingWrapper);
  });

  test('remove system-created wrapper on unmount', () => {
    const wrapperId = 'temp-portal';
    const testContent = 'Portal Content';

    const { unmount } = render(
      <Portal wrapperId={wrapperId}>{testContent}</Portal>
    );

    const wrapper = document.getElementById(wrapperId);
    expect(wrapper).toBeInTheDocument();

    unmount();

    expect(document.getElementById(wrapperId)).not.toBeInTheDocument();
  });

  test('not remove existing wrapper on unmount', () => {
    const wrapperId = 'persistent-portal';
    const existingWrapper = document.createElement('div');
    existingWrapper.id = wrapperId;
    document.body.appendChild(existingWrapper);

    const testContent = 'Portal Content';
    const { unmount } = render(
      <Portal wrapperId={wrapperId}>{testContent}</Portal>
    );

    const wrapper = document.getElementById(wrapperId);
    expect(wrapper).toBeInTheDocument();

    unmount();

    expect(document.getElementById(wrapperId)).toBeInTheDocument();

    document.body.removeChild(existingWrapper);
  });

  test('handle multiple portals with different wrapper IDs', () => {
    const wrapperId1 = 'portal-1';
    const wrapperId2 = 'portal-2';
    const content1 = 'Content 1';
    const content2 = 'Content 2';

    render(<Portal wrapperId={wrapperId1}>{content1}</Portal>);
    render(<Portal wrapperId={wrapperId2}>{content2}</Portal>);

    const wrapper1 = document.getElementById(wrapperId1);
    const wrapper2 = document.getElementById(wrapperId2);

    expect(wrapper1).toBeInTheDocument();
    expect(wrapper2).toBeInTheDocument();
    expect(wrapper1).toHaveTextContent(content1);
    expect(wrapper2).toHaveTextContent(content2);

    if (wrapper1) document.body.removeChild(wrapper1);
    if (wrapper2) document.body.removeChild(wrapper2);
  });
});
