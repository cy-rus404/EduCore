import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { db, auth } from './firebase';
import { setDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const levelNames = {
  Kindergarten: 'Kindergarten',
  'Lower Primary': 'Lower Primary',
  'Upper Primary': 'Upper Primary',
  JHS: 'JHS',
};

const Students = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log('User authenticated in Students:', currentUser.uid, 'Email:', currentUser.email);
        if (currentUser.email === 'admin@admin.com') {
          initializeLevelsDoc();
        }
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
      await setDoc(doc(db, 'students', 'levels'), { init: true, lastUpdated: new Date().toISOString() }, { merge: true });
      console.log('Levels document initialized successfully');
    } catch (error) {
      console.error('Error initializing levels document:', error);
      Alert.alert('Error', 'Failed to initialize levels document: ' + error.message);
    }
  };

  const navigateToLevel = (level) => {
    navigation.navigate(`Level${level}`, { level });
  };

  const levels = ['Kindergarten', 'Lower Primary', 'Upper Primary', 'JHS'];

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screen}>
          <Text style={styles.title}>Classes</Text>
          <View style={styles.levelContainer}>
            {levels.map(level => (
              <TouchableOpacity
                key={level}
                style={styles.levelBox}
                onPress={() => navigateToLevel(level)}
              >
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
    backgroundColor: '#fff',
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