import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {User} from '../../types/userTypes';

interface UserState {
  userData: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isOnline?: boolean;
}

const initialState: UserState = {
  userData: null,
  status: 'idle',
  error: null,
};

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (userId: string, {rejectWithValue}) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`);
      return (await response.json()) as Promise<User>;
    } catch (error) {
      console.error('Error fetching user:', error);
      return rejectWithValue(error);
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleOnlineStatus: state => {
      if (state.userData?.role === 'driver') {
        state.isOnline = !state.isOnline;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserById.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userData = action.payload;
        if (action.payload.role === 'driver') {
          state.isOnline = false;
        }
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user';
      });
  },
});

export const {toggleOnlineStatus} = userSlice.actions;
export default userSlice.reducer;
