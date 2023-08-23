import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from '@reduxjs/toolkit';
import { AsyncState } from '../types/AsyncState';
import { ReadApi, CRUDApi, isCRUDApi } from '@/api/_API';
import { Id } from '@/types/Id';
import { createDraft, Draft } from 'immer';
import { BaseObject } from '@/types/BaseObject';
import { BaseEditableObject } from '@/types/BaseEditableObject';
import { serializeError } from '@/utils/errors';

export interface APISliceOptions<
  ReadDataType extends BaseObject,
  SaveDataType extends BaseEditableObject,
  CR extends SliceCaseReducers<AsyncState<ReadDataType[]>> = SliceCaseReducers<AsyncState<ReadDataType[]>>,
> {
  name: string;
  api: ReadApi<ReadDataType> | CRUDApi<ReadDataType, SaveDataType>;
  sortCompareFn?: (a: Draft<ReadDataType>, b: Draft<ReadDataType>) => number;
  reducers?: ValidateSliceCaseReducers<AsyncState<ReadDataType[]>, CR>;
  extraReducers?: (builder: ActionReducerMapBuilder<AsyncState<ReadDataType[]>>) => void;
}

export const createRestSlice = <ReadDataType extends BaseObject, SaveDataType extends BaseEditableObject>({
  name,
  api,
  sortCompareFn,
  reducers,
  extraReducers,
}: APISliceOptions<ReadDataType, SaveDataType>) => {
  const initialState: AsyncState<ReadDataType[]> = {
    isLoading: true,
  };

  const fetchAll = createAsyncThunk(`${name}/fetchAll`, async (_i, { rejectWithValue }) => {
    try {
      return await api.fetchAll();
    } catch (e) {
      return rejectWithValue(serializeError(e));
    }
  });

  const fetchById = createAsyncThunk(`${name}/fetchById`, async ({ id }: { id: Id }, { rejectWithValue }) => {
    try {
      return await api.fetchById(id);
    } catch (e) {
      return rejectWithValue(serializeError(e));
    }
  });

  const save = createAsyncThunk(
    `${name}/save`,
    async (obj: { data?: SaveDataType; preferPatch?: boolean } | undefined, { rejectWithValue }) => {
      if (!isCRUDApi(api)) return rejectWithValue('Unsupported Operation');
      try {
        return await api.save(obj?.data, obj?.preferPatch);
      } catch (e) {
        return rejectWithValue(serializeError(e));
      }
    },
  );

  const deleteById = createAsyncThunk(`${name}/deleteById`, async ({ id }: { id: Id }, { rejectWithValue }) => {
    if (!isCRUDApi(api)) return rejectWithValue('Unsupported Operation');
    try {
      return await api.deleteById(id);
    } catch (e) {
      return rejectWithValue(serializeError(e));
    }
  });

  const insertNewData = (
    state: Draft<AsyncState<ReadDataType[]>>,
    action: PayloadAction<ReadDataType | undefined, string, unknown, never>,
  ) => {
    if (state.data && action.payload) {
      const payloadIndex = state.data.findIndex((value) => value.id === action.payload?.id);
      if (payloadIndex === -1) state.data = [createDraft(action.payload), ...state.data];
      else state.data[payloadIndex] = createDraft(action.payload);

      if (sortCompareFn) {
        state.data.sort(sortCompareFn);
      }
    } else if (action.payload) state.data = [createDraft(action.payload)];
  };

  const slice = createSlice({
    name,
    initialState,
    reducers: reducers || {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchAll.pending, (state) => {
          state.isLoading = true;
          state.data = undefined;
          state.error = undefined;
        })
        .addCase(fetchAll.fulfilled, (state, action) => {
          state.isLoading = false;
          state.error = undefined;
          state.data = action.payload ? createDraft(action.payload) : undefined;

          if (sortCompareFn) state.data?.sort(sortCompareFn);
        })
        .addCase(fetchAll.rejected, (state, action) => {
          state.isLoading = false;
          state.data = undefined;
          state.error = action.payload;
        });
      builder
        .addCase(fetchById.pending, (state) => {
          state.isLoading = true;
          state.error = undefined;
        })
        .addCase(fetchById.fulfilled, (state, action) => {
          state.isLoading = false;
          state.error = undefined;
          insertNewData(state, action);
        })
        .addCase(fetchById.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        });
      builder.addCase(save.fulfilled, (state, action) => {
        insertNewData(state, action);
      });
      builder.addCase(save.rejected, (_state, action) => {
        throw action.payload;
      });
      builder.addCase(deleteById.fulfilled, (state, action) => {
        if (action.payload) {
          state.data = state.data?.filter((value) => value.id !== action.payload);
        }
      });
      if (extraReducers) extraReducers(builder);
    },
  });

  return {
    slice,
    extraReducers: {
      fetchAll,
      fetchById,
      save,
      deleteById,
    },
  };
};
