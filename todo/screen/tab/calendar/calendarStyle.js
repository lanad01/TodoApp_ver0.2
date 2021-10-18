import { StyleSheet } from "react-native";
import { LIGHT_SALMON, MIDNIGHT_BLUE, PALETUR } from "../../../config/color";
import { DPW } from "../../../config/dp";

export const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginHorizontal: 120 * DPW,
      marginTop: 50 * DPW,
    },
    headerCont: {
      flexDirection: 'row',
      alignSelf: 'center',
      height: 140 * DPW,
      marginTop: 40 * DPW,
    },
    headerText: {
      fontFamily: 'BMJUA',
      fontSize: 58 * DPW,
      alignItems: 'center',
      alignSelf: 'center',
      color: MIDNIGHT_BLUE,
      textAlign: 'center',
    },
    changeMonthBtn: {
      alignItems: 'center',
      alignSelf: 'center',
      width: 80 * DPW,
      height: 80 * DPW,
      marginHorizontal: 40 * DPW,
    },
    changeMonthText: {
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: 50 * DPW,
      color: MIDNIGHT_BLUE,
    },
    changeMonthText_unavailable: {
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: 50 * DPW,
      color: '#dcdcdc',
      opacity: 1,
    },
    daysCont: {
      flexDirection: 'row',
      alignSelf: 'center',
    },
    daysView: {
      width: 70 * DPW,
      height: 70 * DPW,
      marginBottom: -20 * DPW,
      backgroundColor: PALETUR,
      paddingTop: 16 * DPW,
      opacity: 0.7,
    },
    daysText: {},
    weekend: {
      fontSize: 42 * DPW,
      color: 'red',
      fontFamily: 'BMJUA',
      textAlign: 'center',
    },
    today: {
      width: 70 * DPW,
      height: 70 * DPW,
      backgroundColor: 'yellow',
    },
    days_not_this_month: {
      width: 70 * DPW,
      height: 70 * DPW,
    },
    days_not_this_month_text: {
      fontSize: 42 * DPW,
      fontFamily: 'BMJUA',
      alignSelf: 'center',
      color: 'gray',
      opacity: 0.5,
    },
    days_this_month: {
      width: 70 * DPW,
      height: 70 * DPW,
      
    },
    days_have_task: {
      
      width: 70 * DPW,
      height: 70 * DPW,
      backgroundColor: LIGHT_SALMON,
    },
    daysText: {
      fontSize: 42 * DPW,
      fontFamily: 'BMJUA',
      alignSelf: 'center',
    },
    mark_info: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      alignSelf: 'flex-end',
      marginBottom:20 * DPW,
      marginRight: 120 * DPW,
    },
    mark_info_yellow: {
      backgroundColor: 'yellow',
      width: 110 * DPW,
      height: 70 * DPW,
    },
    mark_info_pink: {
      backgroundColor: LIGHT_SALMON,
      width: 110 * DPW,
      height: 70 * DPW,
      marginLeft: 20 * DPW
    },
    markText: {
      fontFamily: 'BMJUA',
      fontSize: 32 * DPW,
      textAlign: 'center',
      paddingTop: 10* DPW,
    },
  });
  