import { React, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import itsamatch from "../assets/itsamatch.png";
import logo from "../assets/logo.png";
import dislike from "../assets/dislike.png";
import like from "../assets/like.png";

import api from "../services/api";

export default function Main({ navigation }) {
    const id = navigation.getParam('user');
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get("/devs", {
                headers: {
                    user: id
                }
            });
            setUsers(response.data);
        }

        loadUsers();
    }, [id]);

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user_id: id }
        });

        //quando receber a mensagem match
        socket.on('match', dev => {
            setMatchDev(dev);
        });
    }, [id]);

    async function handleLike() {
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: id }
        });

        //setUsers(users.filter(user => user._id !== id));
        setUsers(rest);
    }

    async function handleDislike() {
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: id }
        });

        //setUsers(users.filter(user => user._id !== id));]
        setUsers(rest);
    }

    async function handleLogout() {
        await AsyncStorage.clear();

        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo} source={logo}></Image>
            </TouchableOpacity>
            <View style={styles.cardsContainer}>
                {users.length > 0 ? users.map((user, index) => (
                    <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                        <Image style={styles.avatar} source={{ uri: user.avatar }}></Image>
                        <View style={styles.footer}>
                            <Text style={styles.name}>{user.name}</Text>
                            <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                        </View>
                    </View>
                )) : (
                        <Text style={styles.empty}>Acabou :(</Text>
                    )}
            </View>
            {users.length > 0 && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleDislike}>
                        <Image source={dislike}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleLike}>
                        <Image source={like}></Image>
                    </TouchableOpacity>
                </View>
            )}
            {matchDev && (
                <View style={styles.matchContainer}>
                    <Image style={styles.matchImage} source={itsamatch}></Image>
                    <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }}></Image>
                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>
                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.closeMatch}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

//para sombra no Android = elevation, no IoS tem que passar cada propriedade separadamente
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'F5F5F5',
        alignItems: "center",
        justifyContent: "space-between"
    },
    logo: {
        marginTop: 30
    },
    cardsContainer: {
        flex: 1,
        maxHeight: 500,
        alignSelf: "stretch",
        justifyContent: "center"
    },
    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    avatar: {
        flex: 1,
        height: 300
    },
    footer: {
        backgroundColor: "#FFF",
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18
    },
    buttonContainer: {
        flexDirection: 'row',
        marginBottom: 30
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#FFF",
        justifyContent: 'center',
        alignItems: "center",
        marginHorizontal: 20,
        elevation: 2
    },
    empty: {
        alignSelf: 'center',
        color: "#999",
        fontSize: 24,
        fontWeight: 'bold'
    },
    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    matchImage: {
        height: 60,
        resizeMode: 'contain'
    },
    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#FFF',
        marginVertical: 30
    },
    matchName: {
        fontSize: 26,
        fontWeight: "bold",
        color: '#FFF'
    },
    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 25,
        textAlign: 'center',
        paddingHorizontal: 30
    },
    closeMatch: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: "center",
        marginTop: 30,
        fontWeight: "bold"
    }
});
    //provavelmente é feito um pacote diferente para cada aplicativo
    //um projeto Android e outro IoS
//ao invés de fazer diversas tratativas diferentes dentro de um mesmo