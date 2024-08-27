import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home'; 

const Stack = createStackNavigator();

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAccessToken = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        setIsLoggedIn(true);
      }
    };

    checkAccessToken();
  }, []);

  const handleLogin = async () => {
    console.log({ username, password, isSwitchOn });

    const url = 'https://zappsmaprd.tdsb.on.ca/token'; 

    const payload = new URLSearchParams({
      username: username,
      password: password,
      grant_type: 'password',
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Client-App-Info": "Android||2024Oct01120000P|False|1.2.6|False|306|",
          "Accept": "application/json"
        },
        body: payload.toString(),
      });

      if (!response.ok) {
        console.log(await response.text());
        console.log(response);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Login successful', data);

      await AsyncStorage.setItem('access_token', data.access_token);
      console.log('Access token stored successfully');
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name="Home" component={Home} />
        ) : (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {() => (
              <View style={styles.container}>
                <View style={styles.navbar}>
                  <Text style={styles.navbarBrand}>TDSB Connects +</Text>
                </View>
                <View style={styles.formContainer}>
                  <View style={styles.formGroup}>
                    <TextInput
                      style={styles.input}
                      placeholder="9 Digit Student Number"
                      value={username}
                      onChangeText={setUsername}
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                  <Switch
                    value={isSwitchOn}
                    onValueChange={setIsSwitchOn}
                  />
                  <Button title="Login" onPress={handleLogin} />
                </View>
              </View>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  navbar: {
    height: 60,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7',
  },
  navbarBrand: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
  },
});