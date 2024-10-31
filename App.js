import * as React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SignIn from './SignIn';
import Home from './Home';
import Timetable from './Timetable';
import Calendar from './Calendar';
import Announcements from './Announcements';
import Settings from './Settings';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

global.logs = [];


const originalConsoleLog = console.log;
console.log = (...args) => {
  originalConsoleLog(...args);
  global.logs.push(args.join(' '));
};

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Timetable') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Announcements') {
            iconName = focused ? 'megaphone' : 'megaphone-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: '10%',
          right: '10%',
          backgroundColor: '#f8f8f8',
          borderRadius: 20,
          height: 60,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Timetable" component={Timetable} />
      <Tab.Screen name="Announcements" component={Announcements} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

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
      console.log('token successfully retrieved:', token);
  
      if (token) {
        const refreshTokenExpiry = await AsyncStorage.getItem('refresh_token_expiry');
        console.log('refresh_token_expiry:', refreshTokenExpiry);
  
        // Calculate days left before token expiry
        const expiryDate = new Date(refreshTokenExpiry);
        const currentDate = new Date();
        const timeDifference = expiryDate - currentDate;
        const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  
        console.log('Days left until refresh token expiry:', daysLeft);

        if (daysLeft <= 2) {
          const url = 'https://zappsmaprd.tdsb.on.ca/token';

          const payload = new URLSearchParams({
            refresh_token: data.refresh_token,
            grant_type: 'refresh_token',
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

            console.log("data: ", data);
            AsyncStorage.setItem('access_token', data.access_token);
            AsyncStorage.setItem('refresh_token', data.refresh_token);
            AsyncStorage.setItem('refresh_token_expiry', data['.expires']);
          } catch (error) {
            console.error("Error fetching token: ", error);
          }
        } else {

        }
  
        setInitialRoute('HomeTabs');
      } else {
        setInitialRoute('SignIn');
      }
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
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
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