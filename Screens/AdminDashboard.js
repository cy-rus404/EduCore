import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const data = [
  { id: '1', title: 'Students', image: require('../assets/images/student.png'), route: 'Student' },
  { id: '2', title: 'Teachers', image: require('../assets/images/teacher.jpg'), route: 'Teacher' },
  { id: '3', title: 'Classes', image: require('../assets/images/class.jpg'), route: 'Class' },
  { id: '4', title: 'Messages', image: require('../assets/images/message.jpg'), route: 'Message' },
  { id: '6', title: 'Information', image: require('../assets/images/announce.jpg'), route: 'Announcement' },
  { id: '5', title: 'Settings', image: require('../assets/images/settings.jpg'), route: 'Settings' },

];

const AdminDashboard = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate(item.route)} style={styles.button}>
        <Image style={styles.png} source={item.image} />
        <Text style={[styles.txt, item.title === 'Announcement' && styles.centerText]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 30,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  container: {
    width: '100%',
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  txt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
  },
  centerText: {
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%', // Ensure it takes full width to center properly
  },
  png: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});
