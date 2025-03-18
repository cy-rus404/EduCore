import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const levels = [
  { id: '1', level: 'Level 100' },
  { id: '2', level: 'Level 200' },
  { id: '3', level: 'Level 300' },
  { id: '4', level: 'Level 400' },
];

const Student = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.levelButton}
      onPress={() => navigation.navigate('Level', { level: item.level })}
    >
      <Text style={styles.levelText}>{item.level}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={levels}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 50,
    marginTop:50
  },
  levelButton: {
    padding: 20,
    backgroundColor: '#FF5733',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  levelText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Student;












































