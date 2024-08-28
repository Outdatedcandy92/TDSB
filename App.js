import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './Home';
import SignIn from './SignIn';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccessToken = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };
    checkAccessToken();
  }, []);

  if (isLoading) {
    return null; // loading spinner later
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name="Home" component={Home} />
        ) : (
          <Stack.Screen name="SignIn" component={SignIn} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}