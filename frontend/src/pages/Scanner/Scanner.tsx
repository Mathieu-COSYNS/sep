import { FC, useEffect, useState } from 'react';
import { useToast } from '@agney/ir-toast';
import { IonAlert, IonButton, IonLoading, useIonRouter } from '@ionic/react';
import { useQuery } from '@tanstack/react-query';
import { has } from 'lodash';
import { useRouteMatch } from 'react-router-dom';

import { Base58 } from '~/utils/base58';
import { reverseMapping } from '~/utils/collections';
import { serializeError } from '~/utils/errors';
import { packApi } from '~/api/packAPI';
import { productApi } from '~/api/productAPI';
import Page from '~/components/Page';
import ScannerBox from '~/components/ScannerBox';
import environment from '~/environment';
import { useIdParam } from '~/hooks/useIdParam';
import { useBasketStore } from '~/store/basketStore';
import { typesMap } from '~/types/typesMap';
import classes from './Scanner.module.scss';

const basketRoute = RegExp(/\/ventes\/(ajouter|\d+)\//);
const newBasketRoute = RegExp(/\/ventes\/ajouter\//);
const editBasketRoute = RegExp(/\/ventes\/\d+\//);
const scannerRoute = RegExp(/\/ventes\/(ajouter|\d+)\/scanner\//);

const base58 = new Base58();

const Scanner: FC = () => {
  const [showQrOverride, setShowQrOverride] = useState(false);
  const [code, setCode] = useState<{ type: string; id: number } | null>(null);
  const router = useIonRouter();
  const Toast = useToast();
  const { addProduct } = useBasketStore();
  const { url } = useRouteMatch();
  const id = useIdParam();

  const { isLoading, isError, data, error } = useQuery(['code', code], async () => {
    if (code?.type === 'product') {
      return productApi.fetchById(code.id);
    }
    if (code?.type === 'pack') {
      return packApi.fetchById(code.id);
    }
    return null;
  });

  useEffect(() => {
    if (isError) {
      Toast.error(serializeError(error));
      setCode(null);
    }
  }, [Toast, error, isError]);

  useEffect(() => {
    if (data) {
      if ('products' in data) {
        for (const product of data.products) {
          addProduct({ quantity: 1, product });
        }
      } else {
        addProduct({ quantity: 1, product: data });
      }
      setCode(null);
      if (router.routeInfo.pushedByRoute?.match(basketRoute)) router.goBack();
      else router.push(url.replace(/scanner\/$/, ''), 'back', 'replace');
    }
  }, [addProduct, data, router, url]);

  const handleScan = (result: string, isShortName = false) => {
    const { QR_CODE_URL } = environment;
    const prefix = `${QR_CODE_URL}/qr/`;

    if (result.startsWith(prefix) || isShortName) {
      const qrCodeData = isShortName
        ? `${reverseMapping(typesMap)[result[0]]}/${result.substring(1)}`
        : result.replace(prefix, '');
      const qrCodeDataParts = qrCodeData.split('/');

      if (qrCodeDataParts.length >= 2) {
        const type = qrCodeDataParts[0];
        const base58Id = qrCodeDataParts[1];
        if (has(typesMap, type)) {
          try {
            const id = base58.decode(base58Id);
            setCode({ type, id });
          } catch (e) {
            Toast.error(`${isShortName ? result : base58Id} n'est pas un identifiant valide`);
          }
        } else {
          Toast.error(`"${type}" n'est pas tu type de QR code connu`);
        }
        return;
      }
    }

    Toast.error('QR Code non supporté');
  };

  return (
    <Page
      title="Scan"
      backButton={true}
      defaultBackUrl={id ? `/ventes/${id}/` : '/ventes/'}
      backText={
        router.routeInfo.pushedByRoute?.match(newBasketRoute)
          ? 'Nouvelle Vente'
          : router.routeInfo.pushedByRoute?.match(editBasketRoute)
          ? `Modifier la Vente ${id}`
          : 'Ventes'
      }
    >
      <IonLoading isOpen={!!code && isLoading} message="Vérification du QR Code" />
      <div className={classes.scanner}>
        <div>
          <ScannerBox enableOnlyOnRoute={scannerRoute} onScan={handleScan} />
        </div>
        <div className={classes.tips_and_manual}>
          <p className={classes.tips}>Dirigez votre appareil vers un QR Code</p>
          <p>ou</p>
          <IonButton onClick={() => setShowQrOverride(true)} expand="block">
            Entez un code manuellement
          </IonButton>
        </div>
      </div>
      <IonAlert
        isOpen={showQrOverride}
        onDidDismiss={() => {
          setShowQrOverride(false);
        }}
        header={'Alert'}
        message={'Entrez la valeur du QR code'}
        inputs={[
          {
            name: 'qrCodeInputValue',
            type: 'text',
            placeholder: 'XXXX',
          },
        ]}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Ok',
            handler: (value) => {
              handleScan(value.qrCodeInputValue, true);
            },
          },
        ]}
      />
    </Page>
  );
};

export default Scanner;
