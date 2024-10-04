import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const AnnouncementDetail = ({ route, navigation }) => {
  const { title } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>{title}</Text>
      <Button title="Close" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#17171D',
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: 'PhantomSans-Bold',
    color: '#F9FAFC',
    marginBottom: 20,
  },
});

export default AnnouncementDetail;