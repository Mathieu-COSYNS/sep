import { FC } from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText } from '@ionic/react';

import ListItem from '~/components/ListItem';
import { Entry } from '~/types/Entry';
import classes_stock from '../Stock/Stock.module.scss';
import classes from './Entries.module.scss';

export interface EntriesItemProps {
  entry: Entry;
}

const EntryItem: FC<EntriesItemProps> = ({ entry }) => {
  return (
    <IonCard>
      <ListItem card={true}>
        <IonCardHeader>
          <IonCardTitle className={classes_stock.item_title}>
            <span className={classes_stock.text}>{entry.product.name}</span>
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent class={classes.content}>
          <IonText color={entry.quantity > 0 ? 'success' : entry.quantity < 0 ? 'danger' : 'medium'}>
            {entry.quantity > 0 ? '+' : ''}
            {entry.quantity}
          </IonText>
        </IonCardContent>
      </ListItem>
    </IonCard>
  );
};

export default EntryItem;
