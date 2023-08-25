import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';

import StateAwareList, { StateAwareListProps } from '../StateAwareList/StateAwareList';

export interface ReactQueryStateAwareListProps<
  TQueryFnData extends unknown[] = unknown[],
  TError = unknown,
  TData extends unknown[] = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends Omit<StateAwareListProps<TData[0]>, 'state' | 'onRefresh'> {
  reactQueryOptions: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>;
}

export const ReactQueryStateAwareList = <
  TQueryFnData extends unknown[] = unknown[],
  TError = unknown,
  TData extends unknown[] = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  reactQueryOptions,
  ...props
}: ReactQueryStateAwareListProps<TQueryFnData, TError, TData, TQueryKey>) => {
  const { isLoading, isRefetching, data, error, refetch } = useQuery(reactQueryOptions);

  return (
    <StateAwareList
      state={{ isLoading: isLoading, isRefetching: isRefetching, items: data, error: error }}
      onRefresh={refetch}
      {...props}
    />
  );
};
