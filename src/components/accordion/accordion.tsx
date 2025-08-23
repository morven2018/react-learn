import style from './accordion.module.scss';
import { useState } from 'react';

interface AccordionProps {
  title: string;
}

function Accordion({ title }: Readonly<AccordionProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={style.accordion}>
      <button
        type="button"
        className={style.accordionHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span className={style.accordionIcon}>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className={style.accordionContent}>
          <div className={style.termsContent}>
            <h4>Terms and Conditions Agreement</h4>
            <h5>1. Some header</h5>tj
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nunc
              turpis, commodo nec mi a, mattis dignissim ante. Curabitur
              placerat nunc interdum, vehicula felis ac, cursus nulla. Phasellus
              nec mi vulputate.
            </p>
            <h5>2. Some header</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nunc
              turpis, commodo nec mi a, mattis dignissim ante.
            </p>
            <h5>3. Some header</h5>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nunc
            turpis, commodo nec mi a, mattis dignissim ante. Curabitur placerat
            nunc interdum, vehicula felis ac, cursus nulla. Phasellus nec mi
            vulputate, tempus velit eget, commodo turpis. Ut libero augue,
            eleifend ac justo id, rutrum auctor leo. Class aten taciti sociosqu
            ad litora torquent per conubia nostra, per inceptos himenaeos.
            Mauris rutrum tellus sed arcu tempus, sit amet tempus dolor
            efficitur.
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nunc
              turpis, commodo nec mi a, mattis dignissim ante. Curabitur
              placerat nunc interdum, vehicula felis ac, cursus nulla. Phasellus
              nec mi vulputate, tempus velit eget, commodo turpis. Ut libero
              augue, eleifend ac justo id, rutrum auctor leo. Class aptent
              taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos. Mauris rutrum tellus sed arcu tempus, sit amet
              tempus dolor efficitur.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Accordion;
