import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';

const AdminDashboard = () => {
  const boxes = [
    { id: 1, label: 'Students', icon: require('../assets/images/student.png') },
    { id: 2, label: 'Teachers', icon: require('../assets/images/teacher.png') },
    { id: 3, label: 'Classes', icon: require('../assets/images/class.png') },
    { id: 4, label: 'Box 4', icon: require('../assets/images/logo.png') },
    { id: 5, label: 'Messages', icon: require('../assets/images/message.png') },
    { id: 6, label: 'Settings', icon: require('../assets/images/settings.png') },

  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.grid}>
        {boxes.map((box) => (
          <TouchableOpacity key={box.id} style={styles.box}>
            <Image source={box.icon} style={styles.icon} />
            <Text style={styles.boxText}>{box.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f6f4',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%',
  },
  box: {
    width: '45%', // Ensures two boxes per row with spacing
    height: 150,
    backgroundColor: '#FF5733',
    marginBottom: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10, // Space between icon and text
  },
  boxText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
