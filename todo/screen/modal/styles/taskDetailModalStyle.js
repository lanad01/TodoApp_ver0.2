import { StyleSheet } from 'react-native';
import { MIDNIGHT_BLUE, PALETUR } from '../../../config/color';
import { DPW } from '../../../config/dp';
export const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  choicebox: {
    alignItems: 'center',
    marginTop: 15 * DPW,
  },
  validModal: {
    width: 660 * DPW,
    height: 600 * DPW,
    backgroundColor: 'white',
    borderRadius: 10 ,
    borderColor: PALETUR,
    borderWidth: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    textAlign: 'center',
    fontFamily: 'BMJUA',
    fontSize: 40 * DPW,
    color: 'white',
    backgroundColor: MIDNIGHT_BLUE,
    borderRadius: 7,
    width: 200 * DPW,
    paddingTop: 10 * DPW, 
    paddingBottom: 5 * DPW,
    marginHorizontal: 20 * DPW,
  },
  container: {
    flexDirection: 'row',
    marginTop: 30 * DPW,
  },
  validText: {
    fontFamily: 'BMJUA',
    color: MIDNIGHT_BLUE,
    fontSize: 36 * DPW,
  },
  pickerView: {
    borderColor: MIDNIGHT_BLUE,
    borderRadius: 5 ,
    borderWidth: 3,
  },
  priorText: {
    fontFamily: 'BMJUA',
    color: MIDNIGHT_BLUE,
    fontSize: 36 * DPW,
    paddingTop: 40 * DPW,
    marginRight: 8 * DPW,
  },
  content: {
    fontFamily: 'BMJUA',
    fontSize: 36 * DPW,
    paddingLeft: 20 * DPW,
    bottom: 26 * DPW,
    width: 300 * DPW,
    height: 80 * DPW,
    marginLeft: 10 * DPW,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: MIDNIGHT_BLUE,
  },
  picker: {
    width: 250 * DPW,
    height: 95 * DPW,
    marginLeft: 10 * DPW,
    marginBottom: 20 * DPW,
  },
  changeExp: {
    fontFamily: 'BMJUA',
    color: 'white',
    fontSize: 36 * DPW,
    alignSelf: 'center',
    marginTop: 10 * DPW,
  }, 
  pickedData: {
    fontFamily: 'BMJUA',
    color: MIDNIGHT_BLUE,
    fontSize: 30 * DPW,
    bottom: 20 * DPW,
    marginLeft: 24 * DPW,
  },
  datePickerView: {
    backgroundColor: MIDNIGHT_BLUE,
    width: 200 * DPW,
    height: 60 * DPW,
    borderRadius:10,
  },
});
