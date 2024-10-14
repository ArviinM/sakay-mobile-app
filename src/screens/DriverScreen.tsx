import React, {useEffect, useMemo, useRef} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Map from '../components/Map.tsx';
import {Ride} from '../types/rideTypes.ts';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {useSelector} from 'react-redux';
import {RootState, useAppDispatch} from '../store/store.ts';
import {scale} from '../constants/size.ts';
import {COLORS} from '../constants/colors.ts';
import {toggleOnlineStatus} from '../store/slice/userSlice.ts';
import {
  acceptRideRequest,
  clearCurrentRideRequest,
  declineRideRequest,
  dropOffCustomer,
  fetchRideRequestCustomer,
  fetchRideRequests,
  pickupCustomer,
  startRide,
} from '../store/slice/rideSlice.ts';
import ProfileCard from '../components/ProfileCard.tsx';
import Toast from 'react-native-toast-message';
import RideRequestBottomSheet from '../components/RideRequestBottomSheet.tsx';

const DriverScreen = () => {
  const userState = useSelector((state: RootState) => state.user);
  const rideState = useSelector((state: RootState) => state.ride);
  const selectedRide = useSelector(
    (state: RootState) => state.ride.currentRideRequest,
  );
  const activeRide = useSelector((state: RootState) => state.ride.activeRide);

  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const rideDetailsSheetRef = useRef<BottomSheet>(null);
  const activeRideDetailsSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['16%'], []);

  const handleMarkerPress = (ride: Ride) => {
    try {
      dispatch(fetchRideRequestCustomer(ride));
      // You can add any other logic here, like closing the bottom sheet
      if (bottomSheetRef.current) {
        bottomSheetRef.current.close();
      }
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: e.message,
        topOffset: insets.top,
      });
      console.error(e);
    }
  };

  const handleMapPress = () => {
    rideDetailsSheetRef.current?.close();
    setTimeout(() => {
      dispatch(clearCurrentRideRequest());
    }, 300);
  };

  const handleRide = async (
    status:
      | 'pending'
      | 'accepted'
      | 'declined'
      | 'started'
      | 'picked-up'
      | 'dropped-off',
  ) => {
    try {
      if (selectedRide) {
        if (status === 'accepted') {
          await dispatch(acceptRideRequest(selectedRide.id));
          Toast.show({
            type: 'info',
            text1: "That's a go. ",
            text2: "Let's go pick-up the customer!",
            topOffset: insets.top,
          });
        }

        if (status === 'started') {
          await dispatch(startRide(selectedRide.id));
          Toast.show({
            type: 'info',
            text1: 'Ride started!',
            topOffset: insets.top,
          });
        }

        if (status === 'picked-up') {
          await dispatch(pickupCustomer(selectedRide.id));

          Toast.show({
            type: 'info',
            text1: 'Customer picked up! ',
            text2: "Let's to their destination",
            topOffset: insets.top,
          });
        }

        if (status === 'dropped-off') {
          await dispatch(dropOffCustomer(selectedRide.id));
          dispatch(clearCurrentRideRequest());
          rideDetailsSheetRef.current?.close();

          Toast.show({
            type: 'info',
            text1: 'Customer dropped off!',
            text2: 'You can now accept new ride requests.',
            topOffset: insets.top,
          });
        }

        if (status === 'declined') {
          await dispatch(declineRideRequest(selectedRide.id));
          dispatch(clearCurrentRideRequest());
          rideDetailsSheetRef.current?.close();

          Toast.show({
            type: 'info',
            text1: "That ride's a no-go. Keep searching!",
            topOffset: insets.top,
          });
        }
      }
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: e.message,
        topOffset: insets.top,
      });
      console.error(e);
    }
  };

  useEffect(() => {
    if (selectedRide) {
      bottomSheetRef.current?.close();
      activeRideDetailsSheetRef.current?.close();
      setTimeout(() => {
        rideDetailsSheetRef.current?.expand();
      }, 300);
    }
    if (activeRide) {
      bottomSheetRef.current?.close();
      rideDetailsSheetRef.current?.close();
      setTimeout(() => {
        activeRideDetailsSheetRef.current?.expand();
      }, 300);
    } else {
      rideDetailsSheetRef.current?.close();
      activeRideDetailsSheetRef.current?.close();
      setTimeout(() => {
        bottomSheetRef.current?.expand();
      }, 300);
    }
  }, [activeRide, selectedRide]);

  if (rideState.status === 'failed') {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {rideState.error}</Text>
          <TouchableOpacity
            onPress={() => dispatch(fetchRideRequests())}
            style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            activeRide={activeRide}
          />
        )}

        {rideState.status === 'loading' && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={COLORS.darkPurple} />
            </View>
          </View>
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
            <BottomSheetView
              style={[
                styles.bottomSheetContent,
                {
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ]}>
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
                  onPress={async () => {
                    dispatch(toggleOnlineStatus());

                    if (!userState.isOnline) {
                      dispatch(fetchRideRequests());
                    }
                  }}>
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
            <RideRequestBottomSheet
              ride={selectedRide}
              onRideAction={handleRide}
            />
          </BottomSheet>
        )}

        {activeRide && (
          <BottomSheet
            ref={activeRideDetailsSheetRef}
            snapPoints={snapPoints}
            index={-1}>
            <RideRequestBottomSheet
              ride={activeRide}
              onRideAction={handleRide}
            />
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
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingBox: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.darkPurple,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.darkPurple,
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    fontFamily: 'Lufga-Bold',
    color: 'white',
  },
});

export default DriverScreen;
