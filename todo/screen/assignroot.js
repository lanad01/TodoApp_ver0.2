import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
import AssignScreen_1st from './assignScreen_1st';
import AssignScreen_2nd from './assignScreen_2nd';

const AssignStack= createStackNavigator();
export const AssignRoot= () => {
  return(
    <AssignStack.Navigator>
      <AssignStack.Screen name="Assign1st" component={AssignScreen_1st} 
      options={{ headerTitle: "Assign", headerTitleStyle : { fontFamily:"BMJUA" } ,
      headerStyle : { backgroundColor : '#E0FFFF' } }} />
      <AssignStack.Screen name="Assign2nd" component={AssignScreen_2nd} 
      options={{ headerTitleStyle : { fontFamily:"BMJUA" } , headerTitle:"Profile Image", animationTypeForReplace:"push" ,
      headerStyle : { backgroundColor : '#E0FFFF' } }} />
    </AssignStack.Navigator>
  )
}