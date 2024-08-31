import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
    const [logs, setLogs] = useState([]);
    const scrollViewRef = useRef();

    useEffect(() => {
        setLogs(global.logs);

        const interval = setInterval(() => {
            setLogs([...global.logs]);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('access_token');
            console.log('Logged out successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Text style={styles.pageTitle}>Settings</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
            <ScrollView
                style={styles.logsContainer}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
                {logs.length > 0 ? (
                    logs.map((log, index) => (
                        <Text key={index} style={styles.logText}>{`> ${log}`}</Text>
                    ))
                ) : (
                    <Text style={styles.noLogsText}>No logs available</Text>
                )}
            </ScrollView>
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
    logoutButton: {
        backgroundColor: '#EC3750',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    logoutButtonText: {
        color: '#F9FAFC',
        fontSize: 16,
        fontFamily: 'PhantomSans-Bold',
    },
    logsContainer: {
        marginTop: 20,
        width: '100%',
        maxHeight: '50%',
        backgroundColor: '#2A2A2E',
        borderRadius: 5,
        padding: 10,
        paddingBottom: 20,
    },
    logText: {
        color: '#F9FAFC',
        fontSize: 14,
        fontFamily: 'PhantomSans-Regular',
        marginBottom: 15,
    },
    noLogsText: {
        color: '#F9FAFC',
        fontSize: 14,
        fontFamily: 'PhantomSans-Regular',
    },
});

export default Settings;