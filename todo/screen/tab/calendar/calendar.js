import React from 'react';

import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './calendarStyle';

const Calendar = (props) => {

  return (
    <View>
      <View style={styles.headerCont}>
        {props.this_month_value == props.getMoment.month() && 
        props.this_year_value == props.getMoment.year() ? ( //보고 있는 달이 이번달일 경우 저번달로 가기는 불가능
          <TouchableOpacity
            onPress={() => props.setErrorModal_last_month()}
            style={styles.changeMonthBtn}>
            <Text style={styles.changeMonthText_unavailable}>◀</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.changeMonthBtn}
            onPress={() => { props.previous_month()}}>
            <Text style={styles.changeMonthText}>◀</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.headerText}>{props.today.format('MMMM YYYY')}</Text>

        <TouchableOpacity
          style={styles.changeMonthBtn}
          onPress={() => {props.next_month()}}>
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
          .fill(props.day) //월화수목금토일 정보
          .map((data, index) => {
            //data가 없으면 안되는구나.
            return (
              <View key={index} style={styles.daysView}>
                <Text
                  style={ //일요일 토요일은 빨간색 글자로 출력
                    index == 0 || index == 6 ? styles.weekend : styles.daysText
                  }>
                  {props.day[index]}
                </Text>
              </View>
            );
          })}
      </View>

      <View>
        <View>{props.calendarArr()}</View>
      </View>
    </View>
  );
};
export default Calendar;
