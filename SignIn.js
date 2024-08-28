import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SignIn({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch("https://zappsmaprd.tdsb.on.ca/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Client-App-Info": "Android||2024Oct01120000P|False|1.2.6|False|306|False",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password,
          grant_type: "password",
        })
      });
      const data = await response.json();
      if (data.access_token) {
        await AsyncStorage.setItem('access_token', data.access_token);
        navigation.navigate('Home');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconContainer}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>TDSB Connects +</Text>
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
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#17171D',
  },
  navbar: {
    height: 60,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7',
    paddingHorizontal: 16,
  },
  backIconContainer: {
    padding: 8,
  },
  formContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'left',
  },
  formGroup: {
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
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
    color: '#fff',
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
  buttonContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  button: {
    width: '50%',
  },
});