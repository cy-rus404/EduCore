import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  View,
  Text
} from 'react-native';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import useInterval from './useInterval'; // useInterval hook

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Import local images
import image1 from '../assets/images/welcome.jpg';
import image2 from '../assets/images/success.jpg';
import image3 from '../assets/images/teaching.jpg';

const images = [image1, image2, image3]; // Array of local images

const HomeScreen = ({ navigation }) => {
  const animation = useRef(new Animated.Value(0));
  const [currentImage, setCurrentImage] = useState(0);
  useInterval(() => handleAnimation(), 5000); // Automatically change images every 5 seconds

  const handleAnimation = () => {
    let newCurrentImage = currentImage + 1;

    if (newCurrentImage >= images.length) {
      newCurrentImage = 0;
    }

    Animated.spring(animation.current, {
      toValue: -(SCREEN_WIDTH * newCurrentImage),
      useNativeDriver: true,
    }).start();

    setCurrentImage(newCurrentImage);
  };

  return (
    <PaperProvider>
      <View style={styles.screen}>
        <View>
          <Animated.View
            style={[
              styles.container,
              {
                transform: [{ translateX: animation.current }],
              },
            ]}
          >
            {images.map((image, index) => (
              <Image key={index} source={image} style={styles.image} />
            ))}
          </Animated.View>
          <View style={styles.indicatorContainer}>
            {images.map((image, index) => (
              <View
                key={`${image}_${index}`}
                style={[
                  styles.indicator,
                  index === currentImage ? styles.activeIndicator : undefined,
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.txt}>Welcome To EduCore</Text>
          <Text style={styles.txt2}>"Education Today</Text>
          <Text style={styles.txt3}>Leadership Tomorrow"</Text>

          {/* Buttons Row */}
          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Login')}
              style={styles.paperButton}
              contentStyle={styles.paperButtonContent} buttonColor='blue'
            >
              Sign Up
            </Button>
            <Button
              mode="contained"
              onPress={() => console.log('Sign In Pressed')}
              style={styles.paperButton}
              contentStyle={styles.paperButtonContent}
            >
              Sign In
            </Button>
          </View>
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.5, // 50% of the screen height
    resizeMode: 'cover',
  },
  container: {
    flexDirection: 'row',
  },
  indicatorContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    bottom: 10,
    zIndex: 2,
  },
  indicator: {
    width: SCREEN_WIDTH * 0.03, // 3% of screen width
    height: SCREEN_WIDTH * 0.03,
    borderRadius: SCREEN_WIDTH * 0.015,
    borderColor: 'white',
    borderWidth: 1,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
  textContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.05, // 5% of screen width
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.03, // 3% of screen height
  },
  txt: {
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.08, // 8% of screen width
    textAlign: 'center',
    color: 'blue',
    fontFamily: 'MonteCarlo',
  },
  txt2: {
    fontSize: SCREEN_WIDTH * 0.05, // 5% of screen width
    marginTop: SCREEN_HEIGHT * 0.02, // 2% of screen height
    textAlign: 'center',
    fontWeight: 'bold',
  },
  txt3: {
    fontSize: SCREEN_WIDTH * 0.05, // 5% of screen width
    marginTop: SCREEN_HEIGHT * 0.01, // 1% of screen height
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SCREEN_HEIGHT * 0.2, // 20% of screen height
    width: '100%',
  },
  paperButton: {
    flex: 1,
    marginHorizontal: SCREEN_WIDTH * 0.02, // 2% of screen width
    borderRadius: SCREEN_WIDTH * 0.02, // 2% of screen width
  },
  paperButtonContent: {
    height: SCREEN_HEIGHT * 0.07, // 7% of screen height
  },
});

export default HomeScreen;
