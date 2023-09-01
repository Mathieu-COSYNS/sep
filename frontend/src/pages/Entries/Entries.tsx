import { FC } from 'react';
import { capitalize } from 'lodash';

import { entriesApi } from '~/api/entriesAPI';
import Page from '~/components/Page';
import { ReactQueryStateAwareList } from '~/components/StateAwareList';
import shared_classes from '../shared.module.scss';
import EntryItem from './EntryItem';
import EntryLoading from './EntryLoading';

const Entries: FC = () => {
  return (
    <Page title="Entrées">
      <ReactQueryStateAwareList
        reactQueryOptions={{ queryKey: ['entries/all'], queryFn: entriesApi.fetchAll }}
        renderItem={(entry) => <EntryItem entry={entry} />}
        keyResolver={(entry) => `${entry.id}`}
        loadingComponent={<EntryLoading />}
        emptyComponent={'Aucune Entrée'}
        groupResolver={(entry) =>
          capitalize(
            new Date(entry.created_date).toLocaleDateString('fr-BE', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
          )
        }
        renderGroup={(group, entries) => (
          <div className={shared_classes.group}>
            <p>
              {group} - {entries.length} entrée{entries.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      />
    </Page>
  );
};

export default Entries;
