import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {scale} from '../constants/size';
import {COLORS} from '../constants/colors';
import {Ride} from '../types/rideTypes';
import ProfileCard from './ProfileCard';
import {calculateDistanceAndEarnings} from '../utils/calculateDistanceAndEarnings';
import {BottomSheetView} from '@gorhom/bottom-sheet';

interface RideRequestBottomSheetProps {
  ride: Ride;
  onRideAction: (status: Ride['status']) => void;
}

const RideRequestBottomSheet: React.FC<RideRequestBottomSheetProps> = ({
  ride,
  onRideAction,
}) => {
  const {earnings} = calculateDistanceAndEarnings(ride);

  return (
    <BottomSheetView style={styles.bottomSheetContent}>
      {ride.customer && (
        <>
          <ProfileCard
            name={ride.customer.name}
            profilePicture={ride?.customer.profilePicture}
            pay={earnings}
            timestamp={ride.timestamp}
          />

          <View style={{flexDirection: 'row', gap: scale(6)}}>
            {ride.status === 'pending' && (
              <TouchableOpacity
                style={[styles.button, {backgroundColor: COLORS.gray}]}
                onPress={() => onRideAction('declined')}>
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, {backgroundColor: COLORS.green}]}
              onPress={() =>
                onRideAction(
                  ride.status === 'pending'
                    ? 'accepted'
                    : ride.status === 'accepted'
                    ? 'started'
                    : ride.status === 'started'
                    ? 'picked-up'
                    : ride.status === 'picked-up'
                    ? 'dropped-off'
                    : 'accepted',
                )
              }>
              <Text style={styles.buttonText}>
                {ride.status === 'pending'
                  ? 'Accept'
                  : ride.status === 'accepted'
                  ? 'Start'
                  : ride.status === 'started'
                  ? 'Pick Up'
                  : ride.status === 'picked-up'
                  ? 'Drop Off'
                  : 'Accept'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: scale(60),
    height: scale(60),
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(10),
    borderRadius: 200,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'Lufga-Bold',
    fontSize: scale(10),
    color: COLORS.darkPurple,
  },
});

export default RideRequestBottomSheet;
