import React, {useState, useEffect, useRef} from 'react';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {GeolocationResponse} from '@react-native-community/geolocation/js/NativeRNCGeolocation.ts';
import {Ride} from '../types/rideTypes.ts';
import {getUserLocation} from '../utils/location.ts';
import {COLORS} from '../constants/colors.ts';
import {Image, TouchableOpacity} from 'react-native';
import {IMAGES} from '../constants/images.ts';
import {getDistance} from 'geolib';
import {scale} from '../constants/size.ts';
import RideRequestMarker from './RIdeRequestMarker.tsx';
import RideDirections from './RideDirections.tsx';
import AddressCard from './AddressCard.tsx';

interface MapProps {
  markerData?: Ride[];
  onMarkerPress?: (ride: Ride) => void;
  onMapPress?: () => void;
  selectedRide?: Ride | null;
  activeRide?: Ride | null;
}

const Map: React.FC<MapProps> = ({
  markerData,
  onMarkerPress,
  onMapPress,
  selectedRide,
  activeRide,
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
      onMarkerPress(ride);
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
    }
  };

  return (
    <>
      {userLocation && (
        <MapView
          ref={mapRef}
          style={{flex: 1}}
          showsUserLocation
          showsMyLocationButton
          initialRegion={{
            latitude: userLocation.coords.latitude,
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
              <RideRequestMarker
                key={ride.id}
                coordinate={ride.pickupLocation} // Pass the pickupLocation coordinates
                onPress={() => handleMarkerPress(ride)}
              />
            ))}

          {markerData && selectedRide && !activeRide && (
            <>
              <RideRequestMarker coordinate={selectedRide.pickupLocation} />
              <RideRequestMarker
                coordinate={selectedRide.destination}
                isActive
              />
              <RideDirections
                origin={{
                  latitude: selectedRide.pickupLocation.latitude,
                  longitude: selectedRide.pickupLocation.longitude,
                }}
                destination={{
                  latitude: selectedRide.destination.latitude,
                  longitude: selectedRide.destination.longitude,
                }}
                apikey={process.env.GOOGLE_MAPS_API_KEY || ''}
                color={COLORS.darkPurple}
              />
              <RideDirections
                origin={{
                  latitude: userLocation.coords.latitude,
                  longitude: userLocation.coords.longitude,
                }}
                destination={{
                  latitude: selectedRide.pickupLocation.latitude,
                  longitude: selectedRide.pickupLocation.longitude,
                }}
                apikey={process.env.GOOGLE_MAPS_API_KEY || ''}
                color={COLORS.purple}
              />
            </>
          )}

          {markerData && activeRide && (
            <>
              <RideRequestMarker
                coordinate={activeRide.pickupLocation}
                onPress={() => handleMarkerPress(activeRide)}
              />
              <RideRequestMarker
                coordinate={activeRide.destination}
                onPress={() => handleMarkerPress(activeRide)}
                isActive
              />

              {activeRide.status === 'accepted' && (
                <>
                  <RideDirections
                    origin={{
                      latitude: userLocation.coords.latitude,
                      longitude: userLocation.coords.longitude,
                    }}
                    destination={{
                      latitude: activeRide.pickupLocation.latitude,
                      longitude: activeRide.pickupLocation.longitude,
                    }}
                    apikey={process.env.GOOGLE_MAPS_API_KEY || ''}
                    color={COLORS.purple}
                  />
                  <RideDirections
                    origin={{
                      latitude: activeRide.pickupLocation.latitude,
                      longitude: activeRide.pickupLocation.longitude,
                    }}
                    destination={{
                      latitude: activeRide.destination.latitude,
                      longitude: activeRide.destination.longitude,
                    }}
                    apikey={process.env.GOOGLE_MAPS_API_KEY || ''}
                    color={COLORS.darkPurple}
                  />
                </>
              )}
              {activeRide.status === 'started' && (
                <RideDirections
                  origin={{
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                  }}
                  destination={{
                    latitude: activeRide.pickupLocation.latitude,
                    longitude: activeRide.pickupLocation.longitude,
                  }}
                  apikey={process.env.GOOGLE_MAPS_API_KEY || ''}
                  color={COLORS.purple}
                />
              )}
              {activeRide.status === 'picked-up' && (
                <RideDirections
                  origin={{
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                  }}
                  destination={{
                    latitude: activeRide.destination.latitude,
                    longitude: activeRide.destination.longitude,
                  }}
                  apikey={process.env.GOOGLE_MAPS_API_KEY || ''}
                  color={COLORS.darkPurple}
                />
              )}
            </>
          )}
        </MapView>
      )}

      {/*Address Location Card*/}
      {markerData && (
        <AddressCard
          ride={selectedRide || activeRide}
          onMarkerPress={handleMarkerPress}
          rideRequest={markerData.length}
        />
      )}

      {/*user location button*/}
      <TouchableOpacity
        style={{
          bottom: '18%',
          right: 20,
          position: 'absolute',
          backgroundColor: COLORS.white,
          padding: scale(5),
          borderRadius: scale(100),
        }}
        onPress={() => {
          if (mapRef.current && userLocation) {
            mapRef.current.animateToRegion({
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
              latitudeDelta: 0.004,
              longitudeDelta: 0.016,
            });
          }
        }}>
        <Image
          source={IMAGES.userLocationPin}
          style={{width: 40, height: 40}}
        />
      </TouchableOpacity>
    </>
  );
};

export default Map;
