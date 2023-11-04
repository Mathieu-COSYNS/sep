import { FC } from 'react';
import { IonNote, IonSpinner } from '@ionic/react';

import EmptyPage from '~/components/EmptyPage';
import classes from './ServerConnection.module.scss';

export interface ServerConnectionProps {
  status?: 'waiting' | 'failed';
}

const ServerConnection: FC<ServerConnectionProps> = ({ status = 'waiting' }) => {
  return (
    <EmptyPage>
      <div className={classes.container}>
        <img
          className={classes.main_image}
          src={status === 'failed' ? '/assets/data_center_error.svg' : '/assets/data_center.svg'}
          alt="Server"
        />
        <div>
          <h2>Connexion au serveur{status === 'failed' && ' impossible'}</h2>
          <IonNote>
            {status === 'failed'
              ? 'Impossible de ce connecter au serveur. Avez vous une connection internet ? Si oui, il se pourrait que le serveur soit hors service.'
              : 'Cela peut prendre un certain temps si le serveur est endormi ou que votre connexion internet est mauvaise.'}
          </IonNote>
        </div>
        {status === 'waiting' && <IonSpinner />}
      </div>
    </EmptyPage>
  );
};

export default ServerConnection;
