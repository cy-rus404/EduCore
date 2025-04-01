// AdminDashboard.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const dashboardData = [
  { id: '1', title: 'Students', image: require('../assets/images/student.png'), screen: 'User' },
  { id: '2', title: 'Teachers', image: require('../assets/images/teaching.jpg'), screen: 'AnalyticsScreen' },
  { id: '3', title: 'Classes', image: require('../assets/images/class.jpg'), screen: 'SettingsScreen' },
  { id: '4', title: 'Messages', image: require('../assets/images/message.jpg'), screen: 'ReportsScreen' },
  { id: '5', title: 'Announcements', image: require('../assets/images/announce.jpg'), screen: 'ContentScreen' },
  { id: '6', title: 'Notifications', image: require('../assets/images/attend.png'), screen: 'NotificationsScreen' },
  { id: '7', title: 'Settings', image: require('../assets/images/settings.jpg'), screen: 'ModerationScreen' },
];

const DashboardCard = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate(item.screen)}
      
    >

      <Image source={item.image} style={styles.cardImage} />
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
    
  );
};

const AdminDashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      <FlatList
        data={dashboardData}
        renderItem={({ item }) => <DashboardCard item={item} />}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default AdminDashboard;

