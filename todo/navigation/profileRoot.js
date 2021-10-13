import { createStackNavigator } from '@react-navigation/stack';
import React, { } from 'react';
import ProfileEdit from '../screen/tab/profile/view/profileEdit';
import { ProfileMain } from '../screen/tab/profile/view/profileMain';
import { ProfileResetPwd } from '../screen/tab/profile/view/profileResetPwd';
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
