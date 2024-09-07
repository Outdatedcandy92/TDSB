import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [cycleDay, setCycleDay] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [schoolId, setSchoolId] = useState('');

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const storedFirstName = await AsyncStorage.getItem('first_name');
      const schoolId = await AsyncStorage.getItem('school_code');
      if (!token) {
        throw new Error('No access token found');
      }
      if (storedFirstName) {
        setFirstName(storedFirstName);
      }
      if (schoolId) {
        setSchoolId(schoolId);
      }

      const fdate = new Date();
      const day = String(fdate.getDate()).padStart(2, '0');
      const month = String(fdate.getMonth() + 1).padStart(2, '0'); 
      const year = fdate.getFullYear();
      const date = `${day}${month}${year}`;

      console.log(date); 
      console.log("school id: ", schoolId);

      const response = await fetch(`https://zappsmaprd.tdsb.on.ca/api/TimeTable/GetTimeTable/Student/${schoolId}/${date}`, { //get school code from student info
        method: 'GET',
        headers: {
          "X-Client-App-Info": "Android||2024Oct01120000P|False|1.2.6|False|306|",
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("fetch successful");
      // get the day (day 1 or day 2)
      if (data.CourseTable.length > 0) {
        const cycleDayValue = data.CourseTable[0].StudentCourse.CycleDay;
        console.log('CycleDay:', cycleDayValue);
        setCycleDay(cycleDayValue);
      }

      const fetchedClasses = data.CourseTable.map((course) => ({
        ...course.StudentCourse,
        StartTime: new Date(course.StudentCourse.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/(AM|PM|am|pm|a\.m\.|p\.m\.)/g, '').trim(),
        EndTime: new Date(course.StudentCourse.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/(AM|PM|am|pm|a\.m\.|p\.m\.)/g, '').trim(),
      }));
      setClasses(fetchedClasses);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Hey {firstName}!</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Today's Timetable</Text>
          <Text style={styles.smallText}>Day {cycleDay}</Text>
        </View>
        <View style={styles.greyBox}>
          {classes.map((course, index) => (
            <View key={index} style={styles.rectangle}>
              <Text style={styles.rectangleText}>{course.ClassCode}  {course.TeacherName}</Text>
              <Text style={styles.rectangleText}>{course.StartTime} - {course.EndTime}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.announcementTitle}>Today's Announcements</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridHeading}>From</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridHeading}>Announcement</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridText}>Teacher A</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridText}>Meeting at 3 PM</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridText}>Teacher B</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridText}>Homework due tomorrow</Text>
          </View>
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
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 26,
    fontFamily: 'PhantomSans-Medium',
    color: '#F9FAFC',
  },
  smallText: {
    fontFamily: 'PhantomSans-Medium',
    fontSize: 20,
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
  rectangle: {
    width: '100%',
    height: 50,
    backgroundColor: '#F9FAFC',
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  rectangleText: {
    fontSize: 16,
    color: '#17171D',
    fontFamily: 'PhantomSans-Bold',
  },
  announcementTitle: {
    fontSize: 26,
    fontFamily: 'PhantomSans-Medium',
    color: '#F9FAFC',
    marginLeft: 20,
    marginTop: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  gridItem: {
    width: '48%',
    marginBottom: 10,
  },
  gridText: {
    fontSize: 16,
    color: '#F9FAFC',
    fontFamily: 'PhantomSans-Book',
  },
  gridHeading: {
    fontSize: 20,
    color: '#F9FAFC',
    fontFamily: 'PhantomSans-Bold',
  },
  navMenu: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFC',
    borderRadius: 30,
    alignSelf: 'center',
  },
  navButton: {
    padding: 2,
  },
  redLine: {
    width: '100%',
    height: 4,
    backgroundColor: 'red',
    marginTop: 2,
    borderRadius: 2,
  },
});

export default Home;