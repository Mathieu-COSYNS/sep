import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchCurrentUser, loginUser } from '~/api/userAPI';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  const {
    isLoading,
    error,
    data: user,
  } = useQuery({
    queryKey: ['user', token],
    queryFn: fetchCurrentUser,
  });

  const login = async (username: string, password: string) => {
    const { token, ...user } = await loginUser(username, password);
    localStorage.setItem('token', token);
    queryClient.invalidateQueries();
    queryClient.setQueryData(['user', token], user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    queryClient.invalidateQueries();
    queryClient.setQueryData(['user', null], null);
  };

  return { isLoading, error, user, login, logout };
};
