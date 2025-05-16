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
                alert('Erreur lors de l’inscription. Réessayez plus tard.');
                return false;
            }

            await AsyncStorage.setItem('username', username);
            setUsername(username);
            return true;
        } catch (error) {
            console.error('Register error:', error);
            alert('Une erreur est survenue pendant l’inscription.');
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
                alert('Identifiants incorrects ou erreur de connexion.');
                return;
            }

            await AsyncStorage.setItem('username', username);
            setUsername(username);
        } catch (error) {
            console.error('Login error:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
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
