import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Assign_1st_data from '../screen/assign/data/assign_1st_data';
import Assign_2nd_data from '../screen/assign/data/assign_2nd_data';

const AssignStack= createStackNavigator();
export const AssignRoot= () => {
  return(
    <AssignStack.Navigator>
      <AssignStack.Screen name="Assign1st" component={Assign_1st_data} 
      options={{ headerTitle: "Assign", headerTitleStyle : { fontFamily:"BMJUA" } ,
      headerStyle : { backgroundColor : '#E0FFFF' } }} />
      <AssignStack.Screen name="Assign2nd" component={Assign_2nd_data} 
      options={{ headerTitleStyle : { fontFamily:"BMJUA" } , headerTitle:"Profile Image", animationTypeForReplace:"push" ,
      headerStyle : { backgroundColor : '#E0FFFF' } }} />
    </AssignStack.Navigator>
  )
}