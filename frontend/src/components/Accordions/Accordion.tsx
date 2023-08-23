import { IonIcon } from '@ionic/react';
import { chevronForwardOutline, chevronForwardSharp } from 'ionicons/icons';
import { FC, ReactNode } from 'react';
import classes from './Accordion.module.scss';

const Accordion: FC<{ title: string; expand: boolean; children: ReactNode; onClick: () => void }> = ({
  title,
  children,
  expand,
  onClick,
}) => {
  return (
    <>
      <dt className={`${classes.title}${expand ? ` ${classes.is_expanded}` : ''}`} onClick={onClick}>
        <span>{title}</span>
        <IonIcon md={chevronForwardOutline} ios={chevronForwardSharp} aria-label={expand ? 'Réduire' : 'Développer'} />
      </dt>
      <dd className={`${classes.content}${expand ? ` ${classes.is_expanded}` : ''}`} onClick={onClick}>
        {children}
      </dd>
    </>
  );
};

export default Accordion;
