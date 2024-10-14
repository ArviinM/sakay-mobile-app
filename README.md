# Sakay App - Your ride, your way

This is a React Native application that simulates the driver side of a ride-hailing service. It allows drivers to view and accept ride requests, navigate to pickup and drop-off locations, and manage their ride status.

## Features

*   Map with ride request markers
*   Ride request details with customer information
*   Accepting and declining ride requests
*   Ride status updates (accepted, started, picked up, dropped off)
*   Directions to pickup and destination locations
*   Driver profile with online/offline status

## Technologies Used

*   React Native
*   Redux Toolkit
*   React Native Maps
*   React Native Maps Directions
*   Geolib
*   Date-fns
*   JSON Server (for mock API)

## Installation

1.  Clone the repository:
    ```bash
    git clone [invalid URL removed]
    ```

2.  Install dependencies:
    ```bash
    cd react-native-driver-app
    npm install
    ```

3.  Set up a Google Maps API key:
    *   Obtain an API key from the Google Cloud Console.
    *   Enable the "Maps SDK for Android/iOS", "Directions API", and "Geocoding API".
    *   Create an `.env` file in the project root and add your API key:
        ```
        GOOGLE_MAPS_API_KEY=YOUR_API_KEY
        ```

4.  Start the JSON server (for mock API data):
    ```bash
    npx json-server --watch db.json
    ```

5.  Run the app:
    ```bash
    npx react-native run-android
    ```
    or
    ```bash
    npx react-native run-ios
    ```

## Usage

1.  Log in with a driver ID (e.g., "501").
2.  View ride requests on the map.
3.  Click on a marker to see ride details.
4.  Accept or decline ride requests.
5.  Follow the directions to pick up and drop off customers.
6.  Manage your online/offline status.
