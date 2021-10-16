import { useState } from 'react';
import React from 'react';

import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import moment from 'moment';
import OneButtonModal from '../../../modal/OneButtonModal';
import { AuthContext } from '../../../context/authcontext';
import { SELECT_EXP_DATE_OF_TASKS } from '../../../sqliteConnection/taskTableConnection';
import { TodoContext } from '../../../context/todoContext';

const Calendar = ({ navigation }) => {
  const authContext=React.useContext(AuthContext)
  const todoContext=React.useContext(TodoContext)
  React.useEffect( ()=>{
    const subscribe = navigation.addListener('focus', async () => {
      //foucs될 때마다 발동 , 이게 핵심
      const getDate_task_registered = await SELECT_EXP_DATE_OF_TASKS(authContext.user_no)
      console.log("VALUE CHECK AT SCREEN  :"+getDate_task_registered)
      todoContext.list_of_date = getDate_task_registered
    });
    return subscribe;
  }, [])

  const [getMoment, setMoment] = useState(moment());
  const [errorModal_last_month, setErrorModal_last_month] = useState(false)
  const this_month_value = moment(new Date()).month();
  const this_year_value = moment(new Date()).year();

  const today = getMoment;
  const firstWeek = today.clone().startOf('month').week();
  const lastWeek =
    today.clone().endOf('month').week() === 1
      ? 53
      : today.clone().endOf('month').week();
  const calendarArr = () => {
    let result = [];
    let week = firstWeek;
    let days_array = []
    for (week; week <= lastWeek; week++) {
      result = result.concat(
        <View key={week} style={styles.container}>
          {Array(7)
            .fill(0)
            .map((data, index) => {
              let days = today
                .clone()
                .startOf('year')
                .week(week)
                .startOf('week')
                .add(index, 'day'); //d로해도되지만 직관성
                // console.log("days console : "+days.date())
              days_array.push(days.format('YYYY-MM-DD'))

              if (moment().format('YYYYMMDD') === days.format('YYYYMMDD')) {
                return (
                  <View key={index} style={styles.today}>
                    <Text style={styles.daysText}>{days.format('D')}</Text>
                    
                  </View>
                );
              } else if (days.format('MM') !== today.format('MM')) {
                return (
                  <View key={index} style={styles.days_not_this_month}>
                    <Text style={styles.days_not_this_month_text}>
                      {days.format('D')}
                    </Text>
                   
                  </View>
                );
              } else {
                return (
                  <View key={index} style={styles.days_this_month}>
                    <Text style={styles.daysText}>{days.format('D')}</Text>
                    {Array(todoContext.list_of_date.length)
                    .fill(todoContext.list_of_date)
                    .map( (v,i) => {
                      // console.log("Value"+v)
                      // console.log("daysFormat"+days.format('YYYY-MM-DD'))
                      
                    })
                    }
                  </View>
                );
              }
            })
            }
            
        </View>,
      );
    }
    console.log("교집합 : "+todoContext.list_of_date.filter( x => days_array.includes(x))) 
    return result;
  };

  let day = [ '일', '월', '화', '수', '목', '금', '토']
  return (
    <View>
      <View style={styles.headerCont}>
        {this_month_value == getMoment.month() &&
        this_year_value == getMoment.year() ? (
          <TouchableOpacity
            onPress={ () => setErrorModal_last_month(true)}
            style={styles.changeMonthBtn}>
            <Text style={styles.changeMonthText_unavailable}>◀</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.changeMonthBtn}
            onPress={() => {
              setMoment(getMoment.clone().subtract(1, 'month'));
            }}>
            <Text style={styles.changeMonthText}>◀</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.headerText}>{today.format('MMMM YYYY')}</Text>
        <TouchableOpacity
          style={styles.changeMonthBtn}
          onPress={() => {
            setMoment(getMoment.clone().add(1, 'month'));
          }}>
          <Text style={styles.changeMonthText}>▶</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.daysCont}>
          { Array(7)
           .fill(day)
           .map( (data, index) => { //data가 없으면 안되는구나.
            return (
              <View key={index} style={styles.daysView}>
                <Text style={index == 0 || index == 6 ? styles.weekend: styles.daysText}>{day[index]}</Text>
              </View>
            )
           })          
          }
      </View>
      <View>
        <View>{calendarArr()}</View>
      </View>
      <OneButtonModal
        modalOn={errorModal_last_month}
        modalOff={()=>setErrorModal_last_month(false)}
        message={'스케쥴 열람은 이번달까지만 가능합니다'}
      />
    </View>
  );
};
export default Calendar;
const styles = StyleSheet.create({
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
    color: '#191970',
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
    color: '#191970',
  },
  changeMonthText_unavailable: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 25,
    color: '#dcdcdc',
    opacity: 1,
  },
  daysCont:{
    flexDirection:'row', 
    alignSelf:'center',
    
  },
  daysView:{
    width:35,
    height:35,
    marginBottom:-10,
    backgroundColor:'#AFEEEE',
    paddingTop:8,
    opacity:0.7,
  },
  daysText:{
  },
  weekend:{
    fontSize:18,
    color:'red',
    fontFamily:'BMJUA',
    textAlign:'center',
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
    fontSize: 18,
    fontFamily: 'BMJUA',
    alignSelf: 'center',
    color: 'gray',
    opacity: 0.5,
  },
  days_this_month: {
    width: 35,
    height: 35,
  },
  daysText: {
    fontSize: 18,
    fontFamily: 'BMJUA',
    alignSelf: 'center',
  },
});
