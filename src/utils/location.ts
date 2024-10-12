import {GeolocationResponse} from '@react-native-community/geolocation/js/NativeRNCGeolocation.ts';
import {Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const getUserLocation =
  async (): Promise<GeolocationResponse | null> => {
    const platformPermissions =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    try {
      let permissionStatus = await check(platformPermissions);

      if (permissionStatus !== RESULTS.GRANTED) {
        permissionStatus = await request(platformPermissions);
      }

      if (permissionStatus === RESULTS.GRANTED) {
        console.log('Location permission granted');
        return new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(error),
            {
              enableHighAccuracy: true,
              timeout: 20000,
              maximumAge: 1000,
            },
          );
        });
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }

    return null;
  };
