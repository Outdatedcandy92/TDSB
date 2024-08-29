import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

const Timetable = ({ navigation }) => {
  const date = "02092024"; // ddmmyyyy
  const weekDates = getWeekDates(date);
  const weekRange = getWeekRange(weekDates);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Timetable</Text>
        <View style={styles.weekContainer}>
          <Text style={styles.weekRangeText}>{weekRange}</Text>
          <View style={styles.daysRow}>
            {weekDates.map((day, index) => (
              <View key={index} style={styles.dayBox}>
                <Text style={styles.dayText}>{day.day}</Text>
                <Text style={styles.dateText}>{day.date}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const getWeekDates = (dateString) => {
  const day = parseInt(dateString.slice(0, 2), 10);
  const month = parseInt(dateString.slice(2, 4), 10) - 1; 
  const year = parseInt(dateString.slice(4, 8), 10);
  const date = new Date(year, month, day);
  const dayOfWeek = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Adjust if the date is a Sunday

  const weekDates = [];
  for (let i = 0; i < 5; i++) {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);
    weekDates.push({
      day: currentDay.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3),
      date: currentDay.toLocaleDateString('en-GB', { day: '2-digit' }),
      fullDate: currentDay,
    });
  }

  return weekDates;
};

const getWeekRange = (weekDates) => {
  const startDate = weekDates[0].fullDate;
  const endDate = weekDates[4].fullDate;
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const startString = startDate.toLocaleDateString('en-US', options).toUpperCase();
  const endString = endDate.toLocaleDateString('en-US', options).toUpperCase();
  return `${startString} - ${endString}`;
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
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 40,
    fontFamily: 'PhantomSans-Bold',
    color: '#F9FAFC',
    marginLeft: 20,
    marginTop: 40,
  },
  weekContainer: {
    marginTop: 20,
    backgroundColor: '#2E2E38',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  weekRangeText: {
    fontSize: 20,
    fontFamily: 'PhantomSans-Bold',
    color: '#F9FAFC',
    marginBottom: 15,
    marginTop: 10,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    width: '100%',
  },
  dayBox: {
    backgroundColor: '#1B4278',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  dayText: {
    fontSize: 18,
    fontFamily: 'PhantomSans-Semibold',
    color: '#F9FAFC',
  },
  dateText: {
    fontSize: 18,
    fontFamily: 'PhantomSans-Semibold',
    color: '#F9FAFC',
  },
});

export default Timetable;