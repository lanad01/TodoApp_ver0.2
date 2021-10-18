import { StyleSheet } from "react-native";
import { DPW } from "../../../config/dp";
import { PALETUR } from "../../../config/color";
export const styles = StyleSheet.create({
    choicebox: {
      alignItems: 'center',
      marginTop: 30 * DPW,
    },
    outside: {
      width: 800 * DPW,
      height: 1400 * DPW,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    photochoose: {
      textAlign: 'center',
      fontFamily: 'BMJUA',
      fontSize: 44 * DPW,
      backgroundColor: 'white',
      borderRadius: 7,
      borderWidth: 5,
      width: 200 * DPW,
      borderWidth: 5,
      paddingTop: 20 * DPW,
      margin: 10 * DPW,
    },
    validModal: {
      width: 600 * DPW,
      height: 500 * DPW,
      backgroundColor: 'white',
      borderRadius: 10,
      borderColor: PALETUR,
      borderWidth: 5,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 19,
      zIndex: 3,
    },
    validText: {
      width: 470 * DPW,
      fontFamily: 'BMJUA',
      fontSize: 36 * DPW,
      textAlign: 'center',
    },
    pwdInput: {
      borderWidth: 4,
      width: 400 * DPW,
      height: 80 * DPW,
      borderRadius: 10,
      textAlign: 'center',
      marginTop: 20 * DPW,
    },
  });
  