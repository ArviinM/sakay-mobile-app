import React from 'react';
import {Marker} from 'react-native-maps';
import {Ride} from '../types/rideTypes';
import {IMAGES} from '../constants/images';

interface RideRequestMarkerProps {
  coordinate: {latitude: number; longitude: number}; // Changed to coordinate prop
  onPress?: () => void;
  isActive?: boolean;
}

const RideRequestMarker: React.FC<RideRequestMarkerProps> = ({
  coordinate,
  onPress,
  isActive,
}) => (
  <Marker
    coordinate={coordinate} // Use the coordinate prop directly
    image={isActive ? IMAGES.locationPin : IMAGES.locationPinRequest}
    onPress={onPress}
  />
);

export default RideRequestMarker;
