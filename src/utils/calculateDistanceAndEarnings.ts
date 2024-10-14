import {getDistance} from 'geolib';
import {Ride} from '../types/rideTypes.ts';

export const calculateDistanceAndEarnings = (
  ride: Ride,
): {distance: number; earnings: number} => {
  const pickupLocation = {
    latitude: ride.pickupLocation.latitude,
    longitude: ride.pickupLocation.longitude,
  };
  const destinationLocation = {
    latitude: ride.destination.latitude,
    longitude: ride.destination.longitude,
  };

  // Calculate distance in kilometers
  const distanceInMeters = getDistance(pickupLocation, destinationLocation);
  const distanceInKm = distanceInMeters / 1000;

  // Example earnings calculation (replace with your actual logic)
  const baseFare = 50; // Example base fare
  const pricePerKm = 15; // Example price per kilometer
  const earnings = baseFare + distanceInKm * pricePerKm;

  return {distance: distanceInKm, earnings};
};
