import { StyleSheet } from 'react-native';
import { DPW } from '../../dp';
export const styles = StyleSheet.create({
  logoutBtn: {
    fontFamily: 'BMJUA',
    fontSize: 36 * DPW,
    color: 'white',
  },
  btnView: {
    backgroundColor: '#191970',
    width: 160 * DPW,
    height: 60 * DPW,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:20 * DPW
  },
  tabbarLabel: {
    fontFamily: 'BMJUA',
    fontSize: 28 * DPW,
  },
  headerTitleStyle: {
    fontFamily: 'BMJUA',
    fontSize: 55 * DPW,
  },
  tabbarIcon: {
    width: 66 * DPW,
    height: 60 * DPW,
  },
});
