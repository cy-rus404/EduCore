import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import ErrorMessage from './ErrorMessage';

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email").label("Email"),
  password: Yup.string().required("Password is required").min(4, "Password must be at least 4 characters").label("Password"),
});

function LoginScreen(props) {
  const navigation = useNavigation(); // Initialize navigation
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false); // Loader state

  return (
    <SafeAreaView>
      <Image
        style={styles.logo}
        source={require('../assets/images/logo.png')}
      />

      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={(values) => {
          const { email, password } = values;
          if (email === 'sduisaac@gmail.com' && password === 'Lynx2532') {
            setLoginError('');
            setLoading(true); // Start loading
            setTimeout(() => {
              setLoading(false); // Stop loading after 2 seconds
              navigation.navigate('AdminDashboard'); // Navigate to AdminDashboard
            }, 2000);
          } else {
            setLoginError('Incorrect login details');
          }
        }}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
          <>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onBlur={() => setFieldTouched("email")}
              onChangeText={handleChange("email")}
              placeholder="Email"
              textContentType="emailAddress"
            />
            <ErrorMessage error={errors.email} visible={touched.email} />

            <TextInput
              style={styles.input1}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChange("password")}
              onBlur={() => setFieldTouched("password")}
              placeholder="Password"
              secureTextEntry={true}
              textContentType="password"
            />
            <ErrorMessage error={errors.password} visible={touched.password} />

            {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

            {loading ? (
              <ActivityIndicator size="large" color="#FF5733" style={styles.loader} />
            ) : (
              <Pressable style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
              </Pressable>
            )}
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#D3D3D3',
    height: 50,
    margin: 5,
    borderRadius: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input1: {
    backgroundColor: '#D3D3D3',
    height: 50,
    margin: 5,
    borderRadius: 20,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FF5733',
    height: 50,
    margin: 5,
    marginTop: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
    alignSelf: 'center',
  },
});
