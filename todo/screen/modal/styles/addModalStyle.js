import { StyleSheet } from 'react-native';
import { PALETUR } from '../../../config/color';
import { DPW } from '../../../config/dp';

export const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  outside: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 3,
    borderRadius: 13,
    borderColor: PALETUR,
  },
  validModal: {
    width: 600 * DPW,
    height: 700 * DPW,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    fontFamily: 'BMJUA',
    fontSize: 64 * DPW,
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 20 * DPW,
  },
  category: {
    color: 'black',
    fontFamily: 'BMJUA',
    fontSize: 40 * DPW,
    width: 180 * DPW,
  },
  category2: {
    color: 'black',
    fontFamily: 'BMJUA',
    fontSize: 40 * DPW,
    width: 180 * DPW,
    marginTop: 30 * DPW,
  },
  taskContainer: {
    flexDirection: 'row',
    height: 120 * DPW,
  },
  taskInput: {
    width: 300 * DPW,
    height: 90 * DPW,
    bottom: 20 * DPW,
    paddingLeft: 20 * DPW,
    backgroundColor: PALETUR,
    borderRadius: 7,
    fontFamily: 'BMJUA',
  },
  priorContainer: {
    flexDirection: 'row',
    height: 160 * DPW,
  },
  picker: {
    width: 320 * DPW,
    height: 100 * DPW,
    backgroundColor: PALETUR,
    marginLeft: 10 * DPW,
    marginBottom: 20 * DPW,
  },
  opacity: {
    backgroundColor: PALETUR,
    borderWidth: 4,
    borderColor: 'white',
    marginLeft: 10 * DPW,
    borderRadius: 5 ,
    borderColor: 'black',
  },
  expContainer: { 
    flexDirection: 'row', 
    height: 80 * DPW
  },
  expBtn: {
    fontFamily: 'BMJUA',
    fontSize: 40 * DPW,
    color: 'black',
    justifyContent: 'center',
    marginTop: 10 * DPW,
  },
  expInput: {
    backgroundColor: PALETUR,
    marginLeft: 20 * DPW,
    width: 320 * DPW,
    height: 80 * DPW,
    borderRadius: 5,
    fontFamily: 'BMJUA',
    fontSize: 28 * DPW,
    color: 'black',
    paddingLeft: 22 * DPW,
  },
  choicebox: {
    alignItems: 'center',
    marginTop: 30 * DPW,
  },
  photochoose: {
    textAlign: 'center',
    fontFamily: 'BMJUA',
    fontSize: 46 * DPW,
    backgroundColor: 'white',
    borderRadius: 7,
    borderWidth: 5,
    width: 200 * DPW,
    borderWidth: 5,
    paddingTop: 20 * DPW,
    margin: 10 * DPW,
  },
});
