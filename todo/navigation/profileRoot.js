import { createStackNavigator } from '@react-navigation/stack';
import React, { } from 'react';
import { ProfileEdit_Data } from '../screen/tab/profile/data/profileEdit_data';
import { ProfileMain_Data } from '../screen/tab/profile/data/profileMain_data';
import { ProfileResetPwd_Data } from '../screen/tab/profile/data/profileResetPwd_data';
export const ProfileRoot = () => {
  const ProfileStack = createStackNavigator();
  return (
    <ProfileStack.Navigator initialRouteName="ProfileMain">
      
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileMain_Data}
        options={{headerShown: false,}}
      />
      <ProfileStack.Screen
        name="ProfileEdit"
        component={ProfileEdit_Data}
        options={{headerShown: false, animationTypeForReplace:'push'}}
      />
      <ProfileStack.Screen
        name="ProfileResetPwd"
        component={ProfileResetPwd_Data}
        options={{headerShown: false, animationTypeForReplace:'push'}}
      />
    </ProfileStack.Navigator>
  );
};
