import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ImageBackground, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../Header'; // Import Header component if it exists
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, getDoc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import your Firebase authentication instance

const Community = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState({});
  const inputRef = useRef(null); // Define inputRef here

  useEffect(() => {
    fetchUsersData().then((userData) => {
      setUserData(userData); // Set userData state
      fetchPosts(userData); // Pass userData to fetchPosts
    });
  }, []);

  // Handle sending a post
  const handleSend = async () => {
    try {
      // Check if inputText is not empty
      if (inputText.trim() === '') {
        return; // Exit function if inputText is empty
      }

      let imageUrl = '';

      // If an image is selected, upload it to Firebase Storage
      if (selectedImage) {
        const storage = getStorage();
        const filename = `images/${Date.now()}_${selectedImage.uri.split('/').pop()}`;
        const storageRef = ref(storage, filename);

        // Fetch image data from the URI
        const response = await fetch(selectedImage.uri);
        const blob = await response.blob();

        // Upload image to Firebase Storage
        await uploadBytes(storageRef, blob);

        // Get the download URL of the uploaded image
        imageUrl = await getDownloadURL(storageRef);
      }

      // Save post data to Firestore
      const db = getFirestore();
      await addDoc(collection(db, 'posts'), {
        statement: inputText,
        image: imageUrl,
        createdAt: serverTimestamp(),
        userId: getAuth().currentUser.uid, // Use current user's UID
      });

      // Clear input fields
      setInputText('');
      setSelectedImage(null);
    } catch (error) {
      console.error('Error sending post:', error);
    }
  };



  const fetchUsersData = async () => {
    const usersCollection = collection(getFirestore(), 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const data = {};

    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      data[userDoc.id] = { username: userData.username, profilePic: userData.profilePic };
    });

    return data;
  };

  const fetchPosts = async () => {
    try {
      const postsCollection = collection(getFirestore(), 'posts');
      const postsQuery = query(postsCollection, orderBy('createdAt', 'desc')); // Query posts in descending order of createdAt
      const postsSnapshot = await getDocs(postsQuery);
      const data = [];

      const userData = await fetchUsersData();

      postsSnapshot.forEach((postDoc) => {
        const postData = postDoc.data();
        const { createdAt, image, statement, userId } = postData;
        data.push({ id: postDoc.id, createdAt, image, statement, userId });
      });

      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };


  // Handle container press (to dismiss keyboard)
  const handleContainerPress = () => {
    inputRef.current.blur();
  };

  // Handle input blur
  const handleBlur = () => {
    setInputText('');
    setTimeout(() => {
      setInputText('');
    }, 100);
  };

  // Remove selected image
  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  // Open image gallery
  const openGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert('Permission to access the camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync();

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const selectedImage = pickerResult.assets[0];
        setSelectedImage(selectedImage);
      }
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };

  return (
    <ScrollView onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.centered}>
          <Header navigation={navigation} />
        </ View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={inputRef}
              style={styles.inputText}
              placeholder="What's on your mind?"
              placeholderTextColor="#8c8c8c"
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={3}
              maxHeight={120}
            />

            <TouchableOpacity onPress={openGallery}>
              <Ionicons name="cloud-upload-outline" size={24} color="#ffffff" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send" size={24} color="#ffffff" style={styles.icon} />
            </TouchableOpacity>

          </View>
          {selectedImage && (
            <View style={styles.selectedImageContainer}>
              <ImageBackground source={{ uri: selectedImage.uri }} style={styles.selectedImage}>
                <TouchableOpacity onPress={removeSelectedImage} style={styles.removeImageButton}>
                  <Ionicons name="close-circle-outline" size={24} color="#ffffff" />
                </TouchableOpacity>
              </ImageBackground>
              <Text style={styles.selectedImageText}>Selected Image</Text>
            </View>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.postsContainer}>
          {posts.map((post) => (
            <View key={post.id} style={styles.postItem}>
              {/* Display user info */}
              <View style={styles.userInfo}>
                <Image source={{ uri: userData[post.userId]?.profilePic }} style={styles.userProfilePic} />
                <Text style={styles.username}>{userData[post.userId]?.username}</Text>
              </View>
              {/* Display post content */}
              <Text style={styles.postText}>{post.statement}</Text>
              {post.createdAt && (
                <Text style={styles.postTime}>
                  {new Date(post.createdAt.toDate()).toLocaleString()}
                </Text>
              )}
              {/* Display post image if available */}
              {post.image && (
                <ImageBackground source={{ uri: post.image }} style={styles.postImage}>
                  <TouchableOpacity onPress={() => console.log('Image clicked')}>
                    <Text style={styles.imageOverlayText}>View Image</Text>
                  </TouchableOpacity>
                </ImageBackground>
              )}
              {/* Post actions */}
              <View style={styles.postActions}>
                <TouchableOpacity onPress={() => console.log('Heart clicked')}>
                  <Ionicons name="heart-outline" size={24} color="#ffffff" style={styles.postIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('Message clicked')}>
                  <Ionicons name="chatbubble-outline" size={24} color="#ffffff" style={styles.postIcon} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212740',
  },
  centered: {
    alignItems: 'center',
  },
  inputContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginHorizontal: 17,
    marginBottom: 20,
    marginTop: 17,
    borderRadius: 25,
    backgroundColor: '#191921',
    padding: 0,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    margin: 10,
  },
  sendButton: {
    padding: 3, // Add margin to separate the button from the input field
  },
  inputText: {
    color: '#ffffff',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  selectedImageContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  selectedImage: {
    width: 200,
    height: 200,
    justifyContent: 'flex-end',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 5,
  },
  selectedImageText: {
    color: '#ffffff',
    marginTop: 5,
  },
  postsContainer: {
    paddingTop: 10,
    paddingBottom: 50, // Add padding to the bottom to prevent content from being hidden behind the navigation bar
  },
  postItem: {
    backgroundColor: '#101424',
    borderRadius: 17,
    padding: 15,
    marginBottom: 20,
    width: '90%', // Use percentage width for better responsiveness
    alignSelf: 'center',
  },
  postText: {
    color: '#ffffff',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    justifyContent: 'flex-end',
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageOverlayText: {
    color: '#ffffff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
  },
  postActions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between', // Align icons to the left and right
  },
  postIcon: {
    fontSize: 28,
    color: '#ffffff',
  },
  postTime: {
    color: '#3E4460',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    color: '#ffffff',
    marginLeft: 10,
  },
  userProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Community;
