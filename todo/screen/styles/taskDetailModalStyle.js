import { StyleSheet } from 'react-native';
import { DPW } from '../../dp';

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
    borderColor: '#AEEEEE',
    borderWidth: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    textAlign: 'center',
    fontFamily: 'BMJUA',
    fontSize: 40 * DPW,
    color: 'white',
    backgroundColor: '#191970',
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
    color: '#191970',
    fontSize: 36 * DPW,
  },
  pickerView: {
    borderColor: '#191970',
    borderRadius: 5 ,
    borderWidth: 3,
  },
  priorText: {
    fontFamily: 'BMJUA',
    color: '#191970',
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
    borderColor: '#191970',
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
    color: '#191970',
    fontSize: 30 * DPW,
    bottom: 20 * DPW,
    marginLeft: 24 * DPW,
  },
  datePickerView: {
    backgroundColor: '#191970',
    width: 200 * DPW,
    height: 60 * DPW,
    borderRadius:10,
  },
});
