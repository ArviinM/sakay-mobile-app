import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNavigationContainerRef} from '@react-navigation/native';

export const Stack = createStackNavigator();
export const Tab = createBottomTabNavigator();

export const navigationRef =
  createNavigationContainerRef<RootNavigationParams>();

export function navigate<RouteName extends keyof RootNavigationParams>(
  name: RouteName,
  params?: RootNavigationParams[RouteName],
) {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.navigate(name, params);
  }
}

export type RootNavigationParams = {
  LoginScreen: undefined;
  CustomerStack: undefined;
  DriverTab: undefined;
};
