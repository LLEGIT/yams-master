import { Link, router } from 'expo-router';
import { StyleSheet, Text, TextInput } from 'react-native';
import { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Register() {
    const [username, onChangeUsername] = useState<string>('');
    const [password, onChangePassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handlePress = async () => {
        setError(null);
        setSuccess(false);

        if (!username || !password) {
            setError("Username and password are required.");
            return;
        }

        try {
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => router.replace('/'), 1500); // redirect to login or home
            } else {
                setError(data?.message || "Registration failed");
            }

        } catch (err) {
            console.error(err);
            setError("Something went wrong.");
        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.view}>
                {error && <Text style={{ color: 'red' }}>{error}</Text>}
                {success && <Text style={{ color: 'green' }}>Registration successful!</Text>}
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeUsername}
                    value={username}
                    placeholder='Username'
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangePassword}
                    value={password}
                    placeholder='Password'
                    secureTextEntry
                />
                <Text
                    style={styles.submit}
                    onPress={handlePress}>
                    Register
                </Text>
                <Link href='/'>Already have an account? Sign In</Link>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    view: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        paddingHorizontal: 20
    },
    input: {
        height: 40,
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
    },
    submit: {
        width: 100,
        padding: 5,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 15,
        backgroundColor: 'green',
        color: 'white'
    }
});
