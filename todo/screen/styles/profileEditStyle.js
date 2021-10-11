import { StyleSheet } from 'react-native';
import { DPW, WIDTH } from '../../dp';

export const styles = StyleSheet.create({
  keyBoardAvoid: {
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  topContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    height: 450 * DPW,
  },
  bottomContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    height: 650 * DPW,
  },
  categories: {
    marginTop: 30 * DPW,
  },
  text: {
    fontFamily: 'BMJUA',
    color: 'gray',
    fontSize: 26 * DPW,
    opacity: 0.4,
  },
  input: {
    width: 600 * DPW,
    fontFamily: 'BMJUA',
    color: '#191970',
    fontSize: 40 * DPW,
    paddingLeft: 10,
  },
  inputUnderLine: {
    width: 600 * DPW,
    backgroundColor: 'gray',
    height: 5 * DPW,
    opacity: 0.4,
    marginTop: -7,
  },
  pwdChange: {
    marginTop: 40 * DPW,
  },
  pwdChangeText: {
    fontFamily: 'BMJUA',
    color: '#191970',
    fontSize: 23,
  },
  editBox: {
    backgroundColor: '#191970',
    marginTop: 30 * DPW,
    marginLeft: 30 * DPW,
    height: 80 * DPW,
    width: 200 * DPW,
    borderColor: '#191970',
    borderWidth: 3,
  },
  editText: {
    textAlign: 'center',
    fontFamily: 'BMJUA',
    marginTop: 7 * DPW,
    marginRight: 5 * DPW,
    color: 'white',
    fontSize: 44 * DPW,
  },
  choicebox: {
    alignItems: 'center',
    marginTop: 30 * DPW,
  },
  photochoose: {
    textAlign: 'center',
    fontFamily: 'BMJUA',
    fontSize: 48 * DPW,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 490 * DPW,
    height: 120 * DPW,
    borderColor: '#191970',
    borderWidth: 5,
    paddingTop: 25 * DPW,
    elevation: 18,
  },
  profile: {
    width: 380 * DPW,
    height: 400 * DPW,
    marginTop: 40 * DPW,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: 'powderblue',
    
  },
  backBtnView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  backImg: {
    width: 120 * DPW,
    height: 120 * DPW,
    marginTop: 10 * DPW,
    marginLeft: 15 * DPW,
  },
  backSide: {
    backgroundColor: '#191970',
    height: 20 * DPW,
    width: WIDTH,
  },
  cameraImg: {
    marginTop: -70 * DPW,
    marginLeft: 280 * DPW,
  },
});
