import {User} from './userTypes.ts';

export interface Ride {
  id: string;
  userId: string;
  driverId: string | null;
  pickupLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  destination: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status:
    | 'pending'
    | 'accepted'
    | 'declined'
    | 'started'
    | 'picked-up'
    | 'dropped-off';
  pickupTime: string;
  timestamp: string;
  customer?: User;
}
