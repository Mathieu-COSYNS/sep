import { IonBadge, IonCard, IonCardHeader, IonCardTitle } from '@ionic/react';
import Accordions from '@/components/Accordions';
import ListItem, { ListItemButton } from '@/components/ListItem';
import { qrCodeOutline, qrCodeSharp } from 'ionicons/icons';
import { FC } from 'react';
import { Pack } from '@/types/Pack';
import { Base58 } from '@/utils/base58';
import classes from '../Stock/Stock.module.scss';

const base58 = new Base58();

export interface PackItemProps {
  pack: Pack;
  onQrCodeButtonClick: (pack: Pack) => void;
  onEditButtonClick: (pack: Pack) => void;
}

const PackItem: FC<PackItemProps> = ({ pack, onQrCodeButtonClick /*onEditButtonClick*/ }) => {
  const customButtons: ListItemButton[] = [
    {
      id: 'qr-code',
      iosIcon: qrCodeOutline,
      mdIcon: qrCodeSharp,
      onClick: () => onQrCodeButtonClick(pack),
      color: 'secondary',
    },
  ];

  return (
    <IonCard>
      <ListItem
        key={pack.id}
        card={true}
        // onClickEditButton={onEditButtonClick.bind(this, pack)}
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
