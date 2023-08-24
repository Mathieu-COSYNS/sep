import environment from '~/environment';
import { RequestStatusError } from '~/types/RequestStatusError';
import { User, UserWithToken } from '~/types/User';

export const loginUser = async (username: string, password: string): Promise<UserWithToken> => {
  const resp = await fetch(`${environment.API_URL}/login/`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({ username, password }),
  });
  const content = await resp.json();
  if (resp.status === 400) {
    if (content.non_field_errors) {
      throw new RequestStatusError(resp.status, resp.statusText, content.non_field_errors.join(','));
    }
  }
  if (resp.status === 403) {
    if (content.error === 'superuser') {
      throw new RequestStatusError(
        resp.status,
        resp.statusText,
        "Les supers utilisateurs ne peuvent utiliser que le panneau d'administration. Essayez de vous connecter avec un autre compte.",
      );
    }
  }
  return content;
};

export const fetchCurrentUser = async (): Promise<User | undefined> => {
  const token = localStorage.getItem('token');
  if (!token) {
    return undefined;
  }
  const resp = await fetch(`${environment.API_URL}/current-user/`, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }),
  });
  if (resp.status === 401) localStorage.removeItem('token');
  if (resp.status >= 400) throw new Error(`${resp.status} ${resp.statusText}`);
  return await resp.json();
};
