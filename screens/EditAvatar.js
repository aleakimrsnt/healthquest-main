import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from '../firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import storeBank from './banks/StoreBank';

const EditAvatar = ({ navigation }) => {
    const [profilePic, setProfilePic] = useState('');
    const [username, setUsername] = useState('');
    const [boughtItems, setBoughtItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

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
                            setProfilePic('https://cdn.hero.page/pfp/894422f2-35d0-4fcc-a83b-c0ba647da537-monochrome-aesthetic-anime-boy-pfp-aesthetic-overview-3.png');
                        }
                    } else {
                        setProfilePic('Unknown');
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

        const unsubscribe = onSnapshot(doc(firestore, 'users', auth.currentUser.uid), (doc) => {
            if (doc.exists) {
                const userData = doc.data();
                if (userData && userData.username) {
                    setUsername(userData.username);
                }
            }
        });

        return () => {
            unsubscribe();
            setUsername('');
        };
    }, []);

    useEffect(() => {
        const fetchBoughtItems = async () => {
            try {
                const userId = auth.currentUser.uid;
                const boughtItemsRef = collection(firestore, `boughtItems/${userId}/items`);
                const querySnapshot = await getDocs(boughtItemsRef);
                const items = [];
                querySnapshot.forEach((doc) => {
                    const itemData = doc.data();
                    if (itemData.src) {
                        items.push(itemData.src);
                    }
                });
                setBoughtItems(items);
            } catch (error) {
                console.error('Error fetching bought items:', error);
                setError('Error fetching bought items: ' + error.message);
            }
        };
        fetchBoughtItems();
    }, []);

    // Function to handle item selection and open modal
    const handleItemSelect = (itemSrc) => {
        const selectedItem = storeBank.find((item) => item.src === itemSrc);
        setSelectedItem(selectedItem);
        setModalVisible(true);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleImageUpload = async () => {
        try {
            // Image upload logic
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Error uploading image: ' + error.message);
        }
    };

    const handleUse = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userEmail = currentUser.email;
                const userQuery = query(collection(firestore, 'users'), where('email', '==', userEmail));
                const userSnapshot = await getDocs(userQuery);
                if (!userSnapshot.empty) {
                    const userData = userSnapshot.docs[0].data();
                    const updatedUserData = { ...userData, src: selectedItem.src }; // Add selected avatar src to user data
                    const userId = userSnapshot.docs[0].id;
                    await updateDoc(doc(firestore, 'users', userId), updatedUserData); // Update user data in Firestore
                    console.log("Selected item src added to user data:", selectedItem.src);
                    setModalVisible(false); // Close the modal
                } else {
                    console.log("User not found");
                }
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            setError('Error updating user data: ' + error.message);
        }
    };
    
    

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.avatarContainer}>
                <Image source={{ uri: profilePic }} style={styles.avatarImage} />
                <TouchableOpacity style={styles.editButton} onPress={handleImageUpload}>
                    <Ionicons name="camera" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.boughtItemsContainer}>
                <Text style={styles.boughtItemsTitle}>Frames you bought</Text>
                {boughtItems.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => handleItemSelect(item)}>
                        <Image style={styles.boughtItem} source={{ uri: item }} />
                    </TouchableOpacity>
                ))}
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    {selectedItem && (
                        <View style={styles.modalContent}>
                            <Image source={{ uri: selectedItem.src }} style={styles.modalImage} />
                            <Text style={styles.modalName}>{selectedItem.name}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.useButton} onPress={handleUse}>
                                    <Text style={styles.buttonText}>Use</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </Modal>

        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191921',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    editButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 10,
        borderRadius: 20,
    },
    boughtItemsContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    boughtItemsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    boughtItem: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    modalName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    useButton: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginRight: 10,
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditAvatar;
