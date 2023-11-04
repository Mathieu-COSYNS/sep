import { FC } from 'react';
import { IonButton, IonIcon, useIonRouter } from '@ionic/react';
import { addOutline, addSharp, downloadOutline, downloadSharp } from 'ionicons/icons';
import { capitalize } from 'lodash';

import { downloadSalesReport } from '~/api/saleAPI';
import Page from '~/components/Page';
import { ReactQueryInfiniteStateAwareList } from '~/components/StateAwareList';
import environment from '~/environment';
import { Sale } from '~/types/Sale';
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
      <ReactQueryInfiniteStateAwareList
        reactInfiniteQueryOptions={{
          queryKey: ['sales-with-cursor'],
          queryFn: async ({ pageParam }) => {
            const resp = await fetch(pageParam, {
              method: 'GET',
              headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              }),
            });
            if (resp.status >= 400) throw new Error(`${resp.status} ${resp.statusText}`);
            return (await resp.json()) as { previous: string | null; next: string | null; results: Sale[] };
          },
          initialPageParam: `${environment.API_URL}/sales/?cursor=`,
          getPreviousPageParam: (page) => page.previous,
          getNextPageParam: (page) => page.next,
        }}
        getPageContent={(page) => page.results}
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
