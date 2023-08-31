import { FC, ReactNode, useEffect, useRef } from 'react';
import { Color } from '@ionic/core/dist/types/interface';
import { IonButton, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding } from '@ionic/react';
import { pencilOutline, pencilSharp, trashBinOutline, trashBinSharp } from 'ionicons/icons';

import useBreakpoints from '~/hooks/useBreakpoints';
import classes from './ListItem.module.scss';

export interface ListItemProps {
  children: ReactNode;
  card?: boolean;
  onClickEditButton?: () => void;
  onClickDeleteButton?: () => void;
  customButtons?: ListItemButton[];
  after?: ReactNode;
}

export interface ListItemButton {
  id: string;
  label: string;
  iosIcon: string;
  mdIcon: string;
  onClick: () => void;
  color?: Color;
}

const ListItem: FC<ListItemProps> = ({
  children,
  card = false,
  onClickEditButton,
  onClickDeleteButton,
  customButtons = [],
  after,
}) => {
  const ionItemSlidingRef = useRef<HTMLIonItemSlidingElement>(null);
  const { minBreakpoint } = useBreakpoints();
  const small = !minBreakpoint('md');

  useEffect(() => {
    if (!small) {
      ionItemSlidingRef.current?.close();
    }
  }, [small]);

  if (onClickEditButton) {
    customButtons = [
      ...customButtons,
      {
        id: 'edit',
        label: 'Modifier',
        iosIcon: pencilOutline,
        mdIcon: pencilSharp,
        onClick: onClickEditButton,
      },
    ];
  }

  if (onClickDeleteButton) {
    customButtons = [
      ...customButtons,
      {
        id: 'delete',
        label: 'Supprimer',
        iosIcon: trashBinOutline,
        mdIcon: trashBinSharp,
        onClick: onClickDeleteButton,
        color: 'danger',
      },
    ];
  }

  const buttons: ListItemButton[] = customButtons.map((customButton) => ({
    ...customButton,
    onClick: () => {
      ionItemSlidingRef.current?.close();
      customButton.onClick();
    },
  }));

  return (
    <IonItemSliding
      ref={ionItemSlidingRef}
      className={card ? classes.card : undefined}
      disabled={!small || buttons.length == 0}
    >
      <IonItem className={classes.ion_item}>
        <div>
          <div className={classes.content}>
            <div>{children}</div>
            {buttons.map((button) => (
              <IonButton
                key={button.id}
                className={classes.button}
                onClick={button.onClick}
                color={button.color}
                aria-label={button.label}
              >
                <IonIcon slot="icon-only" ios={button.iosIcon} md={button.mdIcon} aria-hidden />
              </IonButton>
            ))}
          </div>
          {after}
        </div>
      </IonItem>
      {buttons.length !== 0 && (
        <IonItemOptions side="end">
          {buttons.map((button) => (
            <IonItemOption key={button.id} onClick={button.onClick} color={button.color} aria-label={button.label}>
              <IonIcon slot="icon-only" ios={button.iosIcon} md={button.mdIcon} aria-hidden />
            </IonItemOption>
          ))}
        </IonItemOptions>
      )}
    </IonItemSliding>
  );
};

export default ListItem;
