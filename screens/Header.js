import React, { useState, useEffect } from 'react';
import { View, Image, Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { auth, firestore } from '../firebaseConfig';

const Header = ({ navigation }) => {
  const [profilePic, setProfilePic] = useState('');
  const [src, setSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultProfilePic = 'https://cdn.hero.page/pfp/894422f2-35d0-4fcc-a83b-c0ba647da537-monochrome-aesthetic-anime-boy-pfp-aesthetic-overview-3.png';

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userEmail = currentUser.email;
          const userQuery = query(collection(firestore, 'users'), where('email', '==', userEmail));
          const userSnapshot = await getDocs(userQuery);
          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            if (userData.profilePic) {
              setProfilePic(userData.profilePic);
              setSrc(userData.src);
            } else {
              setProfilePic(defaultProfilePic);
            }
          } else {
            // User document not found, set default profile pic
            setProfilePic(defaultProfilePic);
          }
        }
      } catch (error) {
        setError('Error fetching user');
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfilePic();
  }, []);

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate('Community')}>
          <Ionicons name="people" size={40} color="white" style={styles.communityIcon} />
        </Pressable>
        
        
        <Pressable onPress={() => navigation.navigate('Profile')}>
  <View style={styles.profileContainer}>
    {!loading && (
      <Image source={{ uri: profilePic }} style={styles.profilePicture} />
    )}
    {src && ( // Check if src exists
      <Image source={{ uri: src }} style={[styles.profilePicture, styles.overlapProfile]} />
    )}
  </View>
</Pressable>

      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainer: {
    position: 'relative',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    bottom: -28,
    marginLeft: -45,
    position: 'absolute',
  },
  overlapProfile: {
    bottom: -28,
    marginLeft: -45,
  },
  communityIcon: {
    marginRight: 220, 
  },
});

export default Header;
