import { IonFab, IonFabButton, IonIcon, IonLabel } from '@ionic/react';
import useBreakpoints from '~/hooks/useBreakpoints';
import { FC } from 'react';
import classes from './Fab.module.scss';

export interface FabProps {
  text?: string;
  iosIcon: string;
  mdIcon: string;
}

const Fab: FC<FabProps> = ({ text, iosIcon, mdIcon }) => {
  const { minBreakpoint } = useBreakpoints();
  const small = !minBreakpoint('md');

  return (
    <IonFab className={classes.fab} vertical="bottom" horizontal={small ? 'end' : 'start'} slot="fixed">
      <IonFabButton className={classes.fab_button} routerLink="/ventes/scanner/">
        <IonIcon ios={iosIcon} md={mdIcon} aria-hidden />
        <IonLabel className={classes.label}>{text}</IonLabel>
      </IonFabButton>
    </IonFab>
  );
};

export default Fab;
