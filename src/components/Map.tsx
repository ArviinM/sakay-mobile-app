import React, {useState, useEffect, useRef} from 'react';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {GeolocationResponse} from '@react-native-community/geolocation/js/NativeRNCGeolocation.ts';
import {Ride} from '../types/rideTypes.ts';
import {getUserLocation} from '../utils/location.ts';
import MapViewDirections from 'react-native-maps-directions';
import {COLORS} from '../constants/colors.ts';
import {View} from 'react-native';
import {IMAGES} from '../constants/images.ts';
import {getDistance} from 'geolib';

interface MapProps {
  markerData?: Ride[];
  onMarkerPress?: (ride: Ride) => void;
  onMapPress?: () => void;
  selectedRide?: Ride | null;
}

const Map: React.FC<MapProps> = ({
  markerData,
  onMarkerPress,
  onMapPress,
  selectedRide,
}) => {
  const [userLocation, setUserLocation] = useState<GeolocationResponse | null>(
    null,
  );
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    let watchId: number | null = null;
    const fetchLocation = async () => {
      try {
        const location = await getUserLocation();
        setUserLocation(location);
        watchId = Geolocation.watchPosition(
          position => {
            setUserLocation(position);
          },
          error => {
            console.error('Error watching location:', error);
          },
          {enableHighAccuracy: true, distanceFilter: 10}, // Update every 10 meters
        );
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };
    fetchLocation();
    // Cleanup on unmount
    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  useEffect(() => {
    if (markerData) {
      if (mapRef.current && userLocation && markerData.length > 0) {
        const userCoords = {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        };

        // Calculate distances and filter markers within 10km
        const markersWithinRadius = markerData.filter(ride => {
          const distance = getDistance(userCoords, ride.pickupLocation);
          return distance <= 10000; // 10000 meters = 10km
        });

        // Get coordinates for markers within radius and user's location
        const coordinates = markersWithinRadius.map(ride => ({
          latitude: ride.pickupLocation.latitude,
          longitude: ride.pickupLocation.longitude,
        }));
        coordinates.push(userCoords);

        // Fit to coordinates
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
          animated: true,
        });
      }
    }
  }, [userLocation, markerData]);

  const handleMarkerPress = (ride: Ride) => {
    if (onMarkerPress) {
      onMarkerPress(ride); // Call the onMarkerPress prop if it exists
    }
    if (mapRef.current && userLocation) {
      mapRef.current.fitToCoordinates(
        [
          {
            latitude: ride.pickupLocation.latitude,
            longitude: ride.pickupLocation.longitude,
          },
          {
            latitude: ride.destination.latitude,
            longitude: ride.destination.longitude,
          },
        ],
        {
          edgePadding: {top: 160, right: 160, bottom: 160, left: 160}, // Add some padding
          animated: true,
        },
      );
    }
  };

  return (
    <>
      {userLocation && (
        <MapView
          ref={mapRef}
          style={{flex: 1}}
          initialRegion={{
            latitude: userLocation.coords.latitude, // Example initial location
            longitude: userLocation.coords.longitude,
            latitudeDelta: 0.004,
            longitudeDelta: 0.016,
          }}
          onPress={e => {
            if (e.nativeEvent.action !== 'marker-press') {
              if (onMapPress) {
                onMapPress();
              }
            }
          }}>
          {markerData &&
            !selectedRide &&
            markerData.map(ride => (
              <Marker
                key={ride.id}
                coordinate={{
                  latitude: ride.pickupLocation.latitude,
                  longitude: ride.pickupLocation.longitude,
                }}
                image={IMAGES.locationPinRequest}
                onPress={() => handleMarkerPress(ride)} // Handle marker press
              />
            ))}

          {markerData && selectedRide && (
            <>
              <Marker
                coordinate={{
                  latitude: selectedRide.pickupLocation.latitude,
                  longitude: selectedRide.pickupLocation.longitude,
                }}
                image={IMAGES.locationPinRequest}
              />
              <Marker
                coordinate={{
                  latitude: selectedRide.destination.latitude,
                  longitude: selectedRide.destination.longitude,
                }}
                image={IMAGES.locationPin}
              />
              <MapViewDirections
                origin={{
                  latitude: selectedRide.pickupLocation.latitude,
                  longitude: selectedRide.pickupLocation.longitude,
                }}
                destination={{
                  latitude: selectedRide.destination.latitude,
                  longitude: selectedRide.destination.longitude,
                }}
                apikey={process.env.GOOGLE_MAPS_API_KEY || ''}
                strokeWidth={4}
                strokeColor={COLORS.darkPurple}
              />
            </>
          )}

          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
              }}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: COLORS.darkPurple,
                  borderRadius: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: COLORS.darkPurple,
                    borderRadius: 100,
                    opacity: 0.4,
                  }}
                />
              </View>
            </Marker>
          )}
        </MapView>
      )}
    </>
  );
};

export default Map;
