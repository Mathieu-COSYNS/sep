import { IonNote, IonSpinner } from '@ionic/react';
import EmptyPage from '@/components/EmptyPage';
import { FC } from 'react';
import classes from './WaitingServerConnection.module.scss';

const WaitingServerConnection: FC = () => {
  return (
    <EmptyPage>
      <div className={classes.container}>
        <img className={classes.main_image} src="/assets/data_center.svg" />
        <div>
          <h2>Connexion au serveur</h2>
          <IonNote>
            Cela peut prendre un certain temps si le serveur est endormi ou que votre connexion internet est mauvaise.
          </IonNote>
        </div>
        <IonSpinner />
      </div>
    </EmptyPage>
  );
};

export default WaitingServerConnection;
