import { Fragment, ReactElement, ReactNode, useMemo, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { refreshOutline, refreshSharp } from 'ionicons/icons';
import { groupBy } from 'lodash';
import { GroupedVirtuoso, Virtuoso } from 'react-virtuoso';

import { serializeError } from '~/utils/errors';
import LoadingBar from '~/components/LoadingBar';
import Refresher from '~/components/Refresher';
import useBreakpoints from '~/hooks/useBreakpoints';
import Empty from './Empty';
import classes from './StateAwareList.module.scss';

type Context = {
  hasMore?: boolean;
  isLoadingMore?: boolean;
  loadMore?: () => void;
};

export type StateAwareListProps<Item> = {
  state: {
    isLoading: boolean;
    isRefetching?: boolean;
    error?: unknown;
    items?: Item[];
  };
  toolbarText?: string;
  toolbarButtons?: ReactNode[];
  loadingComponent: ReactNode;
  numberOfLoadingComponents?: number;
  emptyComponent: string | ReactNode;
  renderItem: (item: Item) => ReactNode;
  renderError?: (error: unknown) => ReactNode;
  keyResolver: (item: Item) => string;
  groupResolver?: (item: Item) => string;
  renderGroup?: (group: string, items: Item[]) => ReactNode;
  onRefresh?: () => void;
} & Context;

const StateAwareList = <Item,>({
  toolbarText,
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
  hasMore,
  isLoadingMore,
  loadMore,
}: StateAwareListProps<Item>): ReactElement => {
  const { minBreakpoint } = useBreakpoints();
  const [atTop, setAtTop] = useState(true);

  const groups = useMemo(() => groupBy(state.items, groupResolver), [groupResolver, state.items]);
  const groupCounts = useMemo(() => Object.keys(groups).map((index) => groups[index].length), [groups]);

  let content = undefined;
  if (state.isLoading) {
    content = <Virtuoso totalCount={numberOfLoadingComponents} itemContent={() => loadingComponent} />;
  }

  if (!content && state.error) {
    content = renderError?.(state.error) ?? <IonItem>Error: {serializeError(state.error)}</IonItem>;
  }

  if (!content) {
    if (!state.items || state.items.length === 0) {
      content = typeof emptyComponent === 'string' ? <Empty message={emptyComponent} /> : emptyComponent;
    } else {
      const data = state.items;
      const commonVirtuosoProps = {
        itemContent: (index: number) => <Fragment key={keyResolver(data[index])}>{renderItem(data[index])}</Fragment>,
        computeItemKey: (index: number, item: Item) => (item ? keyResolver(item) : index),
        atTopStateChange: (atTop: boolean) => setAtTop(atTop),
        overscan: loadMore ? 200 : 50,
        endReached: loadMore,
        context: { hasMore, isLoadingMore, loadMore },
        components: { Footer },
      };
      content =
        groupResolver && renderGroup ? (
          <GroupedVirtuoso
            groupCounts={groupCounts}
            groupContent={(index) => <>{renderGroup(Object.keys(groups)[index], groups[Object.keys(groups)[index]])}</>}
            {...commonVirtuosoProps}
          />
        ) : (
          <Virtuoso totalCount={data.length} {...commonVirtuosoProps} />
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
      {!!toolbarButtons && toolbarButtons.length > 0 && (
        <IonToolbar color="light">
          {toolbarText && <IonTitle slot="start">{toolbarText}</IonTitle>}
          <IonButtons slot={toolbarText ? 'end' : 'start'}>{toolbarButtons}</IonButtons>
        </IonToolbar>
      )}
      <div className={classes.container}>
        <div style={{ position: 'relative' }}>
          <LoadingBar show={state.isLoading || state.isRefetching || false} />
          <IonContent>
            {!minBreakpoint('md') && !!onRefresh && (
              <Refresher
                isLoading={state.isLoading || state.isRefetching || false}
                onRefresh={onRefresh}
                disabled={!atTop}
              />
            )}
            <IonList style={{ height: '100%' }}>{content}</IonList>
          </IonContent>
        </div>
      </div>
    </>
  );
};

const Footer = ({ context }: { context?: Context }) => {
  if (!context) return null;

  const { hasMore, isLoadingMore, loadMore } = context;

  if (typeof isLoadingMore === 'undefined') return null;
  if (!hasMore) return null;

  return (
    <div style={{ height: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {isLoadingMore ? <IonSpinner name="dots" /> : <IonButton onClick={() => loadMore?.()}>Charger plus</IonButton>}
    </div>
  );
};

export default StateAwareList;
