import { IonItem } from '@ionic/react';
import Page from '@/components/Page';
import StateAwareList from '@/components/StateAwareList';
import { capitalize } from 'lodash';
import { FC, useEffect } from 'react';
import { loadEntries, useEntries } from '@/redux/entriesSlice';
import { useAppDispatch } from '@/redux/hooks';
import EntryItem from './EntryItem';
import EntryLoading from './EntryLoading';
import shared_classes from '../shared.module.scss';

const Entries: FC = () => {
  const entries = useEntries();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadEntries());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(loadEntries());
  };

  return (
    <Page title="Entrées">
      <StateAwareList
        state={{ isLoading: entries.isLoading, items: entries.data, error: entries.error }}
        renderItem={(entry) => <EntryItem entry={entry} />}
        keyResolver={(entry) => `${entry.id}`}
        loadingComponent={<EntryLoading />}
        emptyComponent={'Aucune Entrée'}
        renderError={(error) => <IonItem>Error: {JSON.stringify(error, undefined, 2)}</IonItem>}
        groupResolver={(entry) =>
          capitalize(
            new Date(entry.created_date).toLocaleDateString('fr-BE', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          )
        }
        renderGroup={(group, entries) => (
          <div className={shared_classes.group}>
            <p>
              {group} - {entries.length} entrée{entries.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
        onRefresh={handleRefresh}
      />
    </Page>
  );
};

export default Entries;
