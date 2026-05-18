import React, { useState, useEffect, cloneElement } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDoc, getDocs, collection, query, where, doc } from 'firebase/firestore';
import { auth, firestore } from '../firebaseConfig';

const LeaderboardsScreen = ({ navigation }) => {
    const defaultProfilePic = 'https://cdn.hero.page/pfp/894422f2-35d0-4fcc-a83b-c0ba647da537-monochrome-aesthetic-anime-boy-pfp-aesthetic-overview-3.png';

    const [currProfilePic, setProfilePic] = useState('');
    const [currUsername, setUsername] = useState('');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProfilePic = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userEmail = currentUser.email;
                const userQuery = query(collection(firestore, 'users'), where('email', '==', userEmail));
                const userSnapshot = await getDocs(userQuery);
                if (!userSnapshot.empty) {
                    const userData = userSnapshot.docs[0].data();
                    setProfilePic(userData.profilePic);
                    profilePic = currProfilePic;
                    setUsername(userData.username);
                    username = currUsername;
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

    const fetchUsersData = async () => {
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const data = [];

        for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            const { username, profilePic } = userData;
            data.push({ id: userDoc.id, username, profilePic });
        }

        return data;
    };

    const fetchLevel = async (userId) => {
        try {
            const taskDocRef = doc(firestore, 'tasks', userId);
            const taskDocSnapshot = await getDoc(taskDocRef);

            if (taskDocSnapshot.exists()) {
                const taskData = taskDocSnapshot.data();
                return taskData.level || 0; // Return level if exists, otherwise default to 0
            } else {
                return 0; // Return default level if task document doesn't exist
            }
        } catch (error) {
            console.error('Error fetching level:', error);
            return 0; // Return default level value in case of error
        }
    };

    const fetchLeaderboards = async () => {
        try {
            const usersData = await fetchUsersData();
            const data = [];

            for (const user of usersData) {
                const level = await fetchLevel(user.id);
                if (level !== 0) {
                    data.push({ ...user, level });
                }
            }

            // Sort leaderboard data by level in descending order
            data.sort((a, b) => b.level - a.level);
            setLeaderboardData(data);
        } catch (error) {
            setError('Error fetching leaderboards');
            console.error('Error fetching leaderboards', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboards();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.content}>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : error ? (
                        <Text>{error}</Text>
                    ) : (
                        leaderboardData.map((item, index) => (
                            <View key={index} style={getStyleForRanking(index)}>
                                {index === 0 && (
                                    <View style={styles.goldBar}>
                                        <Image
                                            source={{ uri: 'https://cdn.glitch.global/b834c6bf-b2c8-4342-81fb-9993104c3dcd/1.png?v=1712894204747' }}
                                            style={styles.imageStat}
                                            resizeMode="contain"
                                        />
                                        <View style={styles.row}>
                                            <Image
                                                source={{ uri: item.profilePic || defaultProfilePic }}
                                                style={styles.imageProfile}
                                                resizeMode="contain"
                                            />
                                            <Text style={styles.rowText}>{item.username}</Text>
                                        </View>
                                        <Text style={styles.mmr}>{item.level}</Text>
                                    </View>
                                )}
                                {index === 1 && (
                                    <View style={styles.silverBar}>
                                        <Image
                                            source={{ uri: 'https://cdn.glitch.global/b834c6bf-b2c8-4342-81fb-9993104c3dcd/2.png?v=1712894206457' }}
                                            style={styles.imageStat}
                                            resizeMode="contain"
                                        />
                                        <View style={styles.row}>
                                            <Image
                                                source={{ uri: item.profilePic || defaultProfilePic }}
                                                style={styles.imageProfile}
                                                resizeMode="contain"
                                            />
                                            <Text style={styles.rowText}>{item.username}</Text>
                                        </View>
                                        <Text style={styles.mmr}>{item.level}</Text>
                                    </View>
                                )}
                                {index === 2 && (
                                    <View style={styles.bronzeBar}>
                                        <Image
                                            source={{ uri: 'https://cdn.glitch.global/b834c6bf-b2c8-4342-81fb-9993104c3dcd/3.png?v=1712894209247' }}
                                            style={styles.imageStat}
                                            resizeMode="contain"
                                        />
                                        <View style={styles.row}>
                                            <Image
                                                source={{ uri: item.profilePic || defaultProfilePic }}
                                                style={styles.imageProfile}
                                                resizeMode="contain"
                                            />
                                            <Text style={styles.rowText}>{item.username}</Text>
                                        </View>
                                        <Text style={styles.mmr}>{item.level}</Text>
                                    </View>
                                )}
                                {(index !== 0 && index !== 1 && index !== 2) && (
                                    <View style={styles.getStyleForRanking}>
                                        <View style={styles.row}>
                                            <Text style={styles.bigNumber}>
                                                {index + 1}
                                            </Text>
                                            <Image
                                                source={{ uri: item.profilePic || defaultProfilePic }}
                                                style={styles.imageProfile2}
                                                resizeMode="contain"
                                            />
                                            <Text style={styles.rowText}>{item.username}</Text>
                                            <Text style={styles.mmr2}>{item.level}</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
            <View style={styles.absoluteHeader}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Leaderboards</Text>
                    <Image
                        source={{ uri: currProfilePic }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.statBar}>
                    <Text style={styles.ranking}>Ranking</Text>
                    <Text style={styles.playerText}>Player</Text>
                    <Text style={styles.playerText}>Level</Text>
                </View>
            </View>
            {leaderboardData.map((item, idx) => {
                if (item.username === currUsername) {
                    return (
                        <View key={idx} style={styles.absolute}>
                            <Text style={styles.bigNumber2}>
                                {idx + 1}
                            </Text>
                            <View style={styles.row}>
                                <Image
                                    source={{ uri: item.profilePic || defaultProfilePic }}
                                    style={styles.imageProfile2}
                                    resizeMode="contain"
                                />
                                <Text style={styles.rowText}>{item.username}</Text>
                            </View>
                            <Text style={styles.mmrUser}>{item.level}</Text>
                        </View>
                    );
                }
            })}
        </View>
    );    
};    

const getStyleForRanking = (index) => {
    switch (index) {
        case 0:
            return styles.goldBar;
        case 1:
            return styles.silverBar;
        case 2:
            return styles.bronzeBar;
        default:
            return styles.basicBar;
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#101424",
        flexGrow: 1,
    },
    scrollViewContainer: {
        backgroundColor: "#101424",
        alignItems: "center"
    },
    content: {
        width: "100%",
        alignSelf: "center",
        alignItems: "center",
        gap: 15,
        marginTop: 175
    },
    absoluteHeader: {
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        backgroundColor: "#101424"
    },
    header: {
        flexDirection: "row",
        width: "80%",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 30
    },
    headerText: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "bold",
        letterSpacing: 2
    },
    imageStat: {
        width: 50,
        height: 50,
        marginRight: 20,
    },
    imageProfile: {
        width: 50,
        height: 50,
        borderRadius: 100
    },


    imageProfile2: {
        width: 50,
        height: 50,
        borderRadius: 100
    },

    image: {
        width: 50,
        height: 50,
        borderRadius: 100,
    },

    statBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        marginTop: 30,
        backgroundColor: "#212740",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 20
    },
    ranking: {
        color: "#5CE1E6",
        fontWeight: "bold"
    },
    playerText: {
        color: "#ffffff"
    },
    goldBar: {
        backgroundColor: "#49401e",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20
    },
    silverBar: {
        backgroundColor: "#3c3f4b",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20
    },
    bronzeBar: {
        backgroundColor: "#6a3523",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20
    },

    basicBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: "#101424", borderColor: "#fefefe",
        borderWidth: 1,
    },

    row: {
        padding: -20,
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },

    rowText: {
        color: "#ffffff"
    },
    mmr: {
        color: "#ffffff",
        fontFamily: "Poppins-SemiBold",
        fontSize: 25,
        paddingLeft: 20,
    },

    mmr2: {
        color: "#ffffff",
        fontFamily: "Poppins-SemiBold",
        fontSize: 25,
        paddingLeft: 60,
    },

    
    mmrUser: {
        color: "#ffffff",
        fontFamily: "Poppins-SemiBold",
        fontSize: 25,
        paddingLeft: 30,
        paddingRight: 20,
    },

    bigNumber: {
        color: "#68737F",
        fontSize: 30,
        minWidth: 50,
        paddingLeft: 28,
        paddingRight: 35,
        fontFamily: "Poppins-SemiBold"

    },

    
    bigNumber2: {
        color: "#ffffff",
        fontSize: 30,
        minWidth: 50,
        paddingLeft: 28,
        fontFamily: "Poppins-SemiBold"

    },

    absolute: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "95%",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "#3E4460",
        position: "absolute",
        bottom: 0,
        left: 10
    }
});
export default LeaderboardsScreen;