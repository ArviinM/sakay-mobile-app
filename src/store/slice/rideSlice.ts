import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Ride} from '../../types/rideTypes';
import {RootState} from '../store';
import {User} from '../../types/userTypes.ts';

interface RideState {
  rideRequests: Ride[];
  activeRide: Ride | null;
  currentRideRequest: Ride | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  customerFetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RideState = {
  rideRequests: [],
  activeRide: null,
  currentRideRequest: null,
  status: 'idle',
  customerFetchStatus: 'idle',
  error: null,
};

export const fetchRideRequests = createAsyncThunk(
  'ride/fetchRideRequests',
  async () => {
    const response = await fetch('http://localhost:3000/rideRequests');
    return response.json() as Promise<Ride[]>;
  },
);

export const fetchRideRequestCustomer = createAsyncThunk(
  'ride/fetchRideRequestCustomer',
  async (ride: Ride) => {
    const customerResponse = await fetch(
      `http://localhost:3000/users/${ride.userId}`,
    );
    const customerData = await customerResponse.json();
    return {...ride, customer: customerData as User};
  },
);

export const acceptRideRequest = createAsyncThunk(
  'ride/acceptRideRequest',
  async (rideId: string, {getState}) => {
    const state = getState() as RootState;
    const driverId = state.user.userData?.id;
    if (!driverId) {
      throw new Error('Driver ID not found');
    }
    const response = await fetch(
      `http://localhost:3000/rideRequests/${rideId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({status: 'accepted', driverId}),
      },
    );
    if (!response.ok) {
      throw new Error('Failed to accept ride request');
    }
    return response.json() as Promise<Ride>;
  },
);

export const declineRideRequest = createAsyncThunk(
  'ride/declineRideRequest',
  async (rideId: string, {getState}) => {
    const response = await fetch(
      `http://localhost:3000/rideRequests/${rideId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({status: 'declined'}),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to decline ride request');
    }

    return response.json() as Promise<Ride>;
  },
);

export const startRide = createAsyncThunk(
  'ride/startRide',
  async (rideId: string) => {
    const response = await fetch(
      `http://localhost:3000/rideRequests/${rideId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({status: 'started'}),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to start ride');
    }

    return response.json() as Promise<Ride>;
  },
);

export const pickupCustomer = createAsyncThunk(
  // Changed to pickupCustomer
  'ride/pickupCustomer',
  async (rideId: string) => {
    const response = await fetch(
      `http://localhost:3000/rideRequests/${rideId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({status: 'picked-up'}),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to pick up customer'); // Changed message
    }

    return response.json() as Promise<Ride>;
  },
);

export const dropOffCustomer = createAsyncThunk(
  // Changed to dropOffCustomer
  'ride/dropOffCustomer',
  async (rideId: string, {dispatch}) => {
    // dispatch is included here
    const response = await fetch(
      `http://localhost:3000/rideRequests/${rideId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({status: 'dropped-off'}),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to drop off customer'); // Changed message
    }

    return response.json() as Promise<Ride>;
  },
);

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    clearCurrentRideRequest: state => {
      state.currentRideRequest = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRideRequests.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchRideRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rideRequests = action.payload;
      })
      .addCase(fetchRideRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch ride requests';
      })
      .addCase(fetchRideRequestCustomer.pending, state => {
        state.customerFetchStatus = 'loading';
        // You might want to add a loading state here for currentRideRequest
      })
      .addCase(fetchRideRequestCustomer.fulfilled, (state, action) => {
        state.customerFetchStatus = 'succeeded';
        state.currentRideRequest = action.payload;
      })
      .addCase(fetchRideRequestCustomer.rejected, (state, action) => {
        state.customerFetchStatus = 'failed';
        console.error('Error fetching ride request:', action.error);
      })
      .addCase(acceptRideRequest.fulfilled, (state, action) => {
        // Update activeRide and remove from rideRequests
        state.activeRide = action.payload;
        state.rideRequests = state.rideRequests.filter(
          ride => ride.id !== action.payload.id,
        );
      })
      .addCase(declineRideRequest.fulfilled, (state, action) => {
        // Remove declined ride from rideRequests
        state.rideRequests = state.rideRequests.filter(
          ride => ride.id !== action.payload.id,
        );
      })
      .addCase(startRide.fulfilled, (state, action) => {
        // Update activeRide status
        if (state.activeRide?.id === action.payload.id) {
          state.activeRide.status = action.payload.status;
        }
      })
      .addCase(pickupCustomer.fulfilled, (state, action) => {
        // Update activeRide status
        if (state.activeRide?.id === action.payload.id) {
          state.activeRide.status = action.payload.status;
        }
      })
      .addCase(dropOffCustomer.fulfilled, (state, action) => {
        // Clear activeRide and optionally update earnings
        state.activeRide = null;
        // we will add here to update driver's earnings.
        // ... (dispatch action to update earnings if needed)
      });
  },
});

export const {clearCurrentRideRequest} = rideSlice.actions;

export default rideSlice.reducer;
