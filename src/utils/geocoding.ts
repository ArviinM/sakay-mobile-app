export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<string> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
        process.env.GOOGLE_MAPS_API_KEY || ''
      }`,
    );
    const data = await response.json();
    if (data.results[0]) {
      return data.results[0].formatted_address;
    }
  } catch (error) {
    console.error('Error getting address:', error);
  }
  return ''; // Return an empty string if there's an error or no address found
};
