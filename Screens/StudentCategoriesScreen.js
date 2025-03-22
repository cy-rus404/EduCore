import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import studentImage from '../assets/images/student.png';

const StudentCategoriesScreen = ({ navigation }) => {
  const categories = [
    'Creche', 'Nursery', 'Kindergarten 1', 'Kindergarten 2',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'JHS 1', 'JHS 2', 'JHS 3'
  ];

  const navigateToCategory = (category) => {
    navigation.navigate('StudentList', { category });
  };

  const rows = [];
  for (let i = 0; i < categories.length; i += 2) {
    rows.push(categories.slice(i, i + 2));
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Student Categories</Text>
      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((category, index) => (
              <Card
                key={index}
                style={styles.card}
                onPress={() => navigateToCategory(category)}
              >
                <Card.Cover
                  source={studentImage}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <Card.Content style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{category}</Text>
                </Card.Content>
              </Card>
            ))}
            {row.length === 1 && <View style={styles.placeholder} />}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF5733',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    width: '48%',
    elevation: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    height: 120,
  },
  cardContent: {
    backgroundColor: '#FF5733',
    paddingVertical: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  placeholder: {
    width: '48%',
  },
});

export default StudentCategoriesScreen;