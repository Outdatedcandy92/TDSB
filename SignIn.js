import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; 


export default function SignIn({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRememberMe, setIsRememberMe] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleLogin = async () => {
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
            const data = await response.json();

            console.log("data: ",data);

            if (data.access_token) {
                await AsyncStorage.setItem('access_token', data.access_token);

                await Keychain.setGenericPassword(username, password);

                navigation.navigate('HomeTabs', {
                    screen: 'Home',
                  });
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconContainer}>
                <Ionicons name="arrow-back" size={24} color="#F9FAFC" />
            </TouchableOpacity>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Sign In</Text>
                <View style={styles.formContainer}>
                    <View style={styles.formGroup}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person" size={24} color="#F9FAFC" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="9 Digit Student Number"
                                placeholderTextColor="#F9FAFC"
                                value={username}
                                onChangeText={setUsername}
                            />
                        </View>
                    </View>
                    <View style={styles.formGroup}>
                        <View style={styles.passwordContainer}>
                            <Ionicons name="lock-closed" size={24} color="#F9FAFC" style={styles.inputIcon} />
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Password"
                                placeholderTextColor="#F9FAFC"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIconContainer}>
                                <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="#F9FAFC" style={styles.eyeIcon} />
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
                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
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
    backIconContainer: {
        position: 'absolute',
        top: 40,
        left: 16,
        padding: 8,
        zIndex: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 40,
        fontFamily: 'PhantomSans-Semibold',
        color: '#F9FAFC',
        marginBottom: 20,
        textAlign: 'left',
        width: '80%',
    },
    formContainer: {
        padding: 16,
        borderRadius: 8,
        width: '90%',
    },
    formGroup: {
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#F9FAFC',
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 8,
        color: '#F9FAFC',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#F9FAFC',
    },
    passwordInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 8,
        paddingRight: 40,
        color: '#F9FAFC',
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
        color: '#F9FAFC',
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#F9FAFC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonSelected: {
        height: 10,
        width: 10,
        borderRadius: 3,
        backgroundColor: '#EC3750',
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    button: {
        width: '60%',
        backgroundColor: '#EC3750',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#F9FAFC',
        fontFamily: 'PhantomSans-Semibold',
        fontSize: 23,
    },
});