import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserWithToken } from '@/types/User';
import { AsyncState } from '../types/AsyncState';
import { fetchCurrentUser } from '@/api/userAPI';
import { useAppSelector } from './hooks';
import { RootState } from './store';
import { addAsyncThunk } from './utils';

type UserState = AsyncState<User>;

const initialState: UserState = {
  isLoading: true,
};

export const loadUser = createAsyncThunk('user/fetchCurrentUser', async (_i, { rejectWithValue }) => {
  try {
    const result = await fetchCurrentUser();
    return result;
  } catch (e: unknown) {
    return rejectWithValue(JSON.stringify(e));
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: () => {
      localStorage.removeItem('token');
      return { isLoading: false, data: undefined, error: undefined };
    },
    login: (_state, action: PayloadAction<UserWithToken>) => {
      const { token, ...user } = action.payload;
      localStorage.setItem('token', token);
      return { isLoading: false, data: user, error: undefined };
    },
  },
  extraReducers: (builder) => {
    addAsyncThunk(builder, loadUser);
  },
});

export const { logout, login } = userSlice.actions;

export const selectUser = (state: RootState): UserState => state.user;
export const useUser = (): AsyncState<User> => useAppSelector(selectUser);

export default userSlice.reducer;
