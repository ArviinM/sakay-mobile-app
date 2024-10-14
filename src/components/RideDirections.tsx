import React from 'react';
import MapViewDirections from 'react-native-maps-directions';
import {COLORS} from '../constants/colors';

interface RideDirectionsProps {
  origin: {latitude: number; longitude: number};
  destination: {latitude: number; longitude: number};
  apikey: string;
}

const RideDirections: React.FC<RideDirectionsProps> = ({
  origin,
  destination,
  apikey,
}) => (
  <MapViewDirections
    origin={origin}
    destination={destination}
    apikey={apikey}
    strokeWidth={6}
    strokeColor={COLORS.darkPurple}
  />
);

export default RideDirections;
