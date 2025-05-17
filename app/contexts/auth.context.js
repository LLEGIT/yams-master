import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socketEndpoint } from './socket.context';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadUsername = async () => {
        const stored = await AsyncStorage.getItem('username');
        if (stored) {
            setUsername(stored);
        }
        setIsLoading(false);
    };

    const register = async ({ username, password }) => {
        try {
            const response = await fetch(socketEndpoint + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                alert('Error while registering, try again later.');
                return false;
            }

            await AsyncStorage.setItem('username', username);
            setUsername(username);
            return true;
        } catch (error) {
            console.error('Register error:', error);
            alert('Error while registering, try again later.');
            return false;
        }
    };

    const login = async ({ username, password }) => {
        try {
            const response = await fetch(socketEndpoint + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                alert('Incorrect credentials or technical error occured.');
                return;
            }

            await AsyncStorage.setItem('username', username);
            setUsername(username);
        } catch (error) {
            console.error('Login error:', error);
            alert('Technical error occured, please try again later.');
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('username');
        setUsername(null);
    };

    useEffect(() => {
        loadUsername();
    }, []);

    return (
        <AuthContext.Provider value={{
            username,
            isLoading,
            login,
            register,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};