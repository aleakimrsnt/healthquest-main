import React from 'react';
import { View, Text, ImageBackground, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from expo vector icons


const CompleteWaterIntake = () => {
    const navigation = useNavigation();

    const gotoHome = () => {
        navigation.navigate('HomeTabNavigator');
    };

    return (
        <ImageBackground
            source={{
                uri: 'https://cdn.glitch.global/7de817b7-4f04-4989-b0d7-80318fef9be3/login-mob-bg?v=1710057300780',
            }}
            style={styles.background}>
            <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
                <Text style={styles.title}>Congratulations!</Text>
                <Image
                    source={{ uri: 'https://cdn.glitch.global/b834c6bf-b2c8-4342-81fb-9993104c3dcd/logo.gif?v=1712462247822' }}
                    style={styles.img}
                />
                <Text style={styles.message}>You've completed your water intake for the day!</Text>
                <TouchableOpacity style={styles.btn} onPress={gotoHome}>

                    <LinearGradient
                        colors={['#5adfe5', '#ec0d64']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.gradientBackground, styles.buttonWidth]}
                    >
                        <Text style={styles.btnText}>Finish other tasks!</Text>

                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#212740', // Black background color
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#fff',
        fontFamily: 'Poppins-Semibold',
    },
    img: {
        height: 150,
        width: 150,
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
        color: '#fff',
        fontFamily: 'Poppins-Regular',
    },
    btn: {
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 60,
    },
    gradientBackground: {
        borderRadius: 60,
        padding: 20,
    },
    buttonWidth: {
        width: '100%',
    },
    btnText: {
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
    }
});

export default CompleteWaterIntake;
