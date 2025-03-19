import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { db } from './firebase';
import { setDoc, doc } from 'firebase/firestore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Students = ({ navigation }) => {
  const navigateToLevel = (level) => {
    navigation.navigate(`Level${level}`);
  };

  useEffect(() => {
    const initializeLevelsDoc = async () => {
      try {
        await setDoc(doc(db, 'students', 'levels'), { init: true }, { merge: true });
        console.log('Levels document initialized');
      } catch (error) {
        console.error('Error initializing levels document:', error);
      }
    };
    initializeLevelsDoc();
  }, []);

  return (
    <PaperProvider>
      <View style={styles.screen}>
        <Text style={styles.title}>Students</Text>
        <View style={styles.levelContainer}>
          {[100, 200, 300, 400].map(level => (
            <TouchableOpacity
              key={level}
              style={styles.levelBox}
              onPress={() => navigateToLevel(level)}
            >
              <Text style={styles.levelText}>Level {level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: SCREEN_HEIGHT * 0.03,
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: 'bold',
    color: '#FF5733',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  levelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  levelBox: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_HEIGHT * 0.1,
    margin: SCREEN_WIDTH * 0.02,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  levelText: {
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Students;