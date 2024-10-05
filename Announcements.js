import React, { useEffect, useState } from 'react';
import { View, StatusBar, StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Announcements = ({ navigation, activeDate }) => {
  const [htmlContent, setHtmlContent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const schoolId = await AsyncStorage.getItem('school_code');
        if (!token) {
          throw new Error('No access token found');
        }

        console.log('Fetching Announcements');
        const url = `https://zappsmaprd.tdsb.on.ca/api/Announcement/D2L/GetNews/${schoolId}/filter/Published/skip/0/take/1/sort/0`;

        const response = await fetch(url, {
          headers: {
            "X-Client-App-Info": "TDSBConnectAPI||||0.0.0||2147483647|",
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();
        console.log(data);

        // Extract HTML content from the response
        const extractedHtml = data.map(item => item.NewsItem.Body.Html);
        setHtmlContent(extractedHtml);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [activeDate]);

  const renderHtmlContent = (html) => {
    // Remove specific attributes and tags
    const cleanedHtml = html
      .replace(/valign="top" style="width: 440.15pt;border-top: none;border-left: none;border-bottom: solid windowtext 1.5pt;border-right: solid windowtext 1.5pt;padding: 0in 5.4pt 0in 5.4pt;">/g, '')
      .replace(/valign="top" style="width: 98.25pt;border: solid windowtext 1.5pt;border-top: none;padding: 0in 5.4pt 0in 5.4pt;">/g, '')
      .replace(/valign="top" style="width: 440.15pt;border: solid windowtext 1.5pt;border-left: none;padding: 0in 5.4pt 0in 5.4pt;">/g, '')
      .replace(/valign="top" style="width: 98.25pt;border: solid windowtext 1.5pt;padding: 0in 5.4pt 0in 5.4pt;">/g, '')
      .replace(/&#160;/g, '')
      .replace(/&#39;/g, '');

    // Manually parse the cleaned HTML content and create React Native components
    const rows = cleanedHtml.split('<tr').slice(1).map(row => row.split('</tr>')[0]);
    return rows.map((row, rowIndex) => {
      const columns = row.split('<td').slice(1).map(col => col.split('</td>')[0]);
      return (
        <View key={rowIndex} style={styles.row}>
          {columns.map((col, colIndex) => {
            const content = col.replace(/<[^>]+>/g, '').replace(/\\/g, '').trim(); // Remove HTML tags and slashes
            console.log(content);
            return (
              <View key={colIndex} style={[styles.cell, colIndex === 0 ? styles.firstCell : styles.secondCell]}>
                <Text style={styles.text}>{content}</Text>
              </View>
            );
          })}
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.pageTitle}>Announcements</Text>
      <ScrollView contentContainerStyle={styles.content}>
        {htmlContent.map((html, index) => (
          <View key={index} style={styles.box}>
            {renderHtmlContent(html)}
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
    width: Dimensions.get('window').width, // Ensure full width
    alignItems: 'center',
  },
  box: {
    width: '100%',
    padding: 10,
    marginVertical: 6,
    borderRadius: 5,
    backgroundColor: '#282828', // Added background color for better visibility
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cell: {
    padding: 10,
  },
  firstCell: {
    flex: 1, // Less space for the first column
  },
  secondCell: {
    flex: 3, // More space for the second column
  },
  text: {
    fontSize: 15,
    fontFamily: 'PhantomSans-Regular',
    color: '#F9FAFC',
    textAlign: 'left',
  },
});

export default Announcements;