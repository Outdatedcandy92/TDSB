import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Home = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [cycleDay, setCycleDay] = useState(null);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      setStoredItem(null);
      setStudentInfo(null);
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found');
      }
      const date = "06092024";
      const response = await fetch(`https://zappsmaprd.tdsb.on.ca/api/TimeTable/GetTimeTable/Student/1013/${date}`, { //get school code from student info
        method: 'GET',
        headers: {
          "X-Client-App-Info": "Android||2024Oct01120000P|False|.2.6|False|306|",
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

      const timeRanges = [
        "9:00-10:20",
        "10:25-11:40",
        "12:40-1:55",
        "2:00-3:15"
      ];

      const fetchedClasses = data.CourseTable.map((course, index) => ({
        ...course.StudentCourse,
        time: timeRanges[index]
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
        <Text style={styles.title}>Hey Joe!</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Today's Timetable</Text>
          <Text style={styles.smallText}>Day {cycleDay}</Text>
        </View>
        <View style={styles.greyBox}>
          {classes.map((course, index) => (
            <View key={index} style={styles.rectangle}>
              <Text style={styles.rectangleText}>{course.ClassCode} - {course.TeacherName}</Text>
              <Text style={styles.rectangleText}>{course.time}</Text>
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
      <View style={styles.navMenu}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Screen1')}>
          <Ionicons name="home-outline" size={36} color="#17171D" />
          <View style={styles.redLine} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Screen2')}>
          <Ionicons name="school-outline" size={36} color="#17171D" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Screen3')}>
          <Ionicons name="megaphone-outline" size={36} color="#17171D" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleLogout}>
          <Ionicons name="calendar-outline" size={36} color="#17171D" />
        </TouchableOpacity>
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