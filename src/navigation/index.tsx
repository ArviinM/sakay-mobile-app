import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import {navigationRef, Stack} from '../constants/navigator.ts';
import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LoginScreen from '../screens/LoginScreen.tsx';

const RootNavigation = () => {
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={async () => {
        await BootSplash.hide({fade: true});
      }}>
      <Stack.Navigator>
        <Stack.Screen
          name={'login'}
          component={LoginScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
