import { DefaultError, InfiniteData, QueryKey, useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';

import StateAwareList, { StateAwareListProps } from '../StateAwareList/StateAwareList';

export interface ReactQueryInfiniteStateAwareListProps<
  TQueryFnData,
  TError = DefaultError,
  TData extends InfiniteData<TQueryFnData> = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
  ListItem = unknown,
> extends Omit<StateAwareListProps<ListItem>, 'state' | 'onRefresh'> {
  reactInfiniteQueryOptions: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey, TPageParam>;
  getPageContent: (data: TQueryFnData) => ListItem[];
}

export const ReactQueryInfiniteStateAwareList = <
  TQueryFnData,
  TError = DefaultError,
  TData extends InfiniteData<TQueryFnData> = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
  ListItem = unknown,
>({
  reactInfiniteQueryOptions,
  getPageContent,
  ...props
}: ReactQueryInfiniteStateAwareListProps<TQueryFnData, TError, TData, TQueryKey, TPageParam, ListItem>) => {
  const { isLoading, isRefetching, data, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(reactInfiniteQueryOptions);

  return (
    <StateAwareList
      state={{
        isLoading: isLoading,
        isRefetching: isRefetching,
        items: data?.pages.flatMap(getPageContent),
        error: error,
      }}
      onRefresh={refetch}
      hasMore={hasNextPage}
      isLoadingMore={isFetchingNextPage}
      loadMore={() => {
        console.log('loadMore');
        if (hasNextPage) fetchNextPage();
      }}
      {...props}
    />
  );
};
