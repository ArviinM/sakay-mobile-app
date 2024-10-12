export interface User {
  id: string;
  name: string;
  role: 'driver' | 'customer';
  profilePicture: string;
  earnings?: number; // Optional for customers
  review?: number; // Optional for customers
}

export interface PayloadAction<TType extends string, TPayload> {
  type: TType;
  payload: TPayload;
}
