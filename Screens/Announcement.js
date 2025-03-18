import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Announcement = ({ navigation }) => {
  const [announcementText, setAnnouncementText] = useState('');
  const [announcements, setAnnouncements] = useState([]);

  // Load existing announcements from AsyncStorage
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const storedAnnouncements = await AsyncStorage.getItem('announcements');
        if (storedAnnouncements) {
          setAnnouncements(JSON.parse(storedAnnouncements));
        }
      } catch (error) {
        console.error('Failed to load announcements', error);
      }
    };
    loadAnnouncements();
  }, []);

  // Save announcement to AsyncStorage
  const saveAnnouncement = async () => {
    if (!announcementText.trim()) {
      Alert.alert('Error', 'Please enter an announcement.');
      return;
    }

    const newAnnouncement = {
      id: Date.now().toString(),
      text: announcementText,
      timestamp: new Date().toISOString(),
      read: false, // Mark as unread initially
    };

    const updatedAnnouncements = [...announcements, newAnnouncement];
    try {
      await AsyncStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
      setAnnouncements(updatedAnnouncements);
      setAnnouncementText('');
      Alert.alert('Success', 'Announcement sent successfully!');
      navigation.goBack(); // Return to AdminDashboard
    } catch (error) {
      console.error('Failed to save announcement', error);
      Alert.alert('Error', 'Failed to send announcement.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Send Announcement</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your announcement here"
        placeholderTextColor="#888"
        value={announcementText}
        onChangeText={setAnnouncementText}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.sendButton} onPress={saveAnnouncement}>
        <Text style={styles.sendButtonText}>Send Announcement</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    height: 110,
    width:320,
    textAlignVertical: 'top',
    alignSelf:"center"
  },
  sendButton: {
    backgroundColor: '#FF5733',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    width:320,
    alignSelf:"center"


  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    
  },
  backButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width:320,
    alignSelf:"center"

  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Announcement;