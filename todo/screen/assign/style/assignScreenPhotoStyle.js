import { StyleSheet } from 'react-native';
import { MIDNIGHT_BLUE, PALETUR } from '../../../config/color';
import { DPW } from '../../../config/dp';
export const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: 'white',
    flexGrow: 1, //added flexGrow
  },
  headContainer: {
    height: 550 * DPW,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'BMJUA',
    fontSize: 48 *DPW,
    color: MIDNIGHT_BLUE,
    marginTop: 60 *DPW,
    marginLeft: 40 *DPW,
  },
  profileImage: {
    width: 500 *DPW,
    height: 480 *DPW,
    marginTop: 20 *DPW,
    borderRadius: 100 *DPW,
  },
  btmContainer: {
  },
  nameInput: {
    width: 560 *DPW,
    height: 100 *DPW,
    borderRadius: 10,
    fontFamily: 'BMJUA',
    fontSize: 45 *DPW,
    color: MIDNIGHT_BLUE,
    paddingLeft: 17 *DPW,
    marginTop: 80 *DPW,
  },
  nameInfo: {
    fontFamily: 'BMJUA',
    color: 'white',
    fontSize: 46 *DPW,
    marginTop: 30 *DPW,
  },
  Info: {
    fontFamily: 'BMJUA',
    color: 'white',
    textAlign:'center',
    fontSize: 33 *DPW,
    width: 600 *DPW,
    marginTop:40 *DPW
  },
  footer: {
    width: 500 *DPW,
    height: 120 *DPW,
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 50 *DPW,
  },
  btn: {
    textAlign: 'center',
    width: 460 *DPW,
    alignItems: 'center',
    fontFamily: 'BMJUA',
    fontSize: 60 *DPW,
    color: MIDNIGHT_BLUE,
    marginTop: 10 *DPW,
    paddingTop: 14 *DPW,
    paddingLeft:10 *DPW,
    borderWidth: 5,
    borderColor: MIDNIGHT_BLUE,
    borderRadius: 30,
  },
  choicebox: {
    alignItems: 'center',
    marginTop: 30 *DPW,
  },
  photochoose: {
    textAlign: 'center',
    fontFamily: 'BMJUA',
    fontSize: 46 *DPW,
    backgroundColor: 'white',
    borderRadius: 7,
    borderWidth:5,
    width: 500 *DPW,
    height: 100 *DPW,
    borderColor: PALETUR,
    paddingTop: 20 *DPW,
  },
});
