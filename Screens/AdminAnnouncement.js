import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AdminAnnouncements = ({ navigation }) => {
  const [announcementText, setAnnouncementText] = useState('');

  const handleSendAnnouncement = async () => {
    if (!announcementText.trim()) {
      alert('Please enter an announcement');
      return;
    }

    try {
      await addDoc(collection(db, 'announcements'), {
        text: announcementText,
        timestamp: serverTimestamp(),
        read: false,
      });
      alert('Announcement sent successfully');
      setAnnouncementText('');
    } catch (error) {
      console.error('Error sending announcement:', error);
      alert('Failed to send announcement');
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjusts behavior based on platform
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Fine-tune offset if needed
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled" // Ensures taps work even with keyboard open
          >
            <View style={styles.screen}>
              <Text style={styles.title}>Admin Announcements</Text>
              <TextInput
                style={styles.input}
                placeholder="Type your announcement here..."
                value={announcementText}
                onChangeText={setAnnouncementText}
                multiline
              />
              <Button
                mode="contained"
                onPress={handleSendAnnouncement}
                style={styles.button}
                buttonColor="#FF5733"
                contentStyle={styles.buttonContent}
              >
                Send Announcement
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1, // Allows content to grow within ScrollView
    paddingVertical: SCREEN_HEIGHT * 0.03,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  screen: {
    flex: 1,
    justifyContent: 'space-between', // Ensures button stays at bottom when possible
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: 'bold',
    color: '#FF5733',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: SCREEN_WIDTH * 0.03,
    fontSize: SCREEN_WIDTH * 0.045,
    marginBottom: SCREEN_HEIGHT * 0.03,
    textAlignVertical: 'top',
    minHeight: SCREEN_HEIGHT * 0.2, // Minimum height to ensure visibility
  },
  button: {
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.5,
  },
  buttonContent: {
    height: SCREEN_HEIGHT * 0.07,
  },
});

export default AdminAnnouncements;