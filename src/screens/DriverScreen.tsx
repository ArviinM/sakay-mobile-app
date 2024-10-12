import React, {useEffect, useMemo, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Map from '../components/Map.tsx';
import {Ride} from '../types/rideTypes.ts';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../store/store.ts';
import {scale} from '../constants/size.ts';
import {COLORS} from '../constants/colors.ts';
import {toggleOnlineStatus} from '../store/slice/userSlice.ts';
import {
  clearCurrentRideRequest,
  fetchRideRequestCustomer,
  fetchRideRequests,
} from '../store/slice/rideSlice.ts';
import ProfileCard from '../components/ProfileCard.tsx';

const DriverScreen = () => {
  const userState = useSelector((state: RootState) => state.user);
  const rideState = useSelector((state: RootState) => state.ride);
  const selectedRide = useSelector(
    (state: RootState) => state.ride.currentRideRequest,
  );
  const dispatch = useAppDispatch();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const rideDetailsSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['16%'], []);

  const handleMarkerPress = (ride: Ride) => {
    dispatch(fetchRideRequestCustomer(ride));
    // You can add any other logic here, like closing the bottom sheet
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  const handleMapPress = () => {
    rideDetailsSheetRef.current?.close();
    setTimeout(() => {
      dispatch(clearCurrentRideRequest());
    }, 300);
  };

  useEffect(() => {
    dispatch(fetchRideRequests()); // Fetch ride requests on component mount
  }, [dispatch]);

  useEffect(() => {
    if (selectedRide) {
      bottomSheetRef.current?.close();
      setTimeout(() => {
        rideDetailsSheetRef.current?.expand();
      }, 300);
    } else {
      rideDetailsSheetRef.current?.close();
      setTimeout(() => {
        bottomSheetRef.current?.expand();
      }, 300);
    }
  }, [selectedRide]);

  return (
    <SafeAreaView style={{flex: 1}} edges={[]}>
      <View style={styles.container}>
        {rideState.rideRequests && (
          <Map
            markerData={
              userState.isOnline
                ? (rideState.rideRequests as Ride[])
                : undefined
            }
            onMarkerPress={handleMarkerPress}
            onMapPress={handleMapPress}
            selectedRide={selectedRide}
          />
        )}
        {userState && (
          <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} index={0}>
            {!userState.isOnline && (
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Lufga-Medium',
                    fontSize: scale(10),
                    color: COLORS.darkPurple,
                  }}>
                  You are offline! Press "Let's go!" to start accepting ride
                  requests.
                </Text>
              </View>
            )}
            <BottomSheetView style={styles.bottomSheetContent}>
              {userState.userData && (
                <ProfileCard
                  profilePicture={userState.userData.profilePicture}
                  name={userState.userData.name}
                  earnings={userState.userData.earnings}
                  review={userState.userData.review}
                />
              )}
              <View>
                <TouchableOpacity
                  style={{
                    width: scale(60),
                    height: scale(60),
                    backgroundColor: userState.isOnline
                      ? COLORS.gray
                      : COLORS.green,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: scale(10),
                    borderRadius: 200,
                  }}
                  onPress={() => dispatch(toggleOnlineStatus())}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Lufga-Bold',
                      fontSize: scale(10),
                      color: COLORS.darkPurple,
                    }}>
                    {userState.isOnline ? 'Break' : " Let's Go!"}
                  </Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </BottomSheet>
        )}

        {selectedRide && (
          <BottomSheet
            ref={rideDetailsSheetRef}
            snapPoints={snapPoints}
            index={-1}>
            {selectedRide.customer && (
              <BottomSheetView style={styles.bottomSheetContent}>
                {selectedRide.customer && (
                  <ProfileCard
                    profilePicture={selectedRide.customer.profilePicture}
                    name={selectedRide.customer.name}
                  />
                )}
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{
                      width: scale(60),
                      height: scale(60),
                      backgroundColor: COLORS.gray,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: scale(10),
                      borderRadius: 200,
                    }}
                    onPress={() => dispatch(toggleOnlineStatus())}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: 'Lufga-Bold',
                        fontSize: scale(10),
                        color: COLORS.darkPurple,
                      }}>
                      Decline
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: scale(60),
                      height: scale(60),
                      backgroundColor: COLORS.green,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: scale(10),
                      borderRadius: 200,
                    }}
                    onPress={() => dispatch(toggleOnlineStatus())}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: 'Lufga-Bold',
                        fontSize: scale(10),
                        color: COLORS.darkPurple,
                      }}>
                      Accept
                    </Text>
                  </TouchableOpacity>
                </View>
              </BottomSheetView>
            )}
          </BottomSheet>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default DriverScreen;
