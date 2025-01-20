import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function ErrorMessage({error}) {
        if (!error) return null;

  return (
    <View>
      <Text style={styles.error}>{error}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    error: {color:'red',marginLeft:10}
})