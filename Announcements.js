import React, { useEffect, useState } from 'react';
import { View, StatusBar, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Announcements = ({ navigation, activeDate }) => {
  const [texts, setTexts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const schoolId = await AsyncStorage.getItem('school_code');
        if (!token) {
          throw new Error('No access token found');
        }

        const url = `https://zappsmaprd.tdsb.on.ca/api/Announcement/D2L/GetNews/${schoolId}/filter/Published/skip/0/take/1/sort/0`;

        const response = await fetch(url, {
          headers: {
            "X-Client-App-Info": "TDSBConnectsAPI||||0.0.0||2147483647|",
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();
        console.log(data);

        // Extract texts from the response and clean them
        const extractedTexts = data.map(item => {
          let cleanedText = item.NewsItem.Body.Text.replace(/[\r]+/g, ' ');
          cleanedText = cleanedText.split(' ').filter(word => word !== 'FROM' && word !== 'ANNOUNCEMENT').join(' '); // Remove unwanted words
          return cleanedText;
        });
        setTexts(extractedTexts);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [activeDate]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.pageTitle}>Announcements</Text>
      <ScrollView contentContainerStyle={styles.content}>
        {texts.map((text, index) => (
          <View key={index} style={styles.box}>
            <Text style={styles.text}>
              {text.replace(/FROM|ANNOUNCEMENT/g, '')}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#17171D',
  },
  pageTitle: {
    fontSize: 40,
    fontFamily: 'PhantomSans-Bold',
    color: '#F9FAFC',
    marginLeft: 20,
    marginTop: 40,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  box: {
    width: '100%',
    padding: 10,
    marginVertical: 6,
    borderRadius: 5,
  },
  text: {
    fontSize: 15,
    fontFamily: 'PhantomSans-Regular',
    color: '#F9FAFC',
    textAlign: 'left',
    flexWrap: 'wrap', // Ensure text wraps within the box
  },
});

export default Announcements;