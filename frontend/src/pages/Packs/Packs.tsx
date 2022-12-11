import { IonItem, useIonRouter } from '@ionic/react';
import Page from '@/components/Page';
import StateAwareList from '@/components/StateAwareList';
import PackItem from './PackItem';
import { useEffect, FC } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { loadPacks, usePacks } from '@/redux/packsSlice';
import { Pack } from '@/types/Pack';
import { Base58 } from '@/utils/base58';
import PackLoading from './PackLoading';

const base58 = new Base58();

const Packs: FC = () => {
  const router = useIonRouter();
  const packs = usePacks();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadPacks());
  }, [dispatch]);

  const handleEditButtonClick = (pack: Pack) => {
    console.log('edit', pack);
  };

  const handleQrCodeButtonClick = (pack: Pack) => {
    router.push(`/qr/pack/${base58.encode(pack.id)}/`);
  };

  const handleRefresh = () => {
    dispatch(loadPacks());
  };

  return (
    <Page title="Packs">
      <StateAwareList
        state={{ isLoading: packs.isLoading, items: packs.data, error: packs.error }}
        renderItem={(pack) => (
          <PackItem
            pack={pack}
            onQrCodeButtonClick={handleQrCodeButtonClick}
            onEditButtonClick={handleEditButtonClick}
          />
        )}
        keyResolver={(pack) => `${pack.id}`}
        loadingComponent={<PackLoading />}
        emptyComponent={'Aucun Pack'}
        renderError={(error) => <IonItem>Error: {JSON.stringify(error, undefined, 2)}</IonItem>}
        onRefresh={handleRefresh}
      />
    </Page>
  );
};

export default Packs;
