import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socketEndpoint } from './socket.context';
import { useNavigation } from '@react-navigation/native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    const loadUsername = async () => {
        const stored = await AsyncStorage.getItem('username');
        if (stored) {
            setUsername(stored);
        }
        setIsLoading(false);
    };

    const saveUsername = async (username) => {
        try {
            const response = await fetch(socketEndpoint + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                alert('Error while registering. Try again later');
                return;
            }

            await AsyncStorage.setItem('username', username);
            setUsername(username);
        } catch (error) {
            console.error(error);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('username');
        setUsername(null);
    }

    useEffect(() => {
        loadUsername();
    }, []);

    return (
        <AuthContext.Provider value={{ username, saveUsername, isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
