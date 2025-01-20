import React, { useEffect } from 'react';
import { View, Image, StyleSheet,Text } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home'); // Navigate to Home after 3 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
        <Image
  source={require('../assets/images/logo.png')}
  style={styles.image} 
/>
<Text style={styles.txt}>EduCore</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5733', // Background color 
  },
  image: {
    width: 100, 
    height: 100, 
  },

  txt:{
    fontSize: 20,
    fontWeight:'bold'
  }
});
