import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {scale} from '../constants/size';
import {COLORS} from '../constants/colors';

interface ProfileCardProps {
  name: string;
  review?: number;
  earnings?: number;
  profilePicture: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  review,
  earnings,
  profilePicture,
}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Image
        source={{uri: profilePicture}}
        height={scale(60)}
        width={scale(60)}
        style={{borderRadius: 100}}
      />
      <View
        style={{
          justifyContent: 'center',
          paddingHorizontal: scale(10),
        }}>
        {name && (
          <Text
            style={{
              fontFamily: 'Lufga-Bold',
              fontSize: scale(15),
              color: COLORS.darkPurple,
            }}>
            {name}
          </Text>
        )}
        {review && (
          <Text
            style={{
              fontFamily: 'Lufga-Bold',
              fontSize: scale(13),
              color: COLORS.purple,
            }}>
            {review}{' '}
            <Text
              style={{
                fontFamily: 'Lufga-Light',
                fontSize: scale(12),
                color: COLORS.darkPurple,
              }}>
              reviews
            </Text>
          </Text>
        )}
        {earnings && (
          <Text
            style={{
              fontFamily: 'Lufga-Bold',
              fontSize: scale(13),
              color: COLORS.purple,
            }}>
            ${earnings}{' '}
            <Text
              style={{
                fontFamily: 'Lufga-Light',
                fontSize: scale(12),
                color: COLORS.darkPurple,
              }}>
              earned
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ProfileCard;
