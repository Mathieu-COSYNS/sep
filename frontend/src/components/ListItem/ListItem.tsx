import { IonButton, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel } from '@ionic/react';
import useBreakpoints from '@/hooks/useBreakpoints';
import { pencilOutline, pencilSharp, trashBinOutline, trashBinSharp } from 'ionicons/icons';
import { FC, ReactNode, useEffect, useRef } from 'react';
import { Color } from '@ionic/core/dist/types/interface';
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
          <IonLabel className={classes.ion_label}>
            <div className={classes.content}>
              <div>{children}</div>
              {buttons.map((button) => (
                <IonButton key={button.id} className={classes.button} onClick={button.onClick} color={button.color}>
                  <IonIcon slot="icon-only" ios={button.iosIcon} md={button.mdIcon} />
                </IonButton>
              ))}
            </div>
          </IonLabel>
          {after}
        </div>
      </IonItem>
      <IonItemOptions side="end">
        {buttons.map((button) => (
          <IonItemOption key={button.id} onClick={button.onClick} color={button.color}>
            <IonIcon slot="icon-only" ios={button.iosIcon} md={button.mdIcon} />
          </IonItemOption>
        ))}
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default ListItem;
