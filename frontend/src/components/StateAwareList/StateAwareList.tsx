import { IonButton, IonButtons, IonIcon, IonList, IonToolbar } from '@ionic/react';
import LoadingBar from '~/components/LoadingBar';
import Refresher from '~/components/Refresher';
import useBreakpoints from '~/hooks/useBreakpoints';
import { refreshOutline, refreshSharp } from 'ionicons/icons';
import { groupBy } from 'lodash';
import { ReactElement, ReactNode, useMemo, useState } from 'react';
import { GroupedVirtuoso, Virtuoso } from 'react-virtuoso';
import Empty from './Empty';
import classes from './StateAwareList.module.scss';

export interface StateAwareList<Item> {
  state: {
    isLoading: boolean;
    error?: unknown;
    items?: Item[];
  };
  toolbarButtons?: ReactNode[];
  loadingComponent: ReactNode;
  numberOfLoadingComponents?: number;
  emptyComponent: string | ReactNode;
  renderItem: (item: Item) => ReactNode;
  renderError: (error: unknown) => ReactNode;
  keyResolver: (item: Item) => string;
  groupResolver?: (item: Item) => string;
  renderGroup?: (group: string, items: Item[]) => ReactNode;
  onRefresh?: () => void;
}

const StateAwareList = <Item,>({
  toolbarButtons,
  loadingComponent,
  numberOfLoadingComponents = 5,
  emptyComponent,
  renderItem,
  renderError,
  state,
  keyResolver,
  groupResolver,
  renderGroup,
  onRefresh,
}: StateAwareList<Item>): ReactElement => {
  const { minBreakpoint } = useBreakpoints();
  const [atTop, setAtTop] = useState(true);

  const groups = useMemo(() => groupBy(state.items, groupResolver), [groupResolver, state.items]);
  const groupCounts = useMemo(() => Object.keys(groups).map((index) => groups[index].length), [groups]);

  let content = undefined;
  if (state.isLoading) {
    content = (
      <div className={classes.container}>
        <div style={{ position: 'relative' }}>
          <LoadingBar show={true} />
          <IonList style={{ height: '100%' }}>
            <Virtuoso totalCount={numberOfLoadingComponents} itemContent={() => loadingComponent} />
          </IonList>
        </div>
      </div>
    );
  }

  if (!content && state.error) {
    content = <IonList>{renderError(state.error)}</IonList>;
  }

  if (!content) {
    if (!state.items || state.items.length === 0) {
      content = (
        <IonList>{typeof emptyComponent === 'string' ? <Empty message={emptyComponent} /> : emptyComponent}</IonList>
      );
    } else {
      const data = state.items;
      const commonVirtuosoProps = {
        itemContent: (index: number) => renderItem(data[index]),
        computeItemKey: (index: number, item: Item) => (item ? keyResolver(item) : index),
        atTopStateChange: (atTop: boolean) => setAtTop(atTop),
      };
      content = (
        <IonList className={classes.container}>
          <div>
            {groupResolver && renderGroup ? (
              <GroupedVirtuoso
                groupCounts={groupCounts}
                groupContent={(index) => (
                  <>{renderGroup(Object.keys(groups)[index], groups[Object.keys(groups)[index]])}</>
                )}
                {...commonVirtuosoProps}
              />
            ) : (
              <Virtuoso totalCount={data.length} {...commonVirtuosoProps} />
            )}
          </div>
        </IonList>
      );
    }
  }

  if (minBreakpoint('md') && !!onRefresh)
    toolbarButtons = [
      ...(toolbarButtons || []),
      <IonButton key="refresher" fill="clear" shape="round" onClick={onRefresh}>
        <IonIcon slot="start" ios={refreshOutline} md={refreshSharp} aria-hidden />
        Mettre à jour
      </IonButton>,
    ];

  return (
    <>
      {!minBreakpoint('md') && !!onRefresh && (
        <Refresher isLoading={state.isLoading} onRefresh={onRefresh} disabled={!atTop} />
      )}
      {!!toolbarButtons && toolbarButtons.length > 0 && (
        <IonToolbar color="light">
          <IonButtons slot="start">{toolbarButtons}</IonButtons>
        </IonToolbar>
      )}
      {content}
    </>
  );
};

export default StateAwareList;
