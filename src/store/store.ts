import {configureStore} from '@reduxjs/toolkit';

import userReducer from './slice/userSlice.ts';
import rideReducer from './slice/rideSlice.ts';
import {useDispatch} from 'react-redux';

const store = configureStore({
  reducer: {
    user: userReducer,
    ride: rideReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export default store;
