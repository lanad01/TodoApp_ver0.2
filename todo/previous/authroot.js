import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { authScreen } from "../authScreen";

const authScreen_Opt = () =>  {
  return{
   headerTitle: "Sign In", headerTitleStyle : { fontFamily:"BMJUA" } ,
  headerStyle : { backgroundColor : '#E0FFFF'  }
  }
} 

const AuthStack = createStackNavigator();
export const AuthStackScreen = (  ) => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="SignIn" component={authScreen} options={authScreen_Opt} />
    </AuthStack.Navigator>
  )
};