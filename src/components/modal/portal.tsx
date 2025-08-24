import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type PortalProps = {
  children: React.ReactNode;
  wrapperId?: string;
};

function Portal({ children, wrapperId = 'portal-root' }: PortalProps) {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;

    if (!element) {
      systemCreated = true;
      element = createWrapperAndAppendToBody(wrapperId);
    }

    setWrapperElement(element);

    return () => {
      if (systemCreated && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  const createWrapperAndAppendToBody = (elementId: string) => {
    const element = document.createElement('div');
    element.setAttribute('id', elementId);
    document.body.appendChild(element);
    return element;
  };

  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
}

export default Portal;
