import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Ride} from '../../types/rideTypes.ts';

export const rideApi = createApi({
  reducerPath: 'rideApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000/'}), // Your JSON server base URL
  endpoints: builder => ({
    getRideRequests: builder.query<Ride[], void>({
      query: () => 'rideRequests',
    }),
  }),
});

export const {useGetRideRequestsQuery} = rideApi;
