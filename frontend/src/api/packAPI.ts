import environment from 'environment';
import { Id } from 'types/Id';
import { Pack } from 'types/Pack';

// const sleep = async (duration: number) => await new Promise((r) => setTimeout(r, duration));

export const fetchPacks = async (): Promise<Pack[] | undefined> => {
  const resp = await fetch(`${environment.API_URL}/packs/`, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }),
  });
  if (resp.status >= 400) throw new Error(`${resp.status} ${resp.statusText}`);
  return await resp.json();
};

export const fetchPackById = async (packId: Id): Promise<Pack | undefined> => {
  const resp = await fetch(`${environment.API_URL}/packs/${packId}/`, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }),
  });
  if (resp.status >= 400) throw new Error(`${resp.status} ${resp.statusText}`);
  return await resp.json();
};
