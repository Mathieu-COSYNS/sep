import { NavContext, useIonRouter } from '@ionic/react';
import environment from 'environment';
import { useContext, useEffect, FC } from 'react';
import { useToast } from '@agney/ir-toast';
import { useAppDispatch } from 'redux/hooks';
import { addOneProductById, addProductsByPackId, initializeNewSale, useBasket } from 'redux/basketSlice';
import { reverseMapping } from 'utils/collections';
import { typesMap } from 'types/typesMap';
import { Base58 } from 'utils/base58';
import { has } from 'lodash';
import Scanner from './Scanner';

const base58 = new Base58();

const SEPScannerWrapper: FC = () => {
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
    <Scanner
      onScan={handleScan}
      backButton={true}
      defaultBackUrl="/ventes/"
      backText={router.routeInfo.pushedByRoute === '/ventes/pannier/' ? 'Pannier' : 'Ventes'}
      enableOnlyOnRoute={RegExp(/ventes\/scanner/)}
    />
  );
};

export default SEPScannerWrapper;
