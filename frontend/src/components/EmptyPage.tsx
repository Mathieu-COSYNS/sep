import { FC, ReactNode } from 'react';
import { IonContent, IonPage } from '@ionic/react';

const EmptyPage: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <IonPage>
      <IonContent>{children}</IonContent>
    </IonPage>
  );
};

export default EmptyPage;
