import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  UserState,
  SetUserRolePayload,
  SetUserIdPayload,
} from '../../types/userTypes';

const initialState: UserState = {
  role: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserRole: (state, action: PayloadAction<SetUserRolePayload>) => {
      state.role = action.payload.role;
    },
    setUserId: (state, action: PayloadAction<SetUserIdPayload>) => {
      state.userId = action.payload.userId;
    },
  },
});

export const {setUserRole, setUserId} = userSlice.actions;
export default userSlice.reducer;
