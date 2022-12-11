import { IonAlert, IonButton, NavContext, useIonRouter } from '@ionic/react';
import Page from '@/components/Page';
import ScannerBox from '@/components/ScannerBox';
import environment from '@/environment';
import { useContext, useEffect, useState, FC } from 'react';
import { useToast } from '@agney/ir-toast';
import classes from './Scanner.module.scss';
import { useAppDispatch } from '@/redux/hooks';
import { addOneProductById, addProductsByPackId, initializeNewSale, useBasket } from '@/redux/basketSlice';
import { reverseMapping } from '@/utils/collections';
import { typesMap } from '@/types/typesMap';
import { Base58 } from '@/utils/base58';
import { has } from 'lodash';

const base58 = new Base58();

const Scanner: FC = () => {
  const [showQrOverride, setShowQrOverride] = useState(false);
  const navContext = useContext(NavContext);
  const router = useIonRouter();
  const Toast = useToast();
  const basket = useBasket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!basket.isLoading && !basket.data) dispatch(initializeNewSale());
  }, [basket, dispatch]);

  const handleScan = (result: string, isShortName = false) => {
    const { QR_CODE_URL } = environment;
    const prefix = `${QR_CODE_URL}/qr/`;

    if (isShortName) {
      result = `${reverseMapping(typesMap)[result[0]]}/${result.substr(1)}`;
    }

    if (result.startsWith(prefix) || isShortName) {
      const qrCodeData = isShortName ? result : result.replace(prefix, '');

      if (qrCodeData) {
        const qrCodeDataParts = qrCodeData.split('/');
        if (qrCodeDataParts.length >= 2) {
          const type = qrCodeDataParts[0];
          const shortName = qrCodeDataParts[1];
          if (has(typesMap, type)) {
            const id = base58.decode(shortName);
            if (type === 'product') {
              dispatch(addOneProductById(id));
            }
            if (type === 'pack') {
              dispatch(addProductsByPackId(id));
            }
            // navContext.navigate('/qr/' + qrCodeDataParts.join('/'));
            navContext.navigate('/ventes/pannier/');
          }
          return;
        }
      }
    }

    Toast.error('QrCode non supporté');
  };

  return (
    <Page
      title="Scan"
      backButton={true}
      defaultBackUrl="/ventes/"
      backText={router.routeInfo.pushedByRoute === '/ventes/pannier/' ? 'Pannier' : 'Ventes'}
    >
      <div className={classes.scanner}>
        <div>
          <ScannerBox enableOnlyOnRoute={RegExp(/ventes\/scanner/)} onScan={handleScan} />
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
