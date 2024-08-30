import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Calendar = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Announcements</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Calendar;