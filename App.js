import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home'; 
import { Ionicons } from '@expo/vector-icons'; 

const Stack = createStackNavigator();

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in both username and password.');
      return;
    }

    console.log({ username, password, isRememberMe });

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
      Alert.alert('Login Failed', 'Invalid username or password. Please try again.');
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
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!isPasswordVisible}
                      />
                      <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIconContainer}>
                        <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" style={styles.eyeIcon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.rememberMeContainer}>
                    <TouchableOpacity onPress={() => setIsRememberMe(!isRememberMe)} style={styles.radioButton}>
                      {isRememberMe && <View style={styles.radioButtonSelected} />}
                    </TouchableOpacity>
                    <Text style={styles.rememberMeText}>Remember Me</Text>
                  </View>
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
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingRight: 40,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
  eyeIcon: {
    height: 24,
    width: 24,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rememberMeText: {
    marginLeft: 8,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
  },
});