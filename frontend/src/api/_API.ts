import environment from '~/environment';
import { BaseEditableObject } from '~/types/BaseEditableObject';
import { BaseObject } from '~/types/BaseObject';
import { Id } from '~/types/Id';
import { RequestStatusError } from '~/types/RequestStatusError';

export class ReadApi<ReadDataType extends BaseObject> {
  private _slug: string;

  constructor(slug: string) {
    this._slug = slug;
  }

  get slug(): string {
    return this._slug;
  }

  fetchAll = async (): Promise<ReadDataType[]> => {
    const resp = await fetch(`${environment.API_URL}/${this.slug}/`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
    if (resp.status >= 400) throw new Error(`${resp.status} ${resp.statusText}`);
    return await resp.json();
  };

  fetchById = async (id: Id): Promise<ReadDataType> => {
    const resp = await fetch(`${environment.API_URL}/${this.slug}/${id}/`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
    if (resp.status >= 400) throw new Error(`${resp.status} ${resp.statusText}`);
    return await resp.json();
  };
}

export class CRUDApi<
  ReadDataType extends BaseObject,
  SaveDataType extends BaseEditableObject,
> extends ReadApi<ReadDataType> {
  private _saveSerializer?: (data: SaveDataType) => string;

  constructor(slug: string, saveSerializer?: (data: SaveDataType) => string) {
    super(slug);
    this._saveSerializer = saveSerializer;
  }

  save = async (data?: SaveDataType, preferPatch = false): Promise<ReadDataType | undefined> => {
    if (!data) return;

    const create: boolean = typeof data.id !== 'number';

    const method = create ? 'POST' : preferPatch ? 'PATCH' : 'PUT';

    const resp = await fetch(`${environment.API_URL}/${this.slug}/${create ? '' : `${data.id}/`}`, {
      method,
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      body: this._saveSerializer ? this._saveSerializer(data) : JSON.stringify(data),
    });
    const content = await resp.json();
    if (resp.status >= 400) throw new RequestStatusError(resp.status, resp.statusText, JSON.stringify(content));
    return content;
  };

  deleteById = async (id: Id): Promise<Id> => {
    const resp = await fetch(`${environment.API_URL}/${this.slug}/${id}/`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
    if (resp.status >= 400) throw new Error(`${resp.status} ${resp.statusText}`);
    return id;
  };
}

export const isCRUDApi = <ReadDataType extends BaseObject, SaveDataType extends BaseEditableObject>(
  api: ReadApi<ReadDataType> | CRUDApi<ReadDataType, SaveDataType>,
): api is CRUDApi<ReadDataType, SaveDataType> => {
  return !!(api as CRUDApi<ReadDataType, SaveDataType>).deleteById;
};
