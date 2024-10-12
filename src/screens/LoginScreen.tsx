import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {TouchableOpacity, Text, View, Image} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootState, useAppDispatch} from '../store/store.ts';
import {IMAGES} from '../constants/images.ts';
import {scale} from '../constants/size.ts';
import {COLORS} from '../constants/colors.ts';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationParams} from '../constants/navigator.ts';
import {StackNavigationProp} from '@react-navigation/stack';
import {fetchUserById} from '../store/slice/userSlice.ts';

const LoginScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigationParams>>();
  const userState = useSelector((state: RootState) => state.user);

  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const handleLoginAsDriver = async (userId: string) => {
    dispatch(fetchUserById(userId));
    navigation.navigate('DriverScreen');
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: COLORS.white}}
      edges={['top', 'bottom', 'left', 'right']}>
      <Image source={IMAGES.welcomeImage} style={{marginTop: scale(30)}} />
      <View
        style={{
          position: 'absolute',
          bottom: insets.bottom,
          left: 0,
          right: 0,
          // borderWidth: 1,
          paddingHorizontal: scale(10),
        }}>
        <Text
          style={{
            fontFamily: 'Lufga-SemiBold',
            fontSize: scale(32),
            textAlign: 'center',
            color: COLORS.darkPurple,
          }}>
          Welcome to Sakay
        </Text>
        <Text
          style={{
            fontFamily: 'Lufga-MediumItalic',
            fontSize: scale(14),
            textAlign: 'center',
            marginTop: scale(-8),
            color: COLORS.darkPurple,
          }}>
          Your ride, your way
        </Text>
        <Text
          style={{
            fontFamily: 'Lufga-Light',
            fontSize: scale(10),
            textAlign: 'center',
            color: COLORS.darkPurple,
          }}>
          Current State: {userState?.userData?.role || 'null'} {'\n'}
          Current Name: {userState?.userData?.name || 'null'} {'\n'}
          Current ID: {userState?.userData?.id || 'null'}
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: scale(20),
            gap: scale(10),
          }}>
          {/*<TouchableOpacity*/}
          {/*  onPress={handleLoginAsCustomer}*/}
          {/*  style={{*/}
          {/*    backgroundColor: COLORS.white,*/}
          {/*    borderRadius: 30,*/}
          {/*    borderColor: 'rgba(0,0,0,0.47)',*/}
          {/*    borderWidth: 1,*/}
          {/*    width: '90%',*/}
          {/*    paddingVertical: scale(14),*/}
          {/*  }}>*/}
          {/*  <Text*/}
          {/*    style={{*/}
          {/*      fontFamily: 'Lufga-Regular',*/}
          {/*      fontSize: scale(16),*/}
          {/*      textAlign: 'center',*/}
          {/*      color: COLORS.darkPurple,*/}
          {/*    }}>*/}
          {/*    Login as Customer*/}
          {/*  </Text>*/}
          {/*</TouchableOpacity>*/}
          <TouchableOpacity
            onPress={() => handleLoginAsDriver('501')}
            style={{
              width: '90%',
              paddingVertical: scale(14),
              borderRadius: 30,
              backgroundColor: COLORS.darkPurple,
            }}>
            <Text
              style={{
                fontFamily: 'Lufga-Regular',
                fontSize: scale(16),
                textAlign: 'center',
                color: COLORS.white,
              }}>
              Login as Driver
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
