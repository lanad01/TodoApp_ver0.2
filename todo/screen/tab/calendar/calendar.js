import { useState } from 'react';
import React from 'react';

import { View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import OneButtonModal from '../../../modal/OneButtonModal';
import { AuthContext } from '../../../context/authcontext';
import {  SELECT_EXP_DATE_OF_TASKS, } from '../../../sqliteConnection/taskTableConnection';
import { TodoContext } from '../../../context/todoContext';
import { Loading } from '../../../modal/Loading';
import { styles } from './calendarStyle';
import TasksByDateModal from '../../../modal/TasksByDateModal';
const Calendar = ({ navigation }) => {
  const authContext = React.useContext(AuthContext);
  const todoContext = React.useContext(TodoContext);
  const [loading, setLoading] = React.useState(false);
  const [dateDetailModal, setDateDetailModal] = React.useState(false);
  const [selected_date, setSelected_Date] = React.useState();

  React.useEffect(() => {
    const subscribe = navigation.addListener('focus', async () => {
      //foucs될 때마다 발동 , 이게 핵심
      setLoading(true);
      const getDate_of_tasks = await SELECT_EXP_DATE_OF_TASKS(
        authContext.user_no,
      );
      console.log('VALUE CHECK AT SCREEN  :' + getDate_of_tasks);
      todoContext.list_of_date = await getDate_of_tasks;
      setLoading(false);
    });
    return subscribe;
  }, []);

  //버튼을 누를 시 해당 날짜의 Task가 무엇이 있는지 확인 가능
  const taskCheck = date => {
    setSelected_Date(date);
    setDateDetailModal(true);
  };

  const [getMoment, setMoment] = useState(moment());
  const [errorModal_last_month, setErrorModal_last_month] = useState(false);
  const this_month_value = moment(new Date()).month();
  const this_year_value = moment(new Date()).year();

  const today = getMoment;
  let day = ['일', '월', '화', '수', '목', '금', '토'];
  const firstWeek = today.clone().startOf('month').week();
  const lastWeek =
    today.clone().endOf('month').week() === 1
      ? 53
      : today.clone().endOf('month').week();
  const calendarArr = () => {
    let result = [];
    let week = firstWeek;
    let days_array = [];
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
              days_array.push(days.format('YYYY-MM-DD'));
              let have_Task = false;
              if (moment().format('YYYYMMDD') === days.format('YYYYMMDD')) {
                return (
                  <View key={index} style={styles.today}>
                    <TouchableOpacity
                      onPress={() => taskCheck(days.format('YYYY-MM-DD'))}>
                      <Text style={styles.daysText}>{days.format('D')}</Text>
                    </TouchableOpacity>
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
              } else if (
                todoContext.list_of_date.includes(days.format('YYYY-MM-DD'))
              ) {
                have_Task = true;
                return (
                  <View
                    key={index}
                    style={
                      have_Task ? styles.days_have_task : styles.days_this_month
                    }>
                    <TouchableOpacity
                      onPress={() => taskCheck(days.format('YYYY-MM-DD'))}>
                      <Text style={styles.daysText}>{days.format('D')}</Text>
                    </TouchableOpacity>
                  </View>
                );
              } else {
                return (
                  <View key={index} style={styles.days_this_month}>
                    <Text style={styles.daysText}>{days.format('D')}</Text>
                  </View>
                );
              }
            })}
        </View>,
      );
    }

    return result;
  };

  return (
    <View>
      <View style={styles.headerCont}>
        {this_month_value == getMoment.month() &&
        this_year_value == getMoment.year() ? (
          <TouchableOpacity
            onPress={() => setErrorModal_last_month(true)}
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
      <View style={styles.mark_info}>
        <View style={styles.mark_info_yellow}>
          <Text style={styles.markText}> Today </Text>
        </View>

        <View style={styles.mark_info_pink}>
          <Text style={styles.markText}> Task </Text>
        </View>
      </View>
      <View style={styles.daysCont}>
        {Array(7)
          .fill(day)
          .map((data, index) => {
            //data가 없으면 안되는구나.
            return (
              <View key={index} style={styles.daysView}>
                <Text
                  style={
                    index == 0 || index == 6 ? styles.weekend : styles.daysText
                  }>
                  {day[index]}
                </Text>
              </View>
            );
          })}
      </View>

      <View>
        <View>{calendarArr()}</View>
      </View>

      <OneButtonModal
        modalOn={errorModal_last_month}
        modalOff={() => setErrorModal_last_month(false)}
        message={'스케쥴 열람은 이번달까지만 가능합니다'}
      />
      <Loading modalOn={loading} />
      <TasksByDateModal
        modalOn={dateDetailModal}
        modalOff={() => setDateDetailModal(false)}
        date={selected_date}
      />
    </View>
  );
};
export default Calendar;
