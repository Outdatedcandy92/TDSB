import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Home = ({ navigation }) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Hey Joe!</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Today's Timetable</Text>
          <Text style={styles.smallText}>Day 1</Text>
        </View>
        <View style={styles.greyBox}>
          <View style={styles.rectangle} />
          <View style={styles.rectangle} />
          <View style={styles.rectangle} />
          <View style={styles.rectangle} />
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
    padding: 10,
  },
  rectangle: {
    width: '100%',
    height: 50,
    backgroundColor: '#F9FAFC',
    marginBottom: 10,
    borderRadius: 10,
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