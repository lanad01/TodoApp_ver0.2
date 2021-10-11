import { StyleSheet } from 'react-native';
import { DPW } from '../../dp';
export const styles = StyleSheet.create({
  container: {
    height: 1400 * DPW,
    backgroundColor: '#191970',
    justifyContent: 'center',
    alignItems:'center'
  },
  headerText: {
    fontFamily: 'BMJUA',
    fontSize: 62 * DPW,
    color: '#191970',
    marginLeft: 20 * DPW,
    marginBottom: 40 * DPW,
  },
  headerDetailText: {
    fontFamily: 'BMJUA',
    fontSize: 36 * DPW,
    color: '#191970',
    marginLeft: 30 * DPW,
    marginBottom: 40 * DPW,
  },
  inner: {
    padding: 48 * DPW ,
    backgroundColor: 'white',
    width: 660 * DPW,
    height:1100 * DPW,
    borderRadius: 20,
    marginBottom:130*DPW  ,
  },
  category: {
    fontFamily: 'BMJUA',
    color: '#191970',
    fontSize: 50 * DPW,
    left: 20 * DPW,
  },
  nnMsg: {
    fontFamily: 'BMJUA',
    fontSize: 26 * DPW,
    color: 'red',
    marginLeft: 26 * DPW,
    marginTop: 10 * DPW,
  },
  input: {
    fontFamily: 'BMJUA',
    height: 100 * DPW,
    width: 520 * DPW,
    backgroundColor: 'white',
    borderColor: '#191970',
    borderWidth: 5,
    borderRadius: 8,
    borderBottomWidth: 1,
    marginBottom: 40 * DPW,
    left: 20 * DPW,
    paddingLeft: 20 * DPW,
  },
  pwdinput: {
    height: 100 * DPW,
    width: 520 * DPW,
    backgroundColor: 'white',
    borderColor: '#191970',
    borderWidth: 5,
    borderRadius: 8,
    borderBottomWidth: 1,
    marginBottom: 40 * DPW,
    left: 20 * DPW,
    paddingLeft: 20 * DPW,
  },
  
  nextBtn: {
    width: 100 * DPW,
    height: 100 * DPW,
  },
  nextBtnContainer: {
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
    marginLeft: 160 * DPW,
  },
});
