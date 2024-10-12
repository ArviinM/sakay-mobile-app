import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import {navigationRef, Stack} from '../constants/navigator.ts';
import LoginScreen from '../screens/LoginScreen.tsx';
import CustomerStack from './Customer/CustomerStack.tsx';
import DriverScreen from '../screens/DriverScreen.tsx';

const RootNavigation = () => {
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={async () => {
        await BootSplash.hide({fade: true});
      }}>
      <Stack.Navigator>
        <Stack.Screen
          name={'Login'}
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'CustomerStack'}
          component={CustomerStack}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'DriverScreen'}
          component={DriverScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
