import {User} from './userTypes.ts';

export interface Ride {
  id: string;
  userId: string;
  driverId: string | null;
  pickupLocation: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  status:
    | 'pending'
    | 'accepted'
    | 'declined'
    | 'started'
    | 'picked-up'
    | 'dropped-off';
  pickupTime: Date;
  timestamp: Date;
  customer?: User;
}
