import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Dimensions, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');

const parseDateInput = (dateString) => {
  const day = parseInt(dateString.slice(0, 2), 10);
  const month = parseInt(dateString.slice(2, 4), 10) - 1;
  const year = parseInt(dateString.slice(4, 8), 10);
  return new Date(year, month, day);
};

const fdate = new Date();
const day = String(fdate.getDate()).padStart(2, '0');
const month = String(fdate.getMonth() + 1).padStart(2, '0');
const year = fdate.getFullYear();
const inputDate = `${day}${month}${year}`;

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(parseDateInput(inputDate));
  const [currentDate, setCurrentDate] = useState(parseDateInput(inputDate));
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const storedEvents = await AsyncStorage.getItem('events');

        //TODO: PROPER CHACHING
        if (storedEvents==="1") {  //null for now
          const events = JSON.parse(storedEvents);
          setEvents(Array.isArray(events) ? events : []);
          console.log('Fetched events from local storage:', events);
        } else {
          const token = await AsyncStorage.getItem('access_token');
          if (!token) {
            console.error('No access token found in local storage');
            return;
          }


          // const TimeMindateString = "09/02/2024 00:00:00";
          // const TimeMaxdateString = "10/02/2024 00:00:00";

          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();

          const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
          const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

          const TimeMinDateString = `${firstDayOfMonth.getMonth() + 1}/${firstDayOfMonth.getDate()}/${firstDayOfMonth.getFullYear()} 00:00:00`;
          const TimeMaxDateString = `${lastDayOfMonth.getMonth() + 1}/${lastDayOfMonth.getDate()}/${lastDayOfMonth.getFullYear()} 00:00:00`;

          const TimeMin = encodeURIComponent(TimeMinDateString);
          const TimeMax = encodeURIComponent(TimeMaxDateString);

          console.log('TimeMin:', TimeMin ,`\n`, 'TimeMax:', TimeMax);

          const url = `https://zappsmaprd.tdsb.on.ca/api/GoogleCalendar/GetEvents/1013?timeMin=${TimeMin}&timeMax=${TimeMax}`;
          const headers = {
            "X-Client-App-Info": "Android||2024Oct01120000P|False|1.2.6|False|306|False",
            "Authorization": `Bearer ${token}`
          };

          console.log('Fetching events with URL:', url);
          console.log('Headers:', headers);

          const response = await fetch(url, { headers });
          console.log('Response status:', response.status);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Fetched events:', data);
          setEvents(Array.isArray(data) ? data : []);
          await AsyncStorage.setItem('events', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]); // Fallback to an empty array on error
      }
    };

    fetchEvents();
  }, []);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfMonth = getFirstDayOfMonth(month, year);

    let days = [];
    let startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  };

  const calendarDays = generateCalendar();

  const handleDatePress = (date) => {
    setSelectedDate(date);
  };

  const stripHtmlTags = (htmlString) => {
    if (!htmlString) return null;

    return htmlString
      .replace(/<\/?b>/g, '')
      .replace(/<\/?p>/g, '')
      .replace(/<\/?ul>/g, '')
      .replace(/<li>/g, '')
      .replace(/<\/li>/g, '<br>')
      .split('<br>')
      .map((segment, index) => (
        <Text key={index} style={styles.eventDescription}>
          {segment.trim()}
        </Text>
      ));
  };

  const renderEvent = ({ item }) => (
    <View style={styles.eventContainer}>
      <Text style={styles.eventText}>{item.summary}</Text>
      <View>
        {stripHtmlTags(item.description)}
      </View>
    </View>
  );

  const normalizeDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate;
  };

  const adjustDate = (date, days) => {
    const adjustedDate = new Date(date);
    adjustedDate.setDate(adjustedDate.getDate() + days);
    return adjustedDate;
  };

  const filteredEvents = selectedDate
    ? events.filter(event => {
      const eventDate = normalizeDate(new Date(event.start.date));
      const selectedNormalizedDate = normalizeDate(adjustDate(selectedDate, -1));
      return eventDate.getTime() === selectedNormalizedDate.getTime();
    })
    : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.pageTitle}>Calendar</Text>
      <View style={styles.content}>
        <Text style={styles.title}>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </Text>
        <View style={styles.calendar}>
          {daysOfWeek.map((day, index) => (
            <View key={index} style={styles.dayOfWeekContainer}>
              <Text style={styles.dayOfWeekText}>{day}</Text>
            </View>
          ))}
          {calendarDays.map((date, index) => (
            <View key={index} style={styles.dateWrapper}>
              <TouchableOpacity
                style={[
                  styles.dateContainer,
                  selectedDate && date && selectedDate.toDateString() === date.toDateString()
                    ? styles.selectedDateContainer
                    : null,
                ]}
                onPress={() => date && handleDatePress(date)}
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedDate && date && selectedDate.toDateString() === date.toDateString()
                      ? styles.selectedDateText
                      : null,
                  ]}
                >
                  {date ? date.getDate() : ''}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {selectedDate && (
          filteredEvents.length > 0 ? (
            <FlatList
              data={filteredEvents}
              renderItem={renderEvent}
              keyExtractor={(item) => item.id}
              style={styles.eventList}
            />
          ) : (
            <Text style={styles.noEventsText}>No events exist for this date.</Text>
          )
        )}
      </View>
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
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'PhantomSans-Bold',
    color: '#F9FAFC',
    marginVertical: 20,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '80%',
    justifyContent: 'center',
  },
  dayOfWeekContainer: {
    width: screenWidth / 10,
    height: screenWidth / 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayOfWeekText: {
    fontSize: 14,
    fontFamily: 'PhantomSans-Medium',
    color: '#F9FAFC',
  },
  dateWrapper: {
    width: screenWidth / 10,
    height: screenWidth / 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'PhantomSans-Regular',
    color: '#F9FAFC',
  },
  selectedDateContainer: {
    backgroundColor: '#EC3750',
    borderRadius: screenWidth / 20,
  },
  selectedDateText: {
    color: '#F9FAFC',
    fontFamily: 'PhantomSans-Bold',
  },
  eventList: {
    marginTop: 20,
    width: '85%',
  },
  eventContainer: {
    backgroundColor: '#2A2A2E',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  eventText: {
    color: '#F9FAFC',
    fontSize: 16,
    fontFamily: 'PhantomSans-Bold',
  },
  eventDescription: {
    color: '#F9FAFC',
    fontSize: 14,
    fontFamily: 'PhantomSans-Regular',
  },
  noEventsText: {
    color: '#F9FAFC',
    fontSize: 16,
    marginTop: 20,
    fontFamily: 'PhantomSans-Regular',
  },
});

export default CalendarComponent;