import { SafeAreaView, StyleSheet, Text, View, Image,TextInput, Button, Pressable } from 'react-native'
import { Formik } from 'formik';
import React from 'react'

function LoginScreen(props) {

  return(
    <SafeAreaView>
      <Image style={styles.logo}
      source={require('../assets/images/logo.png')}
      />

      <Formik
        initialValues={{email:'', password:''}}
        onSubmit={values => console.log(values)}
      >
        {({ handleChange, handleSubmit }) => (
          <>
                <TextInput style={styles.input}
        autoCapitalize='none'
        autoCorrect={false}
        icon='email'
        keyboardType='email-address'
        onChangeText={handleChange("email")}
        placeholder='Email'
        textContentType='emailAddress'
      />

      <TextInput style={styles.input1}
        autoCapitalize='none'
        autoCorrect={false}
        icon='lock'
        onChangeText={handleChange("password")}
        placeholder='Password'
        secureTextEntry={true}
        textContentType='password'
      
      />

<Pressable style={styles.button} onPress={handleSubmit}>
  <Text style={styles.buttonText}>Login</Text>
</Pressable>

          
          </>
        )}



      </Formik>



    </SafeAreaView>

  )
}

export default LoginScreen

const styles = StyleSheet.create({
  logo:{
    width:100,
    height:100,
    alignSelf:'center',
    marginTop:50,
    marginBottom:20
  },

  input:{
    backgroundColor:'#D3D3D3',
    height:50,
    margin:5,
    borderRadius:20,
    textAlign:'center',
    fontWeight:'bold'
  }, 
  input1:{
    backgroundColor:'#D3D3D3',
    height:50,
    margin:5,
    borderRadius:20,
    marginTop:20,
    textAlign:'center',
    fontWeight:'bold'
  },

  button:{
    backgroundColor:'#FF5733',
    height:50,
    margin:5,
    marginTop:20,
    borderRadius:20
  },
  buttonText:{
    color:'#FFFFFF',
    fontSize:20,
    fontWeight:'bold',
    textAlign:'center',
    marginTop:10,
  }



})