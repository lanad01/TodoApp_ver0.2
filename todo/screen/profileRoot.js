import { createStackNavigator } from '@react-navigation/stack';
import React, { } from 'react';
import { StyleSheet } from 'react-native';
import ProfileEdit from './profileEdit';
import { ProfileMain } from './profileMain';
import { ProfileResetPwd } from './profileResetPwd';
import { DPW } from '../dp';

export const ProfileRoot = () => {
  const ProfileStack = createStackNavigator();
  return (
    <ProfileStack.Navigator initialRouteName="ProfileMain">
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileMain}
        options={{headerShown: false,}}
      />
      <ProfileStack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{headerShown: false,}}
      />
      <ProfileStack.Screen
        name="ProfileResetPwd"
        component={ProfileResetPwd}
        options={{headerShown: false,}}
      />
    </ProfileStack.Navigator>
  );
};
const styles = StyleSheet.create({
  logoutBtn: {
    fontFamily: 'BMJUA',
    fontSize: 36 *DPW ,
    color: 'white',
  },
  btnView: {
    backgroundColor: '#191970',
    width: 160 *DPW,
    height: 60 *DPW,
    justifyContent: 'center',
    alignItems: 'center',
    right: 20 *DPW,
  },
});
