import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { supabase } from './supabase'; // Adjust the path based on your file structure
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null); // Clear any previous errors
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message); // Display error like "Invalid login credentials"
    } else {
      console.log('Logged in successfully:', data.user); // Handle successful login
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <Image source={require('./assets/images/logo.png')} style={styles.loginImage}/>
      <Text style={styles.title}>Welcome To EduCore</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText} onPress={()=>navigation.navigate('AdminDashboard')}>Log In</Text>

            
        </TouchableOpacity>
    </SafeAreaView>
  );
};


const styles= StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        padding:20,
    },

    title:{
        fontSize:24,
        marginBottom:20,
        textAlign:'center'
    },

    loginImage:{
        width:150,
        height:150,
        alignSelf:'center',
        marginBottom:10
    },

    input:{
        borderWidth:1,
        padding:10,
        marginBottom:10,
        borderRadius:5
    },

    loginButton:{
        backgroundColor:'#ff5733',
        padding: 15,
        borderRadius:5,
        alignItems:'center'
    },

    buttonText:{
        color:"#fff",
        fontSize:16,
    },

    error:{
        color:'red',
        marginBottom:10,
        textAlign:'center'
    }
})

// Styles remain the same
export default LoginScreen;