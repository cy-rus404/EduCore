import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const AdminDashboard = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.txt}>Student</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.txt}>Student</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default AdminDashboard

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f5f5f5', // Light background for contrast
    justifyContent: 'center', // Center the button
    alignItems: 'center',
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
  },
  txt: {
    fontSize: 18, // Bigger text for readability
    fontWeight: 'bold', // Make it stand out
    color: '#333',
  }
})
