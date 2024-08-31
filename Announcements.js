import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

const Announcements = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.pageTitle}>Announcements</Text>

      <Text style={styles.title}>Feature Comming Soon</Text>
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
  title: {
    fontSize: 24,
    fontFamily: 'PhantomSans-Bold',
    color: '#F9FAFC',
    marginVertical: 20,
  },
});

export default Announcements;