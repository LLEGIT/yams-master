import React, { useState, useContext, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Animated, Alert } from 'react-native';
import { AuthContext } from '../contexts/auth.context';

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register } = useContext(AuthContext); // Assumes a register function exists
    const animatedValue = useRef(new Animated.Value(0)).current;

    const handleSubmit = () => {
        if (!username.trim() || !password || !confirmPassword) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }

        register({ username: username.trim(), password });
    };

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
            <Animated.View style={[styles.inputContainer, containerStyle]}>
                <View style={styles.shadowInput} />

                <View style={styles.field}>
                    <Text style={styles.label}>Pseudo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Xx_Dark_Master_xX"
                        value={username}
                        onChangeText={setUsername}
                        placeholderTextColor="#666"
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#666"
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Confirmer le mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholderTextColor="#666"
                    />
                </View>

                <TouchableOpacity
                    style={styles.buttonShadow}
                    onPress={handleSubmit}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <Text style={styles.buttonText}>Créer un compte</Text>
                </TouchableOpacity>
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
    buttonShadow: {
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: '#22c55e',
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

export default RegisterScreen;
