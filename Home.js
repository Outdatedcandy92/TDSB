import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [storedItem, setStoredItem] = useState(null);

  useEffect(() => {
    const fetchStoredItem = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token !== null) {
          console.log('Stored item:', token);
          setStoredItem(token);


          const url = 'https://zappsmaprd.tdsb.on.ca/api/Account/GetUserInfo';
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              "X-Client-App-Info": "Android||2024Oct01120000P|False|1.2.6|False|306|False"
            }
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('Response data:', data);
          const student_info = data['SchoolCodeList'][0]['StudentInfo'];

          console.log('Student Info:', student_info);
        } else {
          console.log('No item found in storage.');
        }
      } catch (error) {
        console.error('Failed to fetch the item from storage or send request', error);
      }
    };

    fetchStoredItem();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      setStoredItem(null);
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      {student_info ? (
        <>
          <Text>Name: {student_info.FirstName} {student_info.LastName}</Text>
          <Text>Age: {student_info.Age}</Text>
          <Text>Gender: {student_info.Gender}</Text>
          <Text>Grade: {student_info.CurrentGradeLevel}</Text>
        </>
      ) : (
        <Text>Loading student information...</Text>
      )}


      <Button title="Logout" onPress={handleLogout} />
    </View>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;