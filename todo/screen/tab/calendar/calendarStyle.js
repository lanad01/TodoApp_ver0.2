import { StyleSheet } from "react-native";
import { LIGHT_SALMON, MIDNIGHT_BLUE, PALETUR } from "../../../config/color";


export const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginHorizontal: 60,
      marginTop: 25,
    },
    headerCont: {
      flexDirection: 'row',
      alignSelf: 'center',
      height: 70,
      marginTop: 20,
    },
    headerText: {
      fontFamily: 'BMJUA',
      fontSize: 29,
      alignItems: 'center',
      alignSelf: 'center',
      color: MIDNIGHT_BLUE,
      textAlign: 'center',
    },
    changeMonthBtn: {
      alignItems: 'center',
      alignSelf: 'center',
      width: 40,
      height: 40,
      marginHorizontal: 20,
    },
    changeMonthText: {
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: 25,
      color: MIDNIGHT_BLUE,
    },
    changeMonthText_unavailable: {
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: 25,
      color: '#dcdcdc',
      opacity: 1,
    },
    daysCont: {
      flexDirection: 'row',
      alignSelf: 'center',
    },
    daysView: {
      width: 35,
      height: 35,
      marginBottom: -10,
      backgroundColor: PALETUR,
      paddingTop: 8,
      opacity: 0.7,
    },
    daysText: {},
    weekend: {
      fontSize: 21,
      color: 'red',
      fontFamily: 'BMJUA',
      textAlign: 'center',
    },
    today: {
      width: 35,
      height: 35,
      backgroundColor: 'yellow',
    },
    days_not_this_month: {
      width: 35,
      height: 35,
    },
    days_not_this_month_text: {
      fontSize: 21,
      fontFamily: 'BMJUA',
      alignSelf: 'center',
      color: 'gray',
      opacity: 0.5,
    },
    days_this_month: {
      width: 35,
      height: 35,
      
    },
    days_have_task: {
      
      width: 35,
      height: 35,
      backgroundColor: LIGHT_SALMON,
    },
    daysText: {
      fontSize: 21,
      fontFamily: 'BMJUA',
      alignSelf: 'center',
    },
    mark_info: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      alignSelf: 'flex-end',
      marginBottom:10,
      marginRight:60,
    },
    mark_info_yellow: {
      backgroundColor: 'yellow',
      width: 55,
      height: 35,
    },
    mark_info_pink: {
      backgroundColor: LIGHT_SALMON,
      width: 55,
      height: 35,
      marginLeft:10
    },
    markText: {
      fontFamily: 'BMJUA',
      fontSize: 16,
      textAlign: 'center',
      paddingTop: 5,
    },
  });
  