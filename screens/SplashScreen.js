import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={{ uri: 'https://cdn.glitch.global/b9403491-4307-4eb7-a75a-d73f6b97dd83/Rescueguard%20(390%20x%20844%20px)%20(390%20x%20390%20px)%20(1).png?v=1710890733048' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#101424', 
  },
  logo: {
    width: '100%', 
    height: '100%', 
    resizeMode: 'contain', 
  },
});

export default SplashScreen;
