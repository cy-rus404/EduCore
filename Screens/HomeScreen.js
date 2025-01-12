import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import useInterval from './useInterval';  //  useInterval hook

const MAX_WIDTH = Dimensions.get('screen').width;

// Import local images
import image1 from '../assets/images/welcome.jpg';
import image2 from '../assets/images/success.jpg';
import image3 from '../assets/images/teaching.jpg';

// Add more imports for other images if needed

const images = [image1, image2, image3];  // Array of local images

const HomeScreen = ({navigation}) => {
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


    </View>
    <View style={styles.contain}>
      <TouchableOpacity onPress={()=>navigation.navigate('Login')} style={styles.btn}>
        <Text style={styles.txt4}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn2}>
        <Text style={styles.txt5}>Sign Up</Text>
      </TouchableOpacity>
            
    </View>
    </View>
  );
};

  // StyleSheet

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
  txt:{
    fontWeight:'bold',
    fontSize:30,
    textAlign:"center",
    paddingTop:30,
    color:'blue',
    fontFamily:'MonteCarlo'

  },

  txt2:{
    fontSize:20,
    paddingTop:20,
    textAlign:'center',
    fontWeight:'bold'
  },

  txt3:{
    fontSize:20,
    paddingTop:20,
    textAlign:'center',
    fontWeight:'bold'
  },
  contain:{
    flexDirection:'row',
    justifyContent:'space-between',
  },

  btn:{
    width:140,
    height:65,
    backgroundColor:'blue',
    marginTop:50,
    marginLeft:20,
    borderRadius:10
  }, 
  txt4:{
    fontSize:25,
    marginLeft: 38,
    marginTop:15,
    fontWeight:'bold',
    color:'#fff'
  }, 

  txt5:{
    fontSize:25,
    marginLeft: 25,
    marginTop:15,
    fontWeight:'bold',
    color:'#fff'
  }, 

  btn2:{
    width:140,
    height:65,
    backgroundColor:'blue',
    marginTop:50,
    marginRight:20,
    borderRadius:10
  }, 



});

export default HomeScreen;
