import { React, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//dizer o que quer importar, deixa a aplicação mais performática
import logo from "../assets/logo.png";
import api from "../services/api";

//é o mesmo código do front com componentes e estilos feitos de forma difentes
export default function Login({ navigation }) {
    const [user, setUser] = useState('');

    //se deixo o [] vazio, o useEffect só executa uma vez, pois não tem variável para ele vigiar
    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if (user) {
                navigation.navigate('Main', { user });
            }
        })
    }, []);

    async function handleLogin() {
        //a chamada ajax do jquery é assincrona, sem usar async do ES6
        const response = await api.post("/devs", { username: user });

        const { _id } = response.data;

        await AsyncStorage.setItem('user', _id);
        //quando usuário loga, armazeno uma informação no storage da aplicação
        //se ele entrar de novo, executa o useEffect, e se tiver um usuário no storage
        //envia ele direto pro Main

        navigation.navigate('Main', { user: _id });
    }

    return (
        <View style={styles.container}>
            <Image src={logo}></Image>
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Digite seu usuário do GitHub"
                placeholderTextColor="#999"
                style={styles.input}
                value={user}
                onChangeText={setUser}
            ></TextInput>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text styles={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },
    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15 //igual padding: 0 15px
    },
    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    }
});