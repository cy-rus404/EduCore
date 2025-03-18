import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Messages = ({ route, navigation }) => {
  const { studentId } = route.params; // Get studentId from StudentDashboard
  const [announcements, setAnnouncements] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load announcements and student-specific read status
  const loadAnnouncements = async () => {
    try {
      const storedAnnouncements = await AsyncStorage.getItem('announcements');
      const storedReadStatus = await AsyncStorage.getItem(`readStatus_${studentId}`);
      let readStatus = storedReadStatus ? JSON.parse(storedReadStatus) : {};

      const announcements = storedAnnouncements ? JSON.parse(storedAnnouncements) : [];
      // Sort by timestamp, newest first
      const sortedAnnouncements = announcements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      // Update read status for this student
      const updatedAnnouncements = sortedAnnouncements.map(ann => ({
        ...ann,
        read: readStatus[ann.id] || false, // Per-student read status
      }));

      setAnnouncements(updatedAnnouncements);
      const unread = updatedAnnouncements.filter(ann => !ann.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to load announcements', error);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // Mark a message as read
  const markAsRead = async (messageId) => {
    try {
      const updatedAnnouncements = announcements.map(ann =>
        ann.id === messageId ? { ...ann, read: true } : ann
      );
      setAnnouncements(updatedAnnouncements);

      const readStatus = {};
      updatedAnnouncements.forEach(ann => {
        readStatus[ann.id] = ann.read;
      });
      await AsyncStorage.setItem(`readStatus_${studentId}`, JSON.stringify(readStatus));
      setUnreadCount(updatedAnnouncements.filter(ann => !ann.read).length);
    } catch (error) {
      console.error('Failed to mark message as read', error);
    }
  };

  // Delete a message
  const deleteMessage = async (messageId) => {
    try {
      const updatedAnnouncements = announcements.filter(ann => ann.id !== messageId);
      await AsyncStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
      setAnnouncements(updatedAnnouncements);
      setUnreadCount(updatedAnnouncements.filter(ann => !ann.read).length);
      setSelectedMessage(null); // Close modal if deleted message was open
    } catch (error) {
      console.error('Failed to delete message', error);
    }
  };

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => {
        setSelectedMessage(item);
        if (!item.read) markAsRead(item.id); // Mark as read when clicked
      }}
    >
      <Text style={[styles.messageText, !item.read && styles.unreadText]}>
        {item.text.length > 50 ? `${item.text.substring(0, 50)}...` : item.text}
      </Text>
      <Text style={styles.messageTimestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteMessage(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderMessageModal = () => (
    <Modal
      visible={!!selectedMessage}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setSelectedMessage(null)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Message</Text>
          <Text style={styles.modalText}>{selectedMessage?.text}</Text>
          <Text style={styles.modalTimestamp}>
            {selectedMessage && new Date(selectedMessage.timestamp).toLocaleString()}
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="Close" onPress={() => setSelectedMessage(null)} />
            <Button title="Delete" color="red" onPress={() => deleteMessage(selectedMessage.id)} />
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      {announcements.length > 0 ? (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noMessagesText}>No messages available.</Text>
      )}
      {renderMessageModal()}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  listContainer: {
    paddingBottom: 20,
  },
  messageItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    width:350,
    alignSelf:'center'
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  unreadText: {
    fontWeight: 'bold',
    color: '#FF5733',
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF3333',
    padding: 5,
    borderRadius: 5,
    
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalTimestamp: {
    fontSize: 12,
    color: '#888',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    
  },
  noMessagesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width:350,
    alignSelf:'center'

  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Messages;