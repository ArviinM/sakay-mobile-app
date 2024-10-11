import {UserActionTypes} from '../constants/constants.ts';

export interface UserState {
  role: 'driver' | 'customer' | null;
  userId?: string;
}

export type SetUserRolePayload = {role: 'driver' | 'customer'};
export type SetUserIdPayload = {userId: string};

export interface PayloadAction<TType extends string, TPayload> {
  type: TType;
  payload: TPayload;
}

export type UserAction =
  | PayloadAction<UserActionTypes.SET_USER_ROLE, SetUserRolePayload>
  | PayloadAction<UserActionTypes.SET_USER_ID, SetUserIdPayload>;
