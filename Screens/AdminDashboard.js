import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const AdminDashboard = ({navigation}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Student')} style={styles.button}>
          <Image style={styles.png} source={require('../assets/images/student.png')}/>
          <Text style={styles.txt}>Students </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Student')} style={styles.button}>
          <Image style={styles.png} source={require('../assets/images/teacher.jpg')}/>
          <Text style={styles.txt}>Teachers </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Student')} style={styles.button}>
          <Image style={styles.png} source={require('../assets/images/class.jpg')}/>
          <Text style={styles.txt}>Classes </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Student')} style={styles.button}>
          <Image style={styles.png} source={require('../assets/images/message.png')}/>
          <Text style={styles.txt}>Messages </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Student')} style={styles.button}>
          <Image style={styles.png} source={require('../assets/images/settings.png')}/>
          <Text style={styles.txt}>Settings </Text>
        </TouchableOpacity>
      </View>


    </SafeAreaView>
  )
}

export default AdminDashboard

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f5f5f5', //    
    justifyContent: 'center', // 
    alignItems: 'center',
    paddingTop:30,

  },
  container: {
    width: 310,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center', // Center content inside
    shadowColor: "#000", // Add shadow for better UI
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
    marginBottom:20
  },
  txt: {
    fontSize: 18, // Bigger text for readability
    fontWeight: 'bold', // Make it stand out
    color: '#333',
    textAlign:"center",
    bottom:20
  },

  png:{
    width:150,
    height:100,
    paddingBottom:20,
    alignSelf:'center',
    resizeMode:'contain'
  },


})
