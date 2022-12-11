import { FC } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import Page from '@/components/Page';
import classes from './ErrorPage.module.scss';

export interface ErrorPageProps {
  title: string;
  code: number;
  explanation: string;
}

const ErrorPage: FC<ErrorPageProps> = ({ title, code, explanation }) => {
  return (
    <Page title={title}>
      <div className={classes.container}>
        <div>
          <h1>{code}</h1>
          <p>{explanation}</p>
        </div>
        <IonButton className={classes.back_button} color="primary" routerLink="/" routerDirection="back" expand="block">
          <IonIcon icon={arrowBackOutline} slot="start" />
          {"Retour à la page d'accueil"}
        </IonButton>
      </div>
    </Page>
  );
};

export default ErrorPage;
