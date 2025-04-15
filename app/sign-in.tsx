import { Link, router } from 'expo-router';
import { StyleSheet, Text, TextInput } from 'react-native';

import { useSession } from '../ctx';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function SignIn() {
    const { signIn } = useSession();
    const [username, onChangeUsername] = useState<string>('');
    const [password, onChangePassword] = useState<string>('');
    const [invalidCredentials, setInvalidCredentials] = useState<boolean>(false);

    const handlePress = async () => {
        setInvalidCredentials(false);

        if (username === '' || password === '') {
            return;
        }

        try {
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });


            if (!response.ok) {
                setInvalidCredentials(true);
                console.log(response);
                return;
            }

            const data = await response.json();

            if (data.username !== username) {
                setInvalidCredentials(true);
                return;
            }

            signIn();
            router.replace('/');
        } catch (error) {
            console.log(error)
        }
    }

    const handleKeyPress = (event: any) => {
        setInvalidCredentials(false);

        if (event.code === 'Enter') {
            handlePress();
        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.view}>
                {invalidCredentials && <Text style={{ color: 'red' }}>Invalid credentials</Text>}
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeUsername}
                    value={username}
                    placeholder='Username'
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangePassword}
                    onKeyPress={handleKeyPress}
                    value={password}
                    placeholder='Password'
                />
                <Text
                    style={styles.submit}
                    onPress={handlePress}>
                    Sign In
                </Text>
                <Link style={styles.submit} href='/register'>Register</Link>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    view: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    submit: {
        width: 70,
        padding: 5,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 15,
    }
});