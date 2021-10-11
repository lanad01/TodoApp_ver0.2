import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  getProfile as getKakaoProfile,
  login as kakaoLogin,
} from '@react-native-seoul/kakao-login';

import { AuthContext } from '../context/authcontext';
import {  GOOGLE_LOGIN,  KAKAO_LOGIN, } from '../sqliteConnection';
import { LoginErrorModal } from '../modal/loginErrorModal';
import { IdPwdNotNullModal } from '../modal/IdPwdNotNullModal';
import { ErrorModal } from '../modal/ErrorModal';
import { DB } from '../sqliteConnection';
import { styles } from './styles/authScreenStyle';


export const authScreen = ({ navigation }) => {
  const authContext = React.useContext(AuthContext);
  const [loginErrorModal, setLoginErrorModal] = useState(false); //로그인 아이디 비밀번호 비일치 시
  const [loginNotNullModal, setLoginNotNullModal] = useState(false); //로그인 아이디 비밀번호 null발생 시
  const [pwdErrorModal, setPwdErrorModal] = useState(false); //비밀번호만 오류일 시

  const [id, setId] = useState('Aldne');
  const [pwd, setPwd] = useState('121212');

  useEffect(() => {
    autoLogin();
    return () => {};
  }, []);

  //자동 로그인
  autoLogin = async () => {
    try {
      const user_no = await AsyncStorage.getItem('user_no');
      // console.log("userNo : "+user_no)
      if (user_no != null) {
        console.log('AuthScreen / AutoLogin / Async Value :' + user_no);
        getInfoWhenAutoLogin(user_no);
      } else {
        console.log('AuthScreen / AutoLogin : Async Null Login Required');
      }
    } catch (error) { console.log("AuthScreen / AutoLogin : GetAsync Failed"+error)}
  };
  //자동로그인 종료

  const getInfoWhenAutoLogin = user_no => {
    DB.transaction(tx => {
      tx.executeSql(
        'SELECT id, pwd, name, email, job, regi_date, image, user_no FROM user_info WHERE user_no=?',
        // select all 조심 , 컬럼명 명시 권장
        [user_no],
        (tx, res) => {
          let selected = res.rows;
          // context 값 선언 방법 변경 권장 export
          authContext.id = selected.item(0).id;
          authContext.pwd = selected.item(0).pwd;
          authContext.name = selected.item(0).name;
          authContext.email = selected.item(0).email;
          authContext.job =  selected.item(0).job;
          authContext.regi_date = selected.item(0).regi_date;
          authContext.image = selected.item(0).image;;
          authContext.user_no = selected.item(0).user_no;
          authContext.autologin = true;
          AsyncStorage.setItem('user_no', user_no);
          navigation.replace('MainScreen');
        },error => {
          console.log("AuthScreen : Select userInfo from AutoLogin"+JSON.stringify(error))
        }
      );
    });
  };
  
  //일반 로그인 
  const login = () => {
    console.log('pwd : ' + pwd + ' id : ' + id);
    if (id === null || pwd === null) {
      // id pwd 널값
      setLoginNotNullModal(true);
    } else {
      DB.transaction(tx => {
        //
        tx.executeSql(
          'SELECT count(*) as count FROM user_info WHERE id=? AND pwd=? ', //select  반드시 count
          [id, pwd],
          (tx, res) => {
            let count = res.rows.item(0).count;
            console.log('Count ' + count);
            if (count > 0) {
              console.log('최종일치 ');
              getUser_no();
            } else if (count == 0) {
              console.log('pwd and inputpwd not matched');
              setPwdErrorModal(true);
            }
          },
          error => {
            console.log('AuthScreen / 일반 로그인 Failed : ' +JSON.stringify(error),
            );
          },
        );
      });
    }
  };
  const getUser_no = () => {
    DB.transaction(tx => {
      tx.executeSql(
        'SELECT id, pwd, name, email, job, regi_date, image, user_no FROM user_info WHERE id=?',
        [id],
        (tx, res) => {
          let selected = res.rows;
          let user_no = selected.item(0).user_no;
          AsyncStorage.setItem('user_no', JSON.stringify(user_no));
          // context 값 선언 방법 변경 권장 export
          authContext.id = selected.item(0).id;
          authContext.pwd = selected.item(0).pwd;
          authContext.name = selected.item(0).name;
          authContext.email = selected.item(0).email;
          authContext.job = selected.item(0).job;
          authContext.regi_date = selected.item(0).regi_date;
          authContext.image = selected.item(0).image;
          authContext.user_no = user_no;
          //로그인 완료 후 메인스크린으로 이동
          navigation.replace('MainScreen');
          // replace 새로운 스택route로 바꾸기 때문에 authScreen이 stack Index에 존재하지 않게 된다
        },
      );
    });
  };
  
  //googleLogin
  loginWithGoogle = async () => {
    GoogleSignin.configure({ }); //구글로그인 configure
    try {
      await GoogleSignin.hasPlayServices();
      const googleUserInfo = await GoogleSignin.signIn();
      let userIdFromGoogle = googleUserInfo.user.id;
      // 처음엔 구글아이디로 로그인하고 해당 id와 일치하는 것이 존재한다면
      // 그 아이디의 정보를 출력
      GOOGLE_LOGIN(googleUserInfo);
      // console.log(GET_USER_INFO_BY_GOOGLE_ID(googleUserInfo.user.email))
      await DB.transaction(tx => {
        tx.executeSql(
          'SELECT id, pwd, name, email, job, regi_date, image, user_no FROM user_info WHERE id=?',
          [userIdFromGoogle],
          (tx, res) => {
            console.log('GET USER INFO BY GG ID SUCCESS');
            console.log(res.rows.item(0).id);
            console.log(res.rows.item(0).email);
            console.log(res.rows.item(0).user_no);
            authContext.id = res.rows.item(0).id;
            authContext.pwd = res.rows.item(0).pwd;
            authContext.user_no = res.rows.item(0).user_no;
            AsyncStorage.setItem(
              'user_no',
              JSON.stringify(res.rows.item(0).user_no),
            );            
            authContext.name = res.rows.item(0).name;
            authContext.image = res.rows.item(0).image;
            authContext.email = res.rows.item(0).email;
            authContext.job = res.rows.item(0).job;
            authContext.regi_date = res.rows.item(0).regi_date;
            authContext.login_route = 'google';
            navigation.replace('MainScreen'); //replace로 login화면으로 돌아올 수 없도록 수정
          },
          error => {
            console.log('GET USER INFO BY GG ID FAILED');
          },
        );
      });
    } catch (err) {
      console.log(err);
    }
  };
  //카카오 로그인
  const loginWithKakao = async () => {
    try {
      const token = await kakaoLogin();
      // console.log('KAkao login result : ' + JSON.stringify(token));
      // console.log('TOKEN check at auth ' + token.accessToken);
      if (token != null) {
        // 카카오 로그인 성공
        console.log('카카오 토큰 생성');
        const userInfo = await getKakaoProfile();
        KAKAO_LOGIN(userInfo);
        let idFromKakao = userInfo.id;
        await DB.transaction(tx => {
          tx.executeSql(
            'SELECT id, pwd, name, email, job, regi_date, image, user_no FROM user_info WHERE id=?',
            [idFromKakao],
            (tx, res) => {
              console.log('카카오 아이디 조회 성공');
              console.log(res.rows.item(0).id);
              console.log(res.rows.item(0).email);
              console.log(res.rows.item(0).user_no);
              authContext.id = res.rows.item(0).id;
              authContext.pwd = res.rows.item(0).pwd;
              authContext.user_no = res.rows.item(0).user_no;
              AsyncStorage.setItem(
                'user_no',
                JSON.stringify(res.rows.item(0).user_no),
              );
              authContext.name = res.rows.item(0).name;
              authContext.image = res.rows.item(0).image;
              authContext.email = res.rows.item(0).email;
              authContext.job = res.rows.item(0).job;
              authContext.regi_date = res.rows.item(0).regi_date;
              authContext.login_route = 'kakao';
              navigation.replace('MainScreen'); //replace로 login화면으로 돌아올 수 없도록 수정
            },
            err => {
              console.log('Kakao login Select Userinfo Failed');
            },
          );
        });
      } else if (token == null) {
        console.log('Kakao Token Null');
      }
    } catch (err) {
      console.log('KaKao Login Error' + err);
    }
  };
  return (
    <SafeAreaView
      style={{
        flex:1,
        backgroundColor: '#191970',
        alignItems: 'center',
      }}>
      <Text style={styles.headerText}> TO DO LIST</Text>
      <View style={styles.bodyContainer}>
        <TextInput
          style={styles.idInput}
          onChangeText={id => setId(id)}
          placeholder="아이디 입력해주세요."
          placeholderTextColor="#191970"
          maxLength={22}
        />
        <TextInput
          style={styles.pwdInput}
          onChangeText={pwd => setPwd(pwd)}
          secureTextEntry={true}
          placeholder="비밀번호를 입력해주세요"
          placeholderTextColor="#191970"
          maxLength={22}
        />
        <TouchableOpacity onPress={login} style={styles.loginBtnContainer}>
          <Text style={styles.loginBtn}> 로 그 인 </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.push('Assign')}
          style={styles.loginBtnContainer}>
          <Text style={styles.loginBtn}> 회 원 가 입</Text>
        </TouchableOpacity>
        <Text style={styles.showText}></Text>
        <Text style={styles.showText}></Text>
        <GoogleSigninButton
          onPress={loginWithGoogle}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          style={{ width: 260, height: 45, marginRight: 5 }}
        />
        <TouchableWithoutFeedback onPress={loginWithKakao}>
          <Image
            source={require('../assets/kakao_login_medium_wide.png')}
            style={{
              width: 260,
              height: 40,
              marginTop: 10,
              resizeMode: 'contain',
            }}
          />
        </TouchableWithoutFeedback>
      </View>
      <IdPwdNotNullModal
        modalOn={loginNotNullModal}
        modalOff={() => setLoginErrorModal(false)}
      />
      <LoginErrorModal
        modalOn={loginErrorModal}
        modalOff={() => setLoginErrorModal(false)}
      />
      <ErrorModal
        modalOn={pwdErrorModal}
        modalOff={() => setPwdErrorModal(false)}
        message="아이디 혹은 비밀번호가 일치하지 않습니다."
      />
    </SafeAreaView>
  );
};
