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

const MAX_WIDTH = Dimensions.get('screen').width;

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
      toValue: -(MAX_WIDTH * newCurrentImage),
      useNativeDriver: true,
    }).start();

    setCurrentImage(newCurrentImage);
  };

  return (
    <PaperProvider>
      <View>
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
        <View>
          <Text style={styles.txt}>Welcome To EduCore</Text>
          <Text style={styles.txt2}>"Education Today</Text>
          <Text style={styles.txt3}>Leadership Tomorrow"</Text>

          {/* Buttons Row */}
          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              onPress={() => console.log('Sign Up Pressed')}
              style={styles.paperButton}
              contentStyle={styles.paperButtonContent}
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
  image: {
    height: 500,
    width: MAX_WIDTH,
  },
  container: {
    flexDirection: 'row',
  },
  indicatorContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: MAX_WIDTH,
    bottom: 10,
    zIndex: 2,
  },
  indicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderColor: 'white',
    borderWidth: 1,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
  txt: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    paddingTop: 30,
    color: 'blue',
    fontFamily: 'MonteCarlo',
  },
  txt2: {
    fontSize: 20,
    paddingTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  txt3: {
    fontSize: 20,
    paddingTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  paperButton: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  paperButtonContent: {
    height: 50,
  },
});

export default HomeScreen;
