import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Ride} from '../../types/rideTypes';
import {RootState} from '../store';
import {User} from '../../types/userTypes.ts';
import {getAddressFromCoordinates} from '../../utils/geocoding.ts';

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
  async (undefined, {rejectWithValue}) => {
    try {
      const response = await fetch('http://localhost:3000/rideRequests');
      if (!response.ok) {
        throw new Error('Failed to fetch ride requests');
      }
      const data = await response.json();

      const pendingRideRequests = data.filter(
        (ride: Ride) => ride.status === 'pending',
      );

      return pendingRideRequests;
    } catch (error) {
      console.error('Error fetching ride requests:', error);
      return rejectWithValue(error);
    }
  },
);

export const fetchRideRequestCustomer = createAsyncThunk(
  'ride/fetchRideRequestCustomer',
  async (ride: Ride, {rejectWithValue}) => {
    try {
      const customerResponse = await fetch(
        `http://localhost:3000/users/${ride.userId}`,
      );
      if (!customerResponse.ok) {
        throw new Error(`Failed to fetch customer data for ride ${ride.id}`);
      }
      const customerData = await customerResponse.json();

      const pickupAddress = await getAddressFromCoordinates(
        ride.pickupLocation.latitude,
        ride.pickupLocation.longitude,
      );
      const destinationAddress = await getAddressFromCoordinates(
        ride.destination.latitude,
        ride.destination.longitude,
      );

      return {
        ...ride,
        customer: customerData as User,
        pickupLocation: {...ride.pickupLocation, address: pickupAddress},
        destination: {...ride.destination, address: destinationAddress},
      };
    } catch (error) {
      console.error('Error fetching customer data:', error);
      return rejectWithValue(error);
    }
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
  async (rideId: string) => {
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

    return rideId;
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
  async (rideId: string) => {
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
      .addCase(fetchRideRequests.rejected, state => {
        state.status = 'failed';
        state.error = 'Failed to fetch ride requests';
      })
      .addCase(fetchRideRequestCustomer.pending, state => {
        state.customerFetchStatus = 'loading';
      })
      .addCase(fetchRideRequestCustomer.fulfilled, (state, action) => {
        state.customerFetchStatus = 'succeeded';
        state.currentRideRequest = action.payload;
      })
      .addCase(fetchRideRequestCustomer.rejected, (state, action) => {
        state.customerFetchStatus = 'failed';
        console.error('Error fetching ride request:', action.error);
      })
      .addCase(acceptRideRequest.pending, state => {
        state.status = 'loading';
      })
      .addCase(acceptRideRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.activeRide = {
          ...action.payload,
          customer: state.currentRideRequest?.customer,
        };
        state.rideRequests = state.rideRequests.filter(
          ride => ride.id !== action.payload.id,
        );
      })
      .addCase(acceptRideRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to accept ride request';
      })
      .addCase(declineRideRequest.pending, state => {
        state.status = 'loading';
      })
      .addCase(declineRideRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rideRequests = state.rideRequests.filter(
          ride => ride.id !== action.payload,
        );
      })
      .addCase(declineRideRequest.rejected, state => {
        state.status = 'failed';
        state.error = 'Failed to decline ride request';
      })
      .addCase(startRide.pending, state => {
        state.status = 'loading';
      })
      .addCase(startRide.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.activeRide?.id === action.payload.id) {
          state.activeRide.status = action.payload.status;
        }
      })
      .addCase(startRide.rejected, state => {
        state.status = 'failed';
        state.error = 'Failed to start ride';
      })
      .addCase(pickupCustomer.pending, state => {
        state.status = 'loading';
      })
      .addCase(pickupCustomer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.activeRide?.id === action.payload.id) {
          state.activeRide.status = action.payload.status;
        }
      })
      .addCase(pickupCustomer.rejected, state => {
        state.status = 'failed';
        state.error = 'Failed to pick up customer';
      })
      .addCase(dropOffCustomer.pending, state => {
        state.status = 'loading';
      })
      .addCase(dropOffCustomer.fulfilled, state => {
        state.status = 'succeeded';
        state.activeRide = null;
      })
      .addCase(dropOffCustomer.rejected, state => {
        state.status = 'failed';
        state.error = 'Failed to drop off customer';
      });
  },
});

export const {clearCurrentRideRequest} = rideSlice.actions;

export default rideSlice.reducer;
