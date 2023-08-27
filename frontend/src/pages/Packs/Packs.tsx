import { FC } from 'react';
import { useIonRouter } from '@ionic/react';

import { Base58 } from '~/utils/base58';
import { packApi } from '~/api/packAPI';
import Page from '~/components/Page';
import { ReactQueryStateAwareList } from '~/components/ReactQueryStateAwareList';
import { Pack } from '~/types/Pack';
import PackItem from './PackItem';
import PackLoading from './PackLoading';

const base58 = new Base58();

const Packs: FC = () => {
  const router = useIonRouter();

  const handleQrCodeButtonClick = (pack: Pack) => {
    router.push(`/qr/pack/${base58.encode(pack.id)}/`);
  };

  return (
    <Page title="Packs">
      <ReactQueryStateAwareList
        reactQueryOptions={{ queryKey: ['packs/all'], queryFn: packApi.fetchAll }}
        renderItem={(pack) => <PackItem pack={pack} onQrCodeButtonClick={handleQrCodeButtonClick} />}
        keyResolver={(pack) => `${pack.id}`}
        loadingComponent={<PackLoading />}
        emptyComponent={'Aucun Pack'}
      />
    </Page>
  );
};

export default Packs;
