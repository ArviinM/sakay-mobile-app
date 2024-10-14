import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {scale} from '../constants/size';
import {COLORS} from '../constants/colors';
import {Ride} from '../types/rideTypes';
import {format} from 'date-fns';
import {calculateDistanceAndEarnings} from '../utils/calculateDistanceAndEarnings';
import {IMAGES} from '../constants/images';

interface AddressCardProps {
  ride?: Ride | null;
  onMarkerPress?: (ride: Ride) => void;
  rideRequest?: number;
}

const AddressCard: React.FC<AddressCardProps> = ({
  ride,
  onMarkerPress,
  rideRequest,
}) => (
  <View
    style={{
      bottom: '18%',
      left: 20,
      position: 'absolute',
      backgroundColor: COLORS.white,
      padding: scale(10),
      borderRadius: scale(20),
      width: ride ? scale(260) : undefined,
    }}>
    {ride ? (
      <>
        <View style={{justifyContent: 'center', paddingRight: scale(50)}}>
          <Text
            style={{
              fontFamily: 'Lufga-Bold',
              fontSize: scale(14),
              color: COLORS.darkPurple,
            }}>
            Directions -{' '}
            {(() => {
              const {distance} = calculateDistanceAndEarnings(ride);
              return distance.toFixed(2);
            })()}{' '}
            km
          </Text>
        </View>
        <View
          style={{flexDirection: 'row', gap: scale(6), alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => onMarkerPress && onMarkerPress(ride)}>
            <Image
              source={IMAGES.locationPinRequest}
              style={{width: 40, height: 40}}
            />
          </TouchableOpacity>
          <View style={{justifyContent: 'center', paddingRight: scale(50)}}>
            <Text
              style={{
                fontFamily: 'Lufga-Medium',
                fontSize: scale(12),
                color: COLORS.darkPurple,
              }}>
              Pick Up - {format(new Date(ride.pickupTime), 'hh:mm aaa')}
            </Text>
            <Text
              style={{
                fontFamily: 'Lufga-Regular',
                fontSize: scale(10),
                color: COLORS.darkPurple,
              }}>
              {ride.pickupLocation.address}
            </Text>
          </View>
        </View>
        <View
          style={{flexDirection: 'row', gap: scale(6), alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => onMarkerPress && onMarkerPress(ride)}>
            <Image
              source={IMAGES.locationPin}
              style={{width: 40, height: 40}}
            />
          </TouchableOpacity>
          <View style={{justifyContent: 'center', paddingRight: scale(50)}}>
            <Text
              style={{
                fontFamily: 'Lufga-Medium',
                fontSize: scale(12),
                color: COLORS.darkPurple,
              }}>
              Destination
            </Text>
            <Text
              style={{
                fontFamily: 'Lufga-Regular',
                fontSize: scale(10),
                color: COLORS.darkPurple,
              }}>
              {ride.destination.address}
            </Text>
          </View>
        </View>
      </>
    ) : (
      <View style={{flexDirection: 'row', gap: scale(6), alignItems: 'center'}}>
        <Image
          source={IMAGES.locationPinRequest}
          style={{width: 40, height: 40}}
        />
        <View style={{justifyContent: 'center', paddingRight: scale(10)}}>
          <Text
            style={{
              fontFamily: 'Lufga-Medium',
              fontSize: scale(12),
              color: COLORS.darkPurple,
            }}>
            {rideRequest === 0
              ? 'No nearby ride request'
              : `There are ${rideRequest} ride request available!`}
          </Text>
        </View>
      </View>
    )}
  </View>
);

export default AddressCard;
