import { FC, useEffect, useState } from 'react';
import { Color } from '@ionic/core';
import { IonAlert, IonButton, IonIcon } from '@ionic/react';
import {
  addOutline,
  addSharp,
  closeOutline,
  closeSharp,
  removeOutline,
  removeSharp,
  trashOutline,
  trashSharp,
} from 'ionicons/icons';

import classes from './Counter.module.scss';

export interface CounterProps {
  label: string;
  orientation?: 'vertical' | 'horizontal';
  color?: Color;
  min?: number;
  max?: number;
  value: number;
  deleteIfDecreaseBeyondMin?: boolean;
  setValue: (value: number) => void;
  increaseValue: () => void;
  decreaseValue: () => void;
}

export const Counter: FC<CounterProps> = ({
  label,
  orientation = 'horizontal',
  color = 'primary',
  min,
  max,
  value,
  deleteIfDecreaseBeyondMin = false,
  setValue,
  increaseValue,
  decreaseValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBeyondMin, setIsBeyondMin] = useState(!!min && value < min);

  useEffect(() => {
    setIsBeyondMin(!!min && value < min);
  }, [min, value]);

  return (
    <div className={`${classes.container} ion-color-${color} ${orientation === 'vertical' ? classes.vertical : ''}`}>
      {!isBeyondMin ? (
        <IonButton
          className={classes.control}
          color={color}
          fill="solid"
          shape="round"
          onClick={() => {
            deleteIfDecreaseBeyondMin && !!min && value <= min ? setIsBeyondMin(true) : decreaseValue();
          }}
          disabled={!deleteIfDecreaseBeyondMin && !!min && value <= min}
        >
          <IonIcon slot="icon-only" ios={removeOutline} md={removeSharp} aria-label="Diminuer" />
        </IonButton>
      ) : (
        <IonButton
          className={`${classes.control} ${classes.control_margin}`}
          color="dark"
          fill="solid"
          shape="round"
          onClick={() => setIsBeyondMin(false)}
        >
          <IonIcon slot="icon-only" ios={closeOutline} md={closeSharp} aria-label="Annuler" />
        </IonButton>
      )}
      <IonButton className={classes.count} fill="clear" onClick={() => setIsOpen(true)}>
        {value}
      </IonButton>
      {!isBeyondMin ? (
        <IonButton
          className={classes.control}
          color={color}
          fill="solid"
          shape="round"
          onClick={() => increaseValue()}
          disabled={!!max && value >= max}
        >
          <IonIcon slot="icon-only" ios={addOutline} md={addSharp} aria-label="Augmenter" />
        </IonButton>
      ) : (
        <IonButton
          className={classes.control}
          color="danger"
          fill="solid"
          shape="round"
          onClick={() => decreaseValue()}
        >
          <IonIcon slot="icon-only" ios={trashOutline} md={trashSharp} aria-label={`Confirmer la valeur ${value}`} />
        </IonButton>
      )}
      <IonAlert
        isOpen={isOpen}
        onDidDismiss={() => setIsOpen(false)}
        header={label}
        message={'Introduisez une nouvelle valeur'}
        inputs={[
          {
            name: 'count',
            type: 'number',
            value: value,
            min,
            max,
          },
        ]}
        buttons={[
          {
            text: 'Annuler',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Ok',
            handler: (value) => {
              const count = parseInt(value.count);
              if (Number.isNaN(count)) return false;
              setValue(count);
            },
          },
        ]}
      />
    </div>
  );
};
