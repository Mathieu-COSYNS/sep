import { QueryKey, useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';

import StateAwareList, { StateAwareListProps } from '../StateAwareList/StateAwareList';

export interface ReactQueryInfiniteStateAwareListProps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  ListItem = unknown,
> extends Omit<StateAwareListProps<ListItem>, 'state' | 'onRefresh'> {
  reactInfiniteQueryOptions: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>;
  getPageContent: (data: TData) => ListItem[];
}

export const ReactQueryInfiniteStateAwareList = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  ListItem = unknown,
>({
  reactInfiniteQueryOptions,
  getPageContent,
  ...props
}: ReactQueryInfiniteStateAwareListProps<TQueryFnData, TError, TData, TQueryKey, ListItem>) => {
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
