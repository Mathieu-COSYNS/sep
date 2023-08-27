import { FC } from 'react';
import { IonButton, IonIcon, IonItem, useIonRouter } from '@ionic/react';
import { addOutline, addSharp, downloadOutline, downloadSharp } from 'ionicons/icons';
import { capitalize } from 'lodash';

import { downloadSalesReport, saleApi } from '~/api/saleAPI';
import Page from '~/components/Page';
import { ReactQueryStateAwareList } from '~/components/ReactQueryStateAwareList';
import shared_classes from '../shared.module.scss';
import SaleItem from './SaleItem';
import SaleLoading from './SaleLoading';

const Sales: FC = () => {
  const router = useIonRouter();

  const handleAddButtonClick = () => {
    router.push('/ventes/ajouter/scanner/');
  };

  const handleDownloadReportButtonClick = () => {
    downloadSalesReport();
  };

  return (
    <Page title="Ventes">
      <ReactQueryStateAwareList
        reactQueryOptions={{ queryKey: ['sales/all'], queryFn: saleApi.fetchAll }}
        toolbarButtons={[
          <IonButton key="1" fill="clear" shape="round" onClick={handleAddButtonClick}>
            <IonIcon slot="start" ios={addOutline} md={addSharp} aria-hidden />
            Nouvelle vente
          </IonButton>,
          <IonButton key="2" fill="clear" shape="round" onClick={handleDownloadReportButtonClick}>
            <IonIcon slot="start" ios={downloadOutline} md={downloadSharp} aria-hidden />
            Télécharger
          </IonButton>,
        ]}
        renderItem={(sale) => <SaleItem sale={sale} />}
        keyResolver={(sale) => `${sale.id}`}
        loadingComponent={<SaleLoading />}
        emptyComponent={'Aucune Vente'}
        renderError={(error) => <IonItem>Error: {JSON.stringify(error, undefined, 2)}</IonItem>}
        groupResolver={(sale) =>
          capitalize(
            new Date(sale.created_date).toLocaleDateString('fr-BE', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
          )
        }
        renderGroup={(group, items) => (
          <div className={shared_classes.group}>
            <p>
              {group} -{' '}
              {items.reduce((acc, sale) => (acc += sale.items.reduce((acc, sale) => (acc += sale.quantity), 0)), 0)}{' '}
              produits vendus
            </p>
          </div>
        )}
      />
    </Page>
  );
};

export default Sales;
