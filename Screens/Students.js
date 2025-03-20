import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView, // Added SafeAreaView import
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { db, auth } from './firebase';
import { setDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Map level numbers to new names for display
const levelNames = {
  100: 'Pre-school',
  200: 'Lower Primary',
  300: 'Upper Primary',
  400: 'JHS',
};

const Students = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log('User authenticated in Students:', currentUser.uid);
        initializeLevelsDoc();
      } else {
        console.log('No user is authenticated in Students. Redirecting to LoginScreen.');
        navigation.navigate('LoginScreen');
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const initializeLevelsDoc = async () => {
    try {
      console.log('Attempting to initialize levels document...');
      await setDoc(doc(db, 'students', 'levels'), { init: true }, { merge: true });
      console.log('Levels document initialized successfully');
    } catch (error) {
      console.error('Error initializing levels document:', error);
      Alert.alert('Error', 'Failed to initialize levels document: ' + error.message);
    }
  };

  const navigateToLevel = (level) => {
    // Keep the route names as Level100, Level200, etc.
    navigation.navigate(`Level${level}`);
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screen}>
          <Text style={styles.title}>Classes</Text>
          <View style={styles.levelContainer}>
            {[100, 200, 300, 400].map(level => (
              <TouchableOpacity
                key={level}
                style={styles.levelBox}
                onPress={() => navigateToLevel(level)}
              >
                {/* Display the new name instead of "Level {level}" */}
                <Text style={styles.levelText}>{levelNames[level]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Match screen background color
  },
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