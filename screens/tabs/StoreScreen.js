import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { View, Image, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused
import Header from '../Header'; // Assuming Header component exists and is imported properly
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, getDoc, addDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebaseConfig';
import storeBank from '../banks/StoreBank';

const StoreScreen = ({ navigation }) => {
  const [selectedItem, setSelectedItem] = useState(null); // Track the selected item for the modal
  const [modalVisible, setModalVisible] = useState(false); // State to control the modal visibility
  const [profilePic, setProfilePic] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [alreadyPurchasedModalVisible, setAlreadyPurchasedModalVisible] = useState(false);
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

  const [coins, setCoins] = useState(0);
  const isFocused = useIsFocused(); // Use useIsFocused hook to check if screen is focused

  const fetchCoins = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && isFocused) { // Check if the screen is focused before fetching data
        const userId = user.uid;

        const db = getFirestore();

        const docRef = doc(db, 'tasks', userId); // Reference the user's document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.coins) {
            setCoins(data.coins);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching coins:', error);
    }
  };

  useEffect(() => {
    fetchCoins(); // Initial data fetch when component mounts
  }, [isFocused]); // Add isFocused to the dependency array

  // Reload data when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCoins(); // Call fetchNumGlasses function when screen is focused
    });

    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  }, [navigation]); // Empty dependency array to run only once, effectively reloading the screen

  const handleItemPress = async (item) => {
    setSelectedItem(item);
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const db = getFirestore();
      const boughtItemsRef = collection(db, `boughtItems/${userId}/items`);
      const itemQuery = query(boughtItemsRef, where('src', '==', item.src));
      const itemSnapshot = await getDocs(itemQuery);
      if (!itemSnapshot.empty) {
        setAlreadyPurchasedModalVisible(true);
        return;
      }
    }
    setModalVisible(true);
  };


  const handleBuyItem = async () => {
    try {
      if (coins >= selectedItem.price) {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const db = getFirestore();
          const userDocRef = doc(db, 'tasks', userId);
          await updateDoc(userDocRef, { coins: coins - selectedItem.price });
          const timestamp = new Date();
          const boughtItemsRef = collection(db, `boughtItems/${userId}/items`);
          await addDoc(boughtItemsRef, {
            src: selectedItem.src,
            timeBought: timestamp
          });
          setModalVisible(false);
          fetchCoins();
          setSuccessModalVisible(true); // Show success modal
        }
      } else {
        Alert.alert('Not enough coins', 'You do not have enough coins to buy this item.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while buying the item. Please try again later.');
      console.error('Error buying item:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Header navigation={navigation} />

        <View style={styles.content}>
          <Image
            source={{ uri: 'https://cdn.glitch.global/e2a65d00-fdd9-474c-8348-7924d6cce742/coin.png?v=1710750524960' }}
            style={styles.coin}
          />
          <Text style={styles.text}>{coins}</Text>
        </View>

        {storeBank.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleItemPress(item)}>

            <View style={styles.rectangle} key={index}>
              <View style={styles.frame1cont}>
                <Image
                  source={{ uri: item.src }}
                  style={styles.frame1}
                />
                <Image
                  source={{ uri: profilePic }} // Replace with your image URL
                  style={styles.additionalImage}
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.itemtitle}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>
              </View>

              <View style={styles.price_cont}>
                <Image
                  source={{ uri: 'https://cdn.glitch.global/e2a65d00-fdd9-474c-8348-7924d6cce742/coin.png?v=1710750524960' }}
                  style={styles.coin_price}
                />
                <Text style={styles.price2}>{item.price}</Text>
              </View>
            </View>
          </TouchableOpacity>

        ))}
        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedItem && selectedItem.name}</Text>
              <Text style={styles.modalDesc}>{selectedItem && selectedItem.description}</Text>
              <View style={styles.modalImagesContainer}>
                <Image source={{ uri: selectedItem && selectedItem.src }} style={styles.modalImage} />
                <Image source={{ uri: profilePic }} style={styles.modalProfilePic} />
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={handleBuyItem}>
                  <Text style={styles.modalButtonText}>Buy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                  <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Success Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={successModalVisible}
          onRequestClose={() => setSuccessModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Success!</Text>
              <Text style={styles.modalDesc}>You've purchased an item.</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setSuccessModalVisible(false)}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        <Modal
          animationType="slide"
          transparent={true}
          visible={alreadyPurchasedModalVisible}
          onRequestClose={() => setAlreadyPurchasedModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Oops! You already purchased this item.</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setAlreadyPurchasedModalVisible(false)}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 100,
    backgroundColor: '#101424',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#101424', // Background color for StoreScreen
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    alignSelf: 'flex-start',
    marginLeft: 28,
  },
  coin: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: 1,
  },
  text: {
    fontSize: 23,
    color: '#FFFFFF',
    marginLeft: 10,
    marginTop: 5,
    fontFamily: 'Poppins-Regular',
  },
  desc: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 5,
    marginLeft: 11
  },
  coin_price: {
    marginTop: 70,
    width: 20,
    height: 20,
    marginLeft: 5,
    resizeMode: 'contain',

  },
  price: {
    marginTop: 74,
    fontSize: 15,
    color: '#FFFFFF',
    marginLeft: 5, // Adjusted margin for spacing
    fontFamily: 'Poppins-Regular'
  },
  price2: {
    marginTop: 74,
    fontSize: 15,
    color: '#FFFFFF',
    marginLeft: 5, // Adjusted margin for spacing
    fontFamily: 'Poppins-Regular'
  },
  frame1cont: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 29,
    marginLeft: 20
  },
  rectangle: {
    backgroundColor: '#212740',
    borderRadius: 20,
    marginBottom: 10,
    marginLeft: 18,
    marginRight: 18,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    width: 325,
    height: 120,
  },
  frame1: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
    position: 'absolute', // Absolute positioning
    zIndex: 1, // Ensures frame1 is above additionalImage
  },
  additionalImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginLeft: 7,
    zIndex: 0, // Ensures additionalImage is below frame1
    borderRadius: 100,
  },
  textContainer: {
    alignItems: 'flex-start', // Adjusted to align to the left
    marginLeft: 15, // Adjusted to add some left margin
    marginBottom: 25
  },
  itemtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    marginLeft: 10,
  },
  price_cont: {
    flexDirection: 'row',
    alignItems: 'center', // Align items horizontally
    position: 'absolute', // Position it absolutely
    bottom: 10, // Place it at the bottom
    right: 0, // Align it to the right
    marginRight: 20, // Add some right margin to the rectangle
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#101424',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalImagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginRight: 0,
    zIndex: 1,
  },
  modalProfilePic: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    marginLeft: 0,
    zIndex: 0,
    position: 'absolute',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#009387',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ff6347',
  },
  cancelButtonText: {
    color: '#fff',
  },
});


export default StoreScreen;