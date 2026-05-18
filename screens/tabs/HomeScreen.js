import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Button, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused
import Header from '../Header';
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BarChart } from 'react-native-chart-kit';

const HomeScreen = ({ navigation }) => {
  const [numGlasses, setNumGlasses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [eaten, setEaten] = useState('');
  const isFocused = useIsFocused(); // Use useIsFocused hook to check if screen is focused
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [nutrientsSum, setNutrientsSum] = useState({ fats: 0, fiber: 0, otherNutrients: 0, protein: 0 });
  const [claimedToday, setClaimedToday] = useState(false); // State to track if rewards are claimed today

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const fetchNumGlasses = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && isFocused) { // Check if the screen is focused before fetching data
        const userId = user.uid;

        const db = getFirestore();
        const currentDate = new Date();
        const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const dateToday = currentDate.toLocaleDateString('en-US', dateOptions);

        const docRef = doc(db, 'tasks', userId, dateToday, 'waterIntake');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.numGlasses) {
            setNumGlasses(data.numGlasses);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching numGlasses:', error);
    }
  };

  useEffect(() => {
    fetchNumGlasses(); // Initial data fetch when component mounts
  }, [isFocused]); // Add isFocused to the dependency array

  // Reload data when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchNumGlasses(); // Call fetchNumGlasses function when screen is focused
    });

    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  }, [navigation]); // Empty dependency array to run only once, effectively reloading the screen

  const fetchTimeLeft = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && isFocused) { // Check if the screen is focused before fetching data
        const userId = user.uid;

        const db = getFirestore();
        const currentDate = new Date();
        const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const dateToday = currentDate.toLocaleDateString('en-US', dateOptions);

        const docRef = doc(db, 'tasks', userId, dateToday, 'exercise'); // Assuming the document structure is similar to the water intake example
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.timeLeft) {
            setTimeLeft(data.timeLeft);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching timeLeft:', error);
    }
  };

  useEffect(() => {
    fetchTimeLeft(); // Initial data fetch when component mounts
  }, [isFocused]); // Add isFocused to the dependency array

  // Reload data when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTimeLeft(); // Call fetchTimeLeft function when screen is focused
    });

    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  }, [navigation]); // Empty dependency array to run only once, effectively reloading the screen

  const fetchFruitsAndVeggies = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && isFocused) { // Check if the screen is focused before fetching data
        const userId = user.uid;
  
        const db = getFirestore();
        const currentDate = new Date();
        const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const dateToday = currentDate.toLocaleDateString('en-US', dateOptions);
  
        const userDocRef = doc(db, 'tasks', userId);
        const docRef = doc(collection(userDocRef, dateToday), 'fruitsAndVeggies');
  
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.eaten === 'Yes' && data.nutritionNinja !== '100') {
            // Update the nutritionNinja field to '100'
            await updateDoc(userDocRef, { nutritionNinja: '100' });
          }
          setEaten(data.eaten);
        }
      }
    } catch (error) {
      console.error('Error fetching eaten value:', error);
    }
  };
  
  
  useEffect(() => {
    fetchFruitsAndVeggies(); // Initial data fetch when component mounts
  }, [isFocused]); // Add isFocused to the dependency array
  
  // Reload data when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFruitsAndVeggies(); // Call fetchTimeLeft function when screen is focused
    });
  
    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  }, [navigation]); // Empty dependency array to run only once, effectively reloading the screen

  const handleFruitsAndVeggiesPress = () => {
    if (eaten === 'Yes') {
      setError("Oops, you've already accomplished this task already.");
    } else {
      toggleModal();
    }
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleClaimRewards = async () => {
    // Check if rewards are already claimed today
    if (claimedToday) {
      Alert.alert('Rewards Claimed', 'You have already claimed your rewards for today.');
      return;
    }

    // Check if all conditions are met
    if (numGlasses === 8 && timeLeft === 1 && eaten === 'Yes') {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const db = getFirestore();
          const docRef = doc(db, 'tasks', userId);

          // Update the coins field
          await updateDoc(docRef, {
            coins: 30
          });

          // Set claimedToday to true to prevent multiple claims in a day
          setClaimedToday(true);

          // Show alert confirming rewards claim
          Alert.alert('Rewards Claimed', 'You have successfully claimed your rewards!');
        }
      } catch (error) {
        console.error('Error updating Firestore:', error);
      }
    } else {
      Alert.alert('Conditions Not Met', 'Please complete all tasks before claiming rewards.');
    }
  };

  const renderModalContent = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>{error}</Text>
        <Button title="OK" onPress={handleOk} />
      </View>
    </View>
  );

  useEffect(() => {
    const fetchNutrientsSum = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user && isFocused) {
          const userId = user.uid;
          const db = getFirestore();
          const currentDate = new Date();
          const dateString = currentDate.toDateString();
          const dateFormatted = new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
          const userDocRef = doc(db, 'foodIntake', userId);
  
          // Fetch breakfast data
          const breakfastDocRef = doc(collection(userDocRef, dateFormatted), 'Breakfast');
          const breakfastDocSnap = await getDoc(breakfastDocRef);
          const breakfastData = breakfastDocSnap.exists() ? breakfastDocSnap.data() : {};
  
          // Fetch lunch data
          const lunchDocRef = doc(collection(userDocRef, dateFormatted), 'Lunch');
          const lunchDocSnap = await getDoc(lunchDocRef);
          const lunchData = lunchDocSnap.exists() ? lunchDocSnap.data() : {};
  
          // Fetch dinner data
          const dinnerDocRef = doc(collection(userDocRef, dateFormatted), 'Dinner');
          const dinnerDocSnap = await getDoc(dinnerDocRef);
          const dinnerData = dinnerDocSnap.exists() ? dinnerDocSnap.data() : {};
  
          // Extract nutrition data from the nutritionData map
          const extractNutritionData = (data) => {
            return {
              fats: data?.nutritionData?.fats || 0,
              fiber: data?.nutritionData?.fiber || 0,
              otherNutrients: data?.nutritionData?.otherNutrients || 0,
              protein: data?.nutritionData?.protein || 0,
            };
          };
  
          // Calculate sum of nutrients
          const sum = {
            fats: extractNutritionData(breakfastData).fats + extractNutritionData(lunchData).fats + extractNutritionData(dinnerData).fats,
            fiber: extractNutritionData(breakfastData).fiber + extractNutritionData(lunchData).fiber + extractNutritionData(dinnerData).fiber,
            otherNutrients: extractNutritionData(breakfastData).otherNutrients + extractNutritionData(lunchData).otherNutrients + extractNutritionData(dinnerData).otherNutrients,
            protein: extractNutritionData(breakfastData).protein + extractNutritionData(lunchData).protein + extractNutritionData(dinnerData).protein,
          };
  
          console.log('Sum of nutrients:', sum); // Log the sum of nutrients
  
          setNutrientsSum(sum);
        }
      } catch (error) {
        console.error('Error fetching nutrients sum:', error);
        setError('Error fetching nutrients sum');
      }
    };
  
    fetchNutrientsSum();
  }, [isFocused]);
  


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Header navigation={navigation} />
        <View style={styles.content}>
          <Text style={styles.text}>A fun journey for <Text style={styles.blueText}>health and wellness </Text></Text>
          <Text style={styles.daily}>Daily Task</Text>

          {/* TASK CONTAINER */}
          <View style={styles.tasks}>
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('WaterTracker')}>
              <Image
                source={{ uri: 'https://cdn.glitch.global/25f00b11-d427-47d2-b882-d7d6b9fd551b/1864846.png?v=1710743309587' }}
                style={styles.img}
              />
              <Text style={styles.rowText}>Drink 8 glasses of water</Text>

              {/* CHECK IMG */}
              {numGlasses === 8 ? (
                <Image
                  source={{
                    uri: 'https://cdn.glitch.global/25f00b11-d427-47d2-b882-d7d6b9fd551b/5610944.png?v=1710744572273'
                  }}
                  style={styles.toggle}
                />
              ) : (
                <Image
                  source={{
                    uri: 'https://cdn.glitch.global/25f00b11-d427-47d2-b882-d7d6b9fd551b/delete_5610967.png?v=1710748669713'
                  }}
                  style={styles.toggle}
                />
              )}

            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Exercise')}>
              <Image
                source={{ uri: 'https://cdn.glitch.global/25f00b11-d427-47d2-b882-d7d6b9fd551b/7028853.png?v=1710747905815' }}
                style={styles.img}
              />
              <Text style={styles.rowText}>Exercise for 10 minutes</Text>

              {/* CHECK IMG */}
              {timeLeft === 1 ? (
                <Image
                  source={{
                    uri: 'https://cdn.glitch.global/25f00b11-d427-47d2-b882-d7d6b9fd551b/5610944.png?v=1710744572273'
                  }}
                  style={styles.toggle}
                />
              ) : (
                <Image
                  source={{
                    uri: 'https://cdn.glitch.global/25f00b11-d427-47d2-b882-d7d6b9fd551b/delete_5610967.png?v=1710748669713'
                  }}
                  style={styles.toggle}
                />
              )}

            </TouchableOpacity>

            <TouchableOpacity style={styles.row} onPress={handleFruitsAndVeggiesPress}>
              <Image
                source={{ uri: 'https://cdn.glitch.global/25f00b11-d427-47d2-b882-d7d6b9fd551b/10107601.png?v=1710747939737' }}
                style={styles.img}
              />
              <Text style={styles.rowText}>Eat fruits and vegetables</Text>
              {/* CHECK IMG */}
              {eaten === 'Yes' ? (
                <Image
                  source={{
                    uri: 'https://cdn.glitch.global/25f00b11-d427-47d2-b882-d7d6b9fd551b/5610944.png?v=1710744572273'
                  }}
                  style={styles.toggle}
                />
              ) : (
                <Image
                  source={{
                    uri: 'https://cdn.glitch.global/25f00b11-d427-47d2-b882-d7d6b9fd551b/delete_5610967.png?v=1710748669713'
                  }}
                  style={styles.toggle}
                />
              )}
            </TouchableOpacity>
          </View>

           <TouchableOpacity style={styles.rewardsButton} onPress={handleClaimRewards}>
              <Text style={styles.rewardsButtonText}>Claim Rewards!</Text>
          </TouchableOpacity>

          <Text style={styles.daily}>Your Nutrition For The Day</Text>

          {/* NUTRITIONAL GRAPH CONTAINER */}
          <View style={styles.barChartContainer}>
            <BarChart
              style={styles.chart}
              data={{
                labels: ['Fats', 'Fiber', 'Protein', 'Others'],
                datasets: [
                  {
                    data: [
                      nutrientsSum.fats,
                      nutrientsSum.fiber,
                      nutrientsSum.protein,
                      nutrientsSum.otherNutrients,
                    ],
                  },
                ],
              }}
              width={300}
              height={220}
              yAxisSuffix="g"
              chartConfig={{
                backgroundColor: '#101424',
                backgroundGradientFrom: '#101424',
                backgroundGradientTo: '#101424',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              verticalLabelRotation={30}
            />
          </View>


          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Did you eat fruits and vegetables?</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={async () => {
                      try {
                        // Update the Firestore field to 'Yes'
                        const db = getFirestore();
                        const userId = getAuth().currentUser.uid;
                        const dateToday = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                        const userDocRef = doc(db, 'tasks', userId);
                        const fruitsAndVeggiesDocRef = doc(collection(userDocRef, dateToday), 'fruitsAndVeggies');

                        // Check if the document exists
                        const docSnap = await getDoc(fruitsAndVeggiesDocRef);
                        if (!docSnap.exists()) {
                          // Document doesn't exist, create it
                          await setDoc(fruitsAndVeggiesDocRef, {});
                        }

                        // Update the Firestore field
                        await updateDoc(fruitsAndVeggiesDocRef, {
                          eaten: 'Yes'
                        });

                        // Close the modal
                        setModalVisible(false);
                      } catch (error) {
                        console.error('Error updating Firestore:', error);
                      }
                    }}
                  >
                    <Text style={styles.buttonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.modalButtonNo]} onPress={() => setModalVisible(false)}>
                    <Text style={styles.buttonText}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 10,
    paddingBottom: 100,
    backgroundColor: '#101424',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  text: {
    fontSize: 25,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 30,
    letterSpacing: 2,
    maxWidth: 300,
    lineHeight: 30,
    alignSelf: 'flex-start',
    marginLeft: 15
  },
  blueText: {
    color: '#5CE1E6',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  daily: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'flex-start',
    marginTop: 30,
    paddingLeft: 15
  },
  tasks: {
    marginTop: 10,
    height: 230,
    width: 330,
    backgroundColor: '#212740',
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center verticall
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    height: 50,
    width: 50,
  },
  toggle: {
    height: 40,
    width: 40,
  },
  
  rewardsButton: {
    alignItems: 'center',
    marginTop: 15,
    padding:15,
    width: 310,
    borderColor: '#fff',
    borderWidth: 3,
    borderRadius: 25,
  },
  
  rewardsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rowText: {
    fontSize: 16,
    fontWeight: 'light',
    color: '#ffffff',
    flex: 1, // Ensure text takes up remaining space in row
    textAlign: 'center'
  },
  graphContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 350,
    height: 200, // Adjust the height as needed
    marginTop: 10, // Add marginTop to separate it from the previous content
  },
  graph: {
    paddingVertical: 50,
    height: 150,
    width: 150,
  },
  graphText: {
    paddingTop: 10,
    fontSize: 15,
    fontWeight: 'light',
    color: '#ffffff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonNo: {
    backgroundColor: '#FF5722',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorMessage: {
    backgroundColor: '#FF5252',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  errorText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  barChartContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
});

export default HomeScreen;


