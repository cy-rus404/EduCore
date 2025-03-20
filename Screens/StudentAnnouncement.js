import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [expandedId, setExpandedId] = useState(null); // Track which announcement is expanded

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const q = query(collection(db, 'announcements'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const announcementList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(announcementList);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, 'announcements', id), { read: true });
      fetchAnnouncements(); // Refresh list
    } catch (error) {
      console.error('Error marking announcement as read:', error);
    }
  };

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null); // Collapse if already expanded
    } else {
      setExpandedId(id); // Expand the tapped announcement
      if (!announcements.find(ann => ann.id === id).read) {
        markAsRead(id); // Mark as read when expanding if unread
      }
    }
  };

  const renderAnnouncement = ({ item }) => {
    const isExpanded = expandedId === item.id;
    return (
      <TouchableOpacity
        style={[styles.announcementItem, item.read ? styles.read : styles.unread]}
        onPress={() => toggleExpand(item.id)}
      >
        <Text
          style={styles.announcementText}
          numberOfLines={isExpanded ? 0 : 3} // Show 3 lines when collapsed, unlimited when expanded
          ellipsizeMode="tail" // Truncate with "..." when not expanded
        >
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp?.toDate().toLocaleString()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screen}>
          <Text style={styles.title}>Announcements</Text>
          <FlatList
            data={announcements}
            renderItem={renderAnnouncement}
            keyExtractor={item => item.id}
            style={styles.list}
          />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screen: {
    flex: 1,
    paddingVertical: SCREEN_HEIGHT * 0.03,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: 'bold',
    color: '#FF5733',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  list: {
    flex: 1,
  },
  announcementItem: {
    padding: SCREEN_WIDTH * 0.03,
    borderRadius: 10,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  unread: {
    backgroundColor: '#ffe6e6',
  },
  read: {
    backgroundColor: '#f5f5f5',
  },
  announcementText: {
    fontSize: SCREEN_WIDTH * 0.045,
    color: '#333',
  },
  timestamp: {
    fontSize: SCREEN_WIDTH * 0.035,
    color: '#666',
    marginTop: SCREEN_HEIGHT * 0.005,
  },
});

export default StudentAnnouncements;