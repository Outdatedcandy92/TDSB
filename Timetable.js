import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Timetable = ({ navigation }) => {
  const fdate = new Date();
  const day = String(fdate.getDate()).padStart(2, '0');
  const month = String(fdate.getMonth() + 1).padStart(2, '0');
  const year = fdate.getFullYear();
  const initialDateStr = `${day}${month}${year}`;

  let date = initialDateStr;
  let formattedDate = `${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4, 8)}`;

  const initialDate = new Date(date.slice(4, 8), date.slice(2, 4) - 1, date.slice(0, 2));
  const dayOfWeek = initialDate.getDay();
  if (dayOfWeek === 6) {
    initialDate.setDate(initialDate.getDate() + 2);
  } else if (dayOfWeek === 0) {
    initialDate.setDate(initialDate.getDate() + 1);
  }

  date = `${String(initialDate.getDate()).padStart(2, '0')}${String(initialDate.getMonth() + 1).padStart(2, '0')}${initialDate.getFullYear()}`;
  formattedDate = `${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4, 8)}`;

  const [activeDate, setActiveDate] = useState(formattedDate);
  const [classes, setClasses] = useState([]);
  const [currentDate, setCurrentDate] = useState(initialDate);

  useEffect(() => {
    console.log(`Selected active date: ${activeDate}`);
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('access_token');
      const schoolId = await AsyncStorage.getItem('school_code');
      if (!token) {
        throw new Error('No access token found');
      }

      // Recalculate the date based on activeDate
      const [day, month, year] = activeDate.split('/');
      const formattedDate = `${day}${month}${year}`;

      console.log('Fetching data for date:', activeDate, 'formatted as:', formattedDate);
      const url = `https://zappsmaprd.tdsb.on.ca/api/TimeTable/GetTimeTable/Student/${schoolId}/${formattedDate}`;

      try {
        const response = await fetch(url, {
          headers: {
            "X-Client-App-Info": "Android||2024Oct01120000P|False|1.2.6|False|306|",
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();
        console.log('Fetched data:', data);
        const parsedClasses = data.CourseTable.map(course => ({
          ClassCode: course.StudentCourse.ClassCode,
          TeacherName: course.StudentCourse.TeacherName,
          StartTime: new Date(course.StudentCourse.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/(AM|PM|am|pm|a\.m\.|p\.m\.)/g, '').trim(),
          EndTime: new Date(course.StudentCourse.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/(AM|PM|am|pm|a\.m\.|p\.m\.)/g, '').trim(),
          ClassName: course.StudentCourse.ClassName,
          RoomNo: course.StudentCourse.RoomNo,
        }));
        setClasses(parsedClasses);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [activeDate]);

  const getWeekDates = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const currentDate = new Date(year, month, day);
    const dayOfWeek = currentDate.getDay();
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Adjust if the date is a Sunday

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

  const incrementWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
    setActiveDate(newDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }));
  };

  const decrementWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
    setActiveDate(newDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }));
  };

  const weekDates = getWeekDates(currentDate);
  const weekRange = getWeekRange(weekDates);

  const truncateClassName = (name) => {
    const words = name.split(' ');
    let truncatedName = words[0];
    for (let i = 1; i < words.length; i++) {
      if ((truncatedName + ' ' + words[i]).length > 15) { //cut off long class names to short ones (communications technology to communications)
        break;
      }
      truncatedName += ' ' + words[i];
    }
    return truncatedName;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Timetable</Text>
        <View style={styles.weekContainer}>
          <View style={styles.weekforward}>
            <TouchableOpacity onPress={decrementWeek}>
              <Ionicons name="chevron-back" size={24} color="#F9FAFC" />
            </TouchableOpacity>
            <Text style={styles.weekRangeText}>{weekRange}</Text>
            <TouchableOpacity onPress={incrementWeek}>
              <Ionicons name="chevron-forward" size={24} color="#F9FAFC" />
            </TouchableOpacity>
          </View>
          <View style={styles.daysRow}>
            {weekDates.map((day, index) => {
              const dayFormattedDate = day.fullDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
              const isRedBox = dayFormattedDate === activeDate;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayBox,
                    isRedBox ? styles.redBox : styles.blueBox,
                  ]}
                  onPress={() => setActiveDate(dayFormattedDate)}
                >
                  <Text style={styles.dayText}>{day.day}</Text>
                  <Text style={styles.dateText}>{day.date}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.greyBox}>
          {classes.length === 0 ? (
            <Text style={styles.noCoursesText}>No Courses to show for this day</Text>
          ) : (
            classes.map((course, index) => (
              <View key={index} style={styles.rectangle}>
                <View style={styles.leftColumn}>
                  <Text
                    style={[styles.rectangleText, styles.className]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {truncateClassName(course.ClassName)}
                  </Text>
                  <Text style={styles.rectangleText}>{course.ClassCode}</Text>
                  <Text style={styles.rectangleText}>{course.TeacherName}</Text>
                </View>
                <View style={styles.rightColumn}>
                  <Text style={[styles.rectangleText, styles.classTime]}>
                    {course.StartTime} - {course.EndTime}
                  </Text>
                  <Text style={styles.rectangleText}>Room: {course.RoomNo}</Text>
                </View>
              </View>
            ))
          )}
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
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  redBox: {
    backgroundColor: '#EC3750',
  },
  blueBox: {
    backgroundColor: '#1B4278',
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
  greyBox: {
    width: '90%',
    backgroundColor: '#8492A6',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  noCoursesText: {
    fontSize: 16,
    color: '#17171D',
    fontFamily: 'PhantomSans-Bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  rectangle: {
    width: '100%',
    backgroundColor: '#F9FAFC',
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    flex: 2,
    justifyContent: 'space-between',
  },
  rightColumn: {
    flex: 2,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  rectangleText: {
    fontSize: 16,
    color: '#17171D',
    fontFamily: 'PhantomSans-Medium',
  },
  className: {
    fontSize: 18,
    fontFamily: 'PhantomSans-Bold',
  },
  classTime: {
    fontSize: 18,
    fontFamily: 'PhantomSans-Bold',
  },
  arrow: {
    fontSize: 24,
    color: '#F9FAFC',
    marginHorizontal: 10,
  },
  weekforward: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Timetable;