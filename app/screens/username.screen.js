import React, { useState, useContext, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { AuthContext } from '../contexts/auth.context';

const UsernameScreen = () => {
    const [value, setValue] = useState('');
    const { saveUsername } = useContext(AuthContext);
    const animatedValue = useRef(new Animated.Value(0)).current;

    const handleSubmit = () => {
        if (value.trim()) {
            saveUsername(value.trim());
        }
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

    const handleInputFocus = () => {
        Animated.spring(animatedValue, {
            toValue: 1,
            useNativeDriver: true,
            friction: 5,
            tension: 40
        }).start();
    };

    const handleInputBlur = () => {
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
                <TextInput
                    style={styles.input}
                    placeholder="Xx_Dark_Master_xX"
                    value={value}
                    onChangeText={setValue}
                    placeholderTextColor="#666"
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Votre pseudo</Text>
                </View>
                <TouchableOpacity 
                    style={styles.buttonShadow} 
                    onPress={handleSubmit}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <Text style={styles.buttonText}>✓</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

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
        flexDirection: 'row',
        alignItems: 'center',
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
    buttonShadow: {
        borderWidth: 3,
        borderColor: '#000',
        backgroundColor: '#3b82f6',
        padding: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    input: {
        flex: 1,
        borderWidth: 3,
        borderColor: '#000',
        borderRadius: 30,
        padding: 15,
        fontSize: 18,
        backgroundColor: '#fff',
        color: '#000',
        fontFamily: 'Roboto',
    },
    labelContainer: {
        position: 'absolute',
        top: -15,
        left: 20,
        backgroundColor: '#3b82f6',
        padding: 5,
        borderWidth: 2,
        borderRadius: 30,
        borderColor: '#000',
    },
    label: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default UsernameScreen;