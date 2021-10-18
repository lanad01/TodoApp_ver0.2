import React from 'react';
import {  View,  Text,  Image,  TouchableOpacity, ImageBackground,   } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { AuthContext } from '../../../../context/authcontext';
import { styles } from '../style/profileMainStyle';
import { HEIGHT } from '../../../../config/dp';

export const ProfileMain = props  => {
  const authContext = React.useContext(AuthContext);
  return (
    <GestureRecognizer
      style={{ height: HEIGHT }}
      onSwipe={(direction, state) => props.onSwipe(direction, state)}
      config={props.config}>
      <View style={styles.container}>
        <Text style={styles.headerText}>프 로 필</Text>
        <View style={styles.overlap}>
          <View style={styles.profileBox}>
            <Image
              source={
                authContext.image === null || authContext.image === undefined
                  ? require('../../../../assets/images/profile3.jpg')
                  : { uri: authContext.image }
              }
              style={styles.profileImage}
            />
            <Text style={styles.nameText}> {authContext.name} </Text>
            <Text style={styles.emailText}>
              {' '}
              {authContext.email === null
                ? authContext.emailNull
                : authContext.email}{' '}
            </Text>
            <TouchableOpacity onPress={props.goToEdit} style={styles.editBox}>
              <Text style={styles.editText}> 프로필 수정 </Text>
            </TouchableOpacity>
          </View>
          
        </View>
        
        <View style={styles.bottom}>
          <View style={styles.detailContainer}>
            <Text style={styles.detailCategory}> * Register Date </Text>
            <Text style={styles.detailContent}> - {authContext.regi_date} </Text>
          </View>
          <View style={styles.detailContainer2}>
            <Text style={styles.detailCategory}> * Job </Text>
            <Text style={styles.detailContent}> -
              {authContext.job === null
                ? authContext.jobNull
                : authContext.job}{' '}
            </Text>
          </View>
          <View style={styles.detailContainer2}>
            <Text style={styles.detailCategory}> * City </Text>
            <Text style={styles.detailContent}> - From DB </Text>
          </View>
        </View>
      </View>
      
    </GestureRecognizer>
  );
};
