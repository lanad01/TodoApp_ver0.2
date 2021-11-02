import React from 'react';
import {   } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {  GoogleSignin,  } from '@react-native-google-signin/google-signin';
import {
  getProfile as getKakaoProfile,
  login as kakaoLogin,
} from '@react-native-seoul/kakao-login';
import { AuthContext } from '../../context/authcontext';
import {
  SELECT_USER_INFO_BY_USERNO,
  LOGIN_VALIDATION,
  SELECT_USER_INFO_BY_ID,
  SOCIAL_LOGIN,
} from '../../sqliteConnection/userTableConnection';
import { AuthScreen } from './authScreen';
import { Loading } from '../../component/Loading';
import { View } from 'react-native';
GoogleSignin.configure({}); //구글로그인 configure

export const AuthDataHandle = ({navigation}) => {

    const authContext = React.useContext(AuthContext);
    const [loading, setLoading] = React.useState(false); //로딩화면은 딱히 안보내도 될 것 같다

    const [id, setId] = React.useState('')
    const [pwd, setPwd] = React.useState('')
    const [modalData, setModalData]=React.useState({
        loginNotNullModal : false, // 아이디 비밀번호 null발생 시
        loginUnmatchedModal : false,//비밀번호만 오류일 시
    })

    React.useEffect(() => {
      const subscribe = navigation.addListener('focus', () => {
        autoLogin(); // autologin값이 true일 경우 loading창 유지 => DB Access 완료 이후 로딩 종료
        // autologin값이 false일 경우 loading창 바로 종료 => Login 직접 시도 On
      });
      return subscribe;
    }, []);

    //자동 로그인
    autoLogin = async () => {
      try {
        const user_no = await AsyncStorage.getItem('user_no'); //Async user_no가 존재한다면 가져온다
        if (user_no != null) {
          //Async에 남아있는 user_no가 있는 경우
          console.log('AuthScreen / AutoLogin / Async Value :' + user_no);
          getInfoWhenAutoLogin(user_no);
        } else {
          console.log('AuthScreen / AutoLogin : Async Null  - Login Required');
        }
      } catch (error) {
        console.log(
          'AuthScreen / AutoLogin : GetAsync Failed' + JSON.stringify(error),
        );
      }
    };
  
    //자동로그인 시 authContext에 저장하기 위한 user정보
    const getInfoWhenAutoLogin = async user_no => {
      try {
        const userInfo = await SELECT_USER_INFO_BY_USERNO(user_no);
        send_to_context(userInfo);
        authContext.autologin = true; //자동로그인이므로 autologin값 true
        // AsyncStorage.setItem('user_no', JSON.stringify(authContext.user_no)); - 이미 존재 필요없다
        navigation.replace('TabRoot');
      } catch (err) {
        console.log(
          'AuthScreen / 자동로그인 유저 data get Failed' + JSON.stringify(err),
        );
      }
    };
  
    //일반 로그인
    const login = async () => {
      try {
        if (id === null || pwd === null) {
          // id pwd가 Null일 경우
          setModalData({loginNotNullModal : true})
        } else {
          const dupCount = await LOGIN_VALIDATION(id, pwd); //result : 작성된 ID PWD와 일치하는 유저의 COUNT
          console.log('count ' + dupCount);
          if (dupCount > 0) {
            //최종일치한 유저가 존재한 경우
            console.log('최종일치 유저 수 : ' + dupCount);
            getUser_no();
          } else if (dupCount == 0) {
            // 최종일치 Failed = VALIDATION FAILED
            console.log('AuthScreen / pwd and inputpwd not matched');
            setModalData({loginUnmatchedModal : true})
          }
        }
      } catch (err) {
        console.log('일반 로그인 오류 ' + err);
      }
    };
  
    //일반 로그인 성공 시 context에 담을 user 정보 get
    const getUser_no = async () => {
      setLoading(true);
      const userInfo = await SELECT_USER_INFO_BY_ID(id);
      AsyncStorage.setItem('user_no', JSON.stringify(userInfo.user_no)); // 자동로그인이 아니므로 필요
      send_to_context(userInfo);
      authContext.autologin = false;
      setLoading(false);
      navigation.replace('TabRoot');
      // replace 새로운 스택route로 바꾸기 때문에 authScreen이 stack Index에 존재하지 않게 된다
    };
  
    //소셜 로그인
    const socialLogin = async type => {
      console.log('Socail Type  : ' + type);
      let social_id = ''; // id 중복 체크 및 SELECT인자
      if (type == 'kakao') {
        try {
          const token = await kakaoLogin();
          if (token != null) {
            // 카카오 로그인 성공
            const kakao_userInfo = await getKakaoProfile();
            SOCIAL_LOGIN(kakao_userInfo, 'kakao');
            social_id = kakao_userInfo.id;
          }
        } catch (err) {
          console.log('Kakao login failed' + JSON.stringify(err));
        }
      } else if ((type = 'google')) {
        try {
          await GoogleSignin.hasPlayServices();
          const google_userInfo = await GoogleSignin.signIn(); //선택한 구글 아이디의 정보 객체
          if (google_userInfo.user.id != null) {
            SOCIAL_LOGIN(google_userInfo, 'google');
            social_id = google_userInfo.user.id;
          }
        } catch (err) {
          console.log('Google login failed ' + JSON.stringify(err));
        }
      }
      let social_login_user_info = {};
      setTimeout(async () => {
        social_login_user_info = await SELECT_USER_INFO_BY_ID(social_id);
        send_to_context(social_login_user_info);
        AsyncStorage.setItem(
          'user_no',
          JSON.stringify(social_login_user_info.user_no),
        ); // 필요
        // context 값 선언 방법 변경 권장 export
        authContext.autologin = false;
        authContext.login_route = type; // 구글로그인 루트 설정
        navigation.replace('TabRoot');
      }, 1000);
      
    };
  
    //DB에서 얻어온 userInfo를 context에 저장
    const send_to_context = userInfo => {
      authContext.user_no = userInfo.user_no;
      authContext.id = userInfo.id;
      authContext.pwd = userInfo.pwd;
      authContext.name = userInfo.name;
      authContext.email = userInfo.email;
      authContext.job = userInfo.job;
      authContext.regi_date = userInfo.regi_date;
      authContext.image = userInfo.image;
    };
    return (
      <View style={{flex:1}}>
        <AuthScreen
            setId={e=> setId(e)}
            setPwd={e=>setPwd(e)}
            setModalData={(e)=> setModalData(e)}
            modalData={modalData}
            socialLogin={type => socialLogin(type)}
            login={login}
            assign={() => navigation.push('AssignRoot')}
        />
        <Loading modalOn={loading} modalOff={ () => setLoading(false)}/>
        </View>

        


    )
}