import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Alert, Image } from 'react-native';
import { Provider as PaperProvider, TextInput, Button, Text } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;
      const userUid = userCredential.user.uid;

      // Check if the user is an admin
      if (userEmail === 'admin@admin.com') {
        navigation.navigate('AdminDashboard');
        return;
      }

      // Check if the user is a teacher
      const teacherQuery = query(collection(db, 'teachers'), where('uid', '==', userUid));
      const teacherSnapshot = await getDocs(teacherQuery);
      if (!teacherSnapshot.empty) {
        navigation.navigate('TeachersDashboard');
        return;
      }

      // Default to StudentDashboard if not admin or teacher
      navigation.navigate('StudentDashboard');
    } catch (error) {
      Alert.alert('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.screen}>
        <Image
          style={styles.img}
          source={require('../assets/images/logo.png')}
        />
        <Text style={styles.title}>Login to EduCore</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          buttonColor="#FF5733"
          contentStyle={styles.buttonContent}
        >
          Login
        </Button>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: 'bold',
    color: '#FF5733',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.05,
  },
  input: {
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  button: {
    marginTop: SCREEN_HEIGHT * 0.03,
    borderRadius: SCREEN_WIDTH * 0.02,
  },
  buttonContent: {
    height: SCREEN_HEIGHT * 0.07,
  },
  img: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
});

export default LoginScreen;