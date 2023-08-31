import { FC } from 'react';
import { IonBadge, IonCard, IonCardHeader, IonCardTitle } from '@ionic/react';
import { qrCodeOutline, qrCodeSharp } from 'ionicons/icons';

import { Base58 } from '~/utils/base58';
import Accordions from '~/components/Accordions';
import ListItem, { ListItemButton } from '~/components/ListItem';
import { Pack } from '~/types/Pack';
import classes from '../Stock/Stock.module.scss';

const base58 = new Base58();

export interface PackItemProps {
  pack: Pack;
  onQrCodeButtonClick: (pack: Pack) => void;
}

const PackItem: FC<PackItemProps> = ({ pack, onQrCodeButtonClick }) => {
  const customButtons: ListItemButton[] = [
    {
      id: 'qr-code',
      label: 'Voir le QRcode',
      iosIcon: qrCodeOutline,
      mdIcon: qrCodeSharp,
      onClick: () => onQrCodeButtonClick(pack),
      color: 'secondary',
    },
  ];

  return (
    <IonCard>
      <ListItem
        card={true}
        customButtons={customButtons}
        after={
          <Accordions
            accordions={[
              {
                key: 'products',
                title: `${pack.products.length} Produit${pack.products.length > 1 ? 's' : ''}`,
                children: (
                  <>
                    {pack.products.map((product) => (
                      <p key={product.id}>{product.name}</p>
                    ))}
                  </>
                ),
              },
            ]}
          />
        }
      >
        <IonCardHeader>
          <IonCardTitle className={classes.item_title}>
            <span className={classes.text}>{pack.name}</span>
            <IonBadge>#G{base58.encode(pack.id)}</IonBadge>
          </IonCardTitle>
        </IonCardHeader>
      </ListItem>
    </IonCard>
  );
};

export default PackItem;
