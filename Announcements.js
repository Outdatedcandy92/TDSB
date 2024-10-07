import React, { useEffect, useState } from 'react';
import { View, StatusBar, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Announcements = ({ navigation, activeDate }) => {
  const [htmlContent, setHtmlContent] = useState([]);
  const [title, setTitle] = useState(''); // Add state for title
  const [loading, setLoading] = useState(true); // Add loading state

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
            "X-Client-App-Info": "TDSBConnectAPI||||0.0||2147483647|",
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();
        console.log(data);

        // Directly access the first HTML content and title
        const extractedHtml = data[0].NewsItem.Body.Html;
        const extractedTitle = data[0].NewsItem.Title;
        setHtmlContent([extractedHtml]);
        setTitle(extractedTitle); // Set the title
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, [activeDate]);

  const renderHtmlContent = (html) => {
    const cleanedHtml = html
      .replace(/valign="top" style="width: 440.15pt;border-top: none;border-left: none;border-bottom: solid windowtext 1.5pt;border-right: solid windowtext 1.5pt;padding: 0in 5.4pt 0in 5.4pt;">/g, '')
      .replace(/valign="top" style="width: 98.25pt;border: solid windowtext 1.5pt;border-top: none;padding: 0in 5.4pt 0in 5.4pt;">/g, '')
      .replace(/valign="top" style="width: 440.15pt;border: solid windowtext 1.5pt;border-left: none;padding: 0in 5.4pt 0in 5.4pt;">/g, '')
      .replace(/valign="top" style="width: 98.25pt;border: solid windowtext 1.5pt;padding: 0in 5.4pt 0in 5.4pt;">/g, '')
      .replace(/&#160;/g, '')
      .replace(/&#39;/g, '');

    const rows = cleanedHtml.split('<tr').slice(1).map(row => row.split('</tr>')[0]);
    return rows.map((row, rowIndex) => {
      const columns = row.split('<td').slice(1).map(col => col.split('</td>')[0]);
      return (
        <View key={rowIndex} style={styles.row}>
          {columns.map((col, colIndex) => {
            const content = col.replace(/<[^>]+>/g, '').replace(/\\/g, '').trim();
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
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.pageTitle}>Announcements</Text>
      <Text style={styles.subTitle}>{title}</Text> 
      {loading ? (
        <ActivityIndicator size="large" color="#F9FAFC" /> // Show spinner while loading
      ) : (
        htmlContent.map((html, index) => (
          <View key={index}>
            {renderHtmlContent(html)}
          </View>
        ))
      )}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#17171D',
  },
  pageTitle: {
    fontSize: 40,
    fontFamily: 'PhantomSans-Bold',
    color: '#F9FAFC',
    marginLeft: 20,
    marginTop: 40,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 20,
    fontFamily: 'PhantomSans-Regular',
    color: '#F9FAFC',
    marginLeft: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10, // Ensure padding is applied
  },
  cell: {
    paddingHorizontal: 10, // Ensure padding is applied
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
  bottomPadding: {
    height: 150, // Add padding at the bottom
  },
});

export default Announcements;