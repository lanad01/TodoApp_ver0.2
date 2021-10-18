import { StyleSheet } from "react-native";
import { DPW } from '../../../config/dp';

export const styles = StyleSheet.create({
    choicebox: {
      alignItems: 'center',
      marginTop: 30 * DPW,
    },
    outside: {
      width: 800 * DPW,
      height: 700 * DPW,
      justifyContent: 'center',
      alignItems: 'center',
    },
    exitBtn: {
      textAlign: 'center',
      textAlignVertical: 'center',
      fontFamily: 'BMJUA',
      fontSize: 46 * DPW,
      backgroundColor: 'white',
      borderRadius: 7,
      borderWidth: 5,
      marginBottom: 40 * DPW,
      padding: 20 * DPW,
    },
    validModal: {
      width: 600 * DPW,
      height: 700 * DPW,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 10,
      borderWidth: 7,
      borderColor: 'black',
    },
    selected_Date: {
      fontFamily: 'BMJUA',
      fontSize: 54 * DPW,
      textAlign: 'center',
      marginVertical: 30 * DPW,
    },
    card: {
      shadowOpacity: 0.8,
      elevation: 5,
      height: 100 * DPW,
      width: 480 * DPW,
      alignSelf: 'center',
      marginTop: 10 * DPW,
      marginBottom: 15 * DPW,
      backgroundColor: '#FAFAD2',
    },
    task_nameView: {
      width: 240 * DPW,
      height: 80 * DPW,
      alignSelf: 'center',
      alignItems: 'center',
      alignContent: 'center',
      marginTop: 20 * DPW,
    },
    task_name: {
      fontFamily: 'BMJUA',
      fontSize: 44 * DPW,
      textAlignVertical: 'center',
      color: 'black',
    },
    task_priorAndperformed: {
      flexDirection: 'row',
      width: 80,
    },
    priority: {
      fontFamily: 'BMJUA',
      fontSize: 28 * DPW,
      textAlignVertical: 'center',
      color: 'black',
    },
    performed: {
      fontFamily: 'BMJUA',
      fontSize: 30 * DPW,
      textAlignVertical: 'center',
      color: 'black',
    },
  });
  