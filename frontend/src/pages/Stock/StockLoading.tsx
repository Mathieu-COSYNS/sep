import { FC } from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSkeletonText } from '@ionic/react';

import classes from './Stock.module.scss';

const BasketLoading: FC = () => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonSkeletonText animated style={{ width: '35%', height: '20.48px', margin: '2px' }} />
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div className={classes.item}>
          <IonSkeletonText animated style={{ width: '50%', height: 15, margin: '2px' }} />
          <IonSkeletonText animated style={{ width: '50%', height: 15, margin: '2px' }} />
          <IonSkeletonText animated style={{ width: '50%', height: 15, margin: '2px' }} />
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default BasketLoading;
