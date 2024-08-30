import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfMonth = getFirstDayOfMonth(month, year);

    let days = [];
    let startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }


    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  };

  const calendarDays = generateCalendar();

  const handleDatePress = (date) => {
    setSelectedDate(date);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </Text>
        <View style={styles.calendar}>
          {daysOfWeek.map((day, index) => (
            <View key={index} style={styles.dayOfWeekContainer}>
              <Text style={styles.dayOfWeekText}>{day}</Text>
            </View>
          ))}
          {calendarDays.map((date, index) => (
            <View key={index} style={styles.dateWrapper}>
              <TouchableOpacity
                style={[
                  styles.dateContainer,
                  selectedDate && date && selectedDate.toDateString() === date.toDateString()
                    ? styles.selectedDateContainer
                    : null,
                ]}
                onPress={() => date && handleDatePress(date)}
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedDate && date && selectedDate.toDateString() === date.toDateString()
                      ? styles.selectedDateText
                      : null,
                  ]}
                >
                  {date ? date.getDate() : ''}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#17171D',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'PhantomSans-Bold',
    color: '#F9FAFC',
    marginVertical: 20,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  dayOfWeekContainer: {
    width: screenWidth / 8,
    height: screenWidth / 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayOfWeekText: {
    fontSize: 16,
    fontFamily: 'PhantomSans-Medium',
    color: '#F9FAFC',
  },
  dateWrapper: {
    width: screenWidth / 8, 
    height: screenWidth / 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'PhantomSans-Regular',
    color: '#F9FAFC',
  },
  selectedDateContainer: {
    backgroundColor: '#EC3750',
    borderRadius: screenWidth / 15, 
  },
  selectedDateText: {
    color: '#F9FAFC',
    fontFamily: 'PhantomSans-Bold',
  },
});

export default CalendarComponent;