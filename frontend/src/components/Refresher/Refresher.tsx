import { IonRefresher, IonRefresherContent } from '@ionic/react';
import { useEffect, useRef, FC } from 'react';

export interface RefresherProps {
  isLoading: boolean;
  onRefresh: () => void;
  disabled?: boolean;
}

const Refresher: FC<RefresherProps> = ({ isLoading, onRefresh, disabled }) => {
  const ref = useRef<HTMLIonRefresherElement>(null);
  useEffect(() => {
    if (!isLoading) ref.current?.complete();
  }, [isLoading]);

  return (
    <IonRefresher ref={ref} slot="fixed" onIonRefresh={onRefresh} disabled={disabled}>
      <IonRefresherContent />
    </IonRefresher>
  );
};

export default Refresher;
