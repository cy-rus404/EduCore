import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

const StudentDashboard = ({ route, navigation }) => {
  const { studentName, studentId, level, image } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {image ? (
            <Image 
              source={{ uri: image }} 
              style={styles.profileImage} 
            />
          ) : (
            <Image 
              source={{ uri: 'https://via.placeholder.com/50' }} 
              style={styles.profileImage} 
            />
          )}
          <View>
            <Text style={styles.welcomeText}>Welcome, {studentName}</Text>
            <Text style={styles.levelText}>{level}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Student Profile</Text>
          <Text style={styles.infoText}>Student ID: {studentId}</Text>
          <Text style={styles.infoText}>Level: {level}</Text>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Image 
              source={require('../assets/images/class.jpg')} 
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>My Classes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Image 
              source={require('../assets/images/announce.jpg')} 
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Announcements</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Image 
              source={require('../assets/images/message.jpg')} 
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Image 
              source={require('../assets/images/settings.jpg')} 
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF5733',
    padding: 20,
    paddingTop: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  levelText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  contentContainer: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#fff',
    width: '48%',
    aspectRatio: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5733',
  },
});

export default StudentDashboard;