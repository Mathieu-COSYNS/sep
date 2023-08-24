import { FC } from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSkeletonText } from '@ionic/react';

import classes from './Entries.module.scss';

const EntryLoading: FC = () => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonSkeletonText animated style={{ width: '45%', height: '20.48px', margin: '2px' }} />
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent className={classes.content}>
        <IonSkeletonText animated style={{ width: '25%', height: 17, margin: '4px', marginLeft: 'auto' }} />
      </IonCardContent>
    </IonCard>
  );
};

export default EntryLoading;
