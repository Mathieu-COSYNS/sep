import { FC, ReactNode } from 'react';
import { Color } from '@ionic/core/dist/types/interface';
import { IonButton, IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { closeOutline, closeSharp } from 'ionicons/icons';

import classes from './Message.module.scss';

interface MessageProps {
  onDismiss?: () => void;
  color?: Color;
  disabled?: boolean;
  mode?: 'ios' | 'md';
  children: ReactNode;
}

const Message: FC<MessageProps> = ({ onDismiss, color, disabled, mode, children }) => {
  return (
    <IonCard role="alert" color={color} disabled={disabled} mode={mode}>
      <IonCardContent className={classes.container}>
        <div>{children}</div>
        {onDismiss && (
          <IonButton fill="clear" shape="round" size="small" onClick={() => onDismiss()} aria-label="Fermer">
            <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp} aria-hidden />
          </IonButton>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default Message;
