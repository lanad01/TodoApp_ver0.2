import { StyleSheet } from 'react-native';
import { DPW } from '../../dp';
export const styles = StyleSheet.create({
  container: {},
  header: {
    alignItems: 'flex-start',
    top: 40 * DPW,
    left: 60 * DPW,
  },
  headerText: {
    fontFamily: 'BMJUA',
    fontSize: 70 * DPW,
    color: '#191970',
  },
  detailText: {
    marginTop: 60 * DPW,
    fontFamily: 'BMJUA',
    fontSize: 44 * DPW,
    color: '#191970',
  },
  input: {
    paddingLeft: 20 * DPW,
    fontSize: 36 * DPW,
    color: '#191970',
  },
  editBox: {
    backgroundColor: '#191970',
    margin: 50 * DPW,
    height: 80 * DPW,
    width: 200 * DPW,
  },
  editText: {
    textAlign: 'center',
    fontFamily: 'BMJUA',
    marginTop: 12 * DPW,
    color: 'white',
    fontSize: 48 * DPW,
  },
  backBtn: {
    width: 90 * DPW,
    height: 90 * DPW,
    marginLeft: 5,
  },
  underLine: {
    backgroundColor: '#191970',
    height: 6 * DPW,
    width: 460 * DPW,
    marginLeft: 16 * DPW,
  },
  backBtnContainer:{
    marginBottom: 20 
  },
  btnContainer: {
    alignSelf: 'flex-end',
    marginRight: 180 * DPW,
    flexDirection: 'row',
  },
  pwdVisible: {
    marginLeft: 100 * DPW,
    height: 50 * DPW ,
    marginTop: 10 * DPW,
  },
  pwdVisible2: {
    marginLeft: 135 * DPW,
    height: 50 * DPW,
    marginTop: 10 * DPW,
  },
  visibleImg: {
    height: 64 * DPW,
    width: 60 * DPW,
  },
});
