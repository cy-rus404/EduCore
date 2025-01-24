import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const AdminDashboard = () => {
  const navigation = useNavigation();

  // Sample data for the FlatList
  const data = [
    { id: '1', title: 'Students', image: require('../assets/images/student.png'), screen: 'Student' },
    { id: '2', title: 'Teachers', image: require('../assets/images/teacher.png'), screen: 'Screen2' },
    { id: '3', title: 'Classes', image: require('../assets/images/class.png'), screen: 'Screen3' },
    { id: '4', title: 'Announcements', image: require('../assets/images/announcement.png'), screen: 'Screen4' },
    { id: '5', title: 'Messages', image: require('../assets/images/message.png'), screen: 'Screen5' },
    { id: '6', title: 'Settings', image: require('../assets/images/settings.png'), screen: 'Screen6' },
  ];

  // Function to render each item in the FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate(item.screen)} // Navigate to the specified screen
    >
      {item.image && <Image source={item.image} style={styles.image} />}
      <Text style={styles.text}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  flatListContent: {
    paddingVertical: 20,
  },
  container: {
    backgroundColor: '#fff',
    width: 300,
    height: 150,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
});