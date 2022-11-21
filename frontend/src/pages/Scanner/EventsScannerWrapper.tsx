import { FC, useState } from 'react';
import { useToast } from '@agney/ir-toast';
import Scanner from './Scanner';
import { useIonAlert, useIonLoading } from '@ionic/react';
import classes from './Scanner.module.scss';
import environment from 'environment';
import { useParams } from 'react-router';

const EventsScannerWrapper: FC = () => {
  const Toast = useToast();
  const [isInDialog, setIsInDialog] = useState<boolean>(false);
  const [presentAlert] = useIonAlert();
  const [present, dismiss] = useIonLoading();
  const { id: eventId } = useParams<{ id: string }>();

  const handleScan = async (result: string) => {
    if (isInDialog) return;
    if (/[A-Z0-9]{12}/.test(result)) {
      setIsInDialog(true);
      present({
        message: 'Verification...',
      });

      const resp = await fetch(`${environment.API_URL}/events/${eventId}/${result}/`, {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      });
      const commonAlertProps = {
        buttons: ['OK'],
        onDidDismiss: () => {
          setIsInDialog(false);
        },
      };
      if (resp.status >= 400) {
        dismiss();
        if (resp.status == 404) {
          presentAlert({
            header: 'Invalide',
            message: 'Ce QR code est invalide',
            cssClass: `${classes.alert_with_icon} ${classes.alert_invalid}`,
            ...commonAlertProps,
          });
        } else {
          presentAlert({
            header: 'Erreur',
            message: 'Une erreur est survenue pendant la verification du QR code',
            ...commonAlertProps,
          });
        }
      } else {
        const data = await resp.json();
        dismiss();
        presentAlert({
          header: 'Validé',
          subHeader: `${data.price}€`,
          message: data.label,
          cssClass: `${classes.alert_with_icon} ${classes.alert_successful}`,
          ...commonAlertProps,
        });
      }
      return;
    }

    Toast.error('QrCode non supporté');
  };

  return <Scanner onScan={handleScan} backButton={false} enableOnlyOnRoute={RegExp(/events\/\d+/)} />;
};

export default EventsScannerWrapper;
