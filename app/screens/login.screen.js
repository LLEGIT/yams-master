import React, { useState, useContext, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Animated, Image } from 'react-native';
import { AuthContext } from '../contexts/auth.context';
import { useNavigation } from '@react-navigation/native';
import PillButton from '../components/button/button.component';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext); // Assumes you have a `login` method in context
    const animatedValue = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    const handleSubmit = () => {
        if (username.trim() && password.trim()) {
            login({ username: username.trim(), password: password.trim() });
        }
    };

    const redirectRegister = () => {
        navigation.navigate('RegisterScreen');
    }

    const handlePressIn = () => {
        Animated.spring(animatedValue, {
            toValue: 1,
            useNativeDriver: true,
            friction: 5,
            tension: 40
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(animatedValue, {
            toValue: 0,
            useNativeDriver: true,
            friction: 5,
            tension: 40
        }).start();
    };

    const containerStyle = {
        transform: [
            {
                translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -5]
                })
            }
        ],
        shadowOpacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1]
        }),
        shadowOffset: {
            width: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 15]
            }),
            height: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 15]
            })
        }
    };

    return (
        <View style={styles.container}>
            <Image style={{ width: 200, height: 200, borderRadius: 20, marginBottom: 10 }} source={require('./../assets/image/logo.png')} />

            <Animated.View style={[styles.inputContainer, containerStyle]}>
                <View style={styles.shadowInput} />

                <View style={styles.field}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Xx_Dark_Master_xX"
                        value={username}
                        onChangeText={setUsername}
                        placeholderTextColor="#666"
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="#666"
                        secureTextEntry
                    />
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginTop: 20, marginBottom: 20 }}>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    >
                        <PillButton title="Login" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={redirectRegister}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    >
                        <PillButton title="Register" />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    inputContainer: {
        position: 'relative',
        backgroundColor: '#f0f0f0',
        padding: 20,
        borderWidth: 4,
        borderColor: '#000',
        borderRadius: 30,
        width: '90%',
        maxWidth: 350,
        shadowColor: '#000000',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
    },
    shadowInput: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        bottom: 0,
        zIndex: -1,
    },
    field: {
        marginBottom: 15,
    },
    label: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        borderWidth: 3,
        borderColor: '#000',
        borderRadius: 30,
        padding: 15,
        fontSize: 18,
        backgroundColor: '#fff',
        color: '#000',
        fontFamily: 'Roboto',
    },
    buttonShadow2: {
        marginTop: 10,
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: 'red',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
});

export default LoginScreen;