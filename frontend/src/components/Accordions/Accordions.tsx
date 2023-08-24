import { FC, ReactNode, useState } from 'react';

import Accordion from './Accordion';
import classes from './Accordion.module.scss';

export interface AccordionsProps {
  accordions: { key: string; title: string; children: ReactNode }[];
}

const Accordions: FC<AccordionsProps> = ({ accordions }) => {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  return (
    <dl className={classes.accordion}>
      {accordions.map(({ key, title, children }) => (
        <Accordion
          key={key}
          title={title}
          onClick={() => setOpen((open) => ({ ...open, [key]: !open[key] }))}
          expand={!!open[key]}
        >
          {children}
        </Accordion>
      ))}
    </dl>
  );
};

export default Accordions;
