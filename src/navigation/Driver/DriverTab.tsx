import React from 'react';
import {Tab} from '../../constants/navigator.ts';
import DriverScreen from '../../screens/DriverScreen.tsx';

const DriverTab = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="DriverHome" component={DriverScreen} />
      <Tab.Screen name="DriverRequests" component={DriverScreen} />
    </Tab.Navigator>
  );
};

export default DriverTab;
