import { StyleSheet } from "react-native";
import { DPW, WIDTH } from '../../../../config/dp';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#191970',
    },
    headerText: {
      fontFamily: 'BMJUA',
      fontSize: 60 * DPW ,
      color: 'white',
      marginTop: 40 * DPW,
      marginLeft:10 * DPW,
    },
    nameText: {
      fontFamily: 'BMJUA',
      fontSize: 45 * DPW,
      marginTop: 10 * DPW,
    },
    emailText: {
      fontFamily: 'BMJUA',
      fontSize: 28 * DPW,
      color: 'gray',
      marginTop: 2 * DPW,
    },
    overlap: {
      marginTop: 10 * DPW,
      width: 600 * DPW,
      height: 460 * DPW,
      borderRadius: 25,
      backgroundColor: 'white',
      borderColor: 'white',
      borderWidth: 5,
      position: 'absolute',
      top: 150 * DPW,
      zIndex: 9999,
      elevation: 17,
    },
    profileBox: {
      flex: 1,
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: 100,
      marginTop: 40 * DPW,
      position: 'absolute',
    },
    profileImage:{
      borderRadius: 70,
      width: 200 * DPW,
      height: 200 * DPW,
      borderColor: '#191970',
      borderWidth: 5,
    },
    editBox:{
  
    },
    editText:{
      fontFamily: 'BMJUA',
      color: '#191970',
      fontSize: 37 * DPW,
      marginTop:15 * DPW,
      marginRight:10 * DPW,
    },
    bottom: {
      backgroundColor: 'white',
      height: 1000 * DPW,
      width: 700 * DPW,
      marginTop: 350 * DPW,
      borderRadius: 70 ,
    },
    detailContainer: {
      marginTop: 220 * DPW,
      marginLeft: 60 * DPW,
    },
    detailContainer2:{
      marginLeft:60 * DPW,
      marginTop: 20 * DPW,
    },
    detailCategory: {
      fontFamily: 'BMJUA',
      color: '#191970',
      fontSize: 45 * DPW,
      textShadowOffset:{
          width:10,
          height:10,
      },
      textShadowColor:'#191970',
      textShadowRadius:10,
    },
    detailContent:{
      fontFamily: 'BMJUA',
      color: '#191970',
      fontSize: 35 * DPW,
      marginTop: 20 * DPW,
      marginLeft:20 * DPW
      
    },
  });
  