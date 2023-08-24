import { FC } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonSkeletonText } from '@ionic/react';

import classes from '../Stock/Stock.module.scss';

const PackLoading: FC = () => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonSkeletonText animated style={{ width: '45%', height: '20.48px', margin: '2px' }} />
        </IonCardTitle>
      </IonCardHeader>
      <IonCardHeader>
        <div className={classes.item}>
          <IonSkeletonText animated style={{ width: '50%', height: 17, margin: '4px' }} />
        </div>
      </IonCardHeader>
    </IonCard>
  );
};

export default PackLoading;
