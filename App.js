import * as React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignIn from './SignIn'; 
import Home from './Home'; 

const Stack = createStackNavigator();

function App() {
  const [fontsLoaded] = useFonts({
    'PhantomSans-Bold': require('./assets/fonts/PhantomSans-Bold.ttf'),
    'PhantomSans-Regular': require('./assets/fonts/PhantomSans-Regular.ttf'),
    'PhantomSans-Book': require('./assets/fonts/PhantomSans0.5-Book.ttf'),
    'PhantomSans-Medium': require('./assets/fonts/PhantomSans0.5-Medium.ttf'),
    'PhantomSans-Semibold': require('./assets/fonts/PhantomSans0.5-Semibold.ttf'),
  });

  const [initialRoute, setInitialRoute] = React.useState(null);

  React.useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('access_token');
      setInitialRoute(token ? 'Home' : 'SignIn');
    };
    checkToken();
  }, []);

  if (!fontsLoaded || initialRoute === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;