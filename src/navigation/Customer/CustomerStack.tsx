import React from 'react';
import {Stack} from '../../constants/navigator.ts';
import CustomerScreen from '../../screens/CustomerScreen.tsx';

const CustomerStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="CustomerHome"
        component={CustomerScreen}
        options={{gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
};

export default CustomerStack;
