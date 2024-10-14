import React from 'react';
import {Marker} from 'react-native-maps';
import {IMAGES} from '../constants/images';

interface RideRequestMarkerProps {
  coordinate: {latitude: number; longitude: number};
  onPress?: () => void;
  isActive?: boolean;
}

const RideRequestMarker: React.FC<RideRequestMarkerProps> = ({
  coordinate,
  onPress,
  isActive,
}) => (
  <Marker
    coordinate={coordinate}
    image={isActive ? IMAGES.locationPin : IMAGES.locationPinRequest}
    onPress={onPress}
  />
);

export default RideRequestMarker;
