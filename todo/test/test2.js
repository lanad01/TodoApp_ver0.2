import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
  GoogleSignInOptions,
} from '@react-native-google-signin/google-signin';

import {
  KakaoOAuthToken,
  KakaoProfile,
  getProfile as getKakaoProfile,
  login,
  logout,
  unlink,
} from '@react-native-seoul/kakao-login';
import { login } from '@react-native-seoul/kakao-login'
GoogleSignin.configure({
});
export default function App() {
  const [userGoogleInfo, setUserGoogleInfo] = useState('');
  const [loaded, setLoaded] = useState(false);
  console.log(statusCodes);
  signIn = async () => {
    try{
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setLoaded(true);
      setUserGoogleInfo(userInfo);
      console.log( "ID TOken:"+userInfo.idToken)
    }catch(err){
      console.log(statusCodes);
      console.log(err);
    }
  };
  const logout = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        console.log('gets here'); // LOGS THIS
        await GoogleSignin.revokeAccess(); // GETS STUCK HERE
        console.log('passed revoke access'); // doesn't log this
        await GoogleSignin.signOut();
        console.log('passed signOut');
        setLoaded(false)
      }
    } catch (err) {
      console.log(err);
      amplitude.logEvent('Failed Google Logout', err);
    }
  }
  console.log(userGoogleInfo)
  return (
    <View>
      <GoogleSigninButton
        onPress={signIn}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        style={{ width: 300, height: 60 }}
      />
      {loaded ? (
        <View>
          <Text> 접속상태</Text>
        </View>
      ) : (
        <View>
          <Text> 미접속상태 </Text>
        </View>
      )}
      <TouchableOpacity onPress={logout} >
        <View>
          <Text style={{backgroundColor:'yellow', width:100, height:100}}>Logout</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={login} >
        <View>
          <Text style={{backgroundColor:'yellow', width:100, height:100, justifyContent: 'center', marginLeft:100, borderColor:'black', borderWidth:10}}>KKao login</Text>
        </View>
      </TouchableOpacity>
      
    </View>
  );
}
