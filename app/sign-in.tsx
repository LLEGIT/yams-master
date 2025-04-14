import { router } from 'expo-router';
import { StyleSheet, Text, TextInput } from 'react-native';

import { useSession } from '../ctx';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function SignIn() {
    const { signIn } = useSession();
    const [username, onChangeUsername] = useState<string>('');
    const [password, onChangePassword] = useState<string>('');

    const handlePress = () => {
        // TODO => Implement auth strategy
        if (username !== 'admin' || password !== 'admin') {
            console.log('incorrect credentials')
            return;
        }

        signIn();
        router.replace('/');
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.view}>
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
                />
                <Text
                    style={styles.submit}
                    onPress={handlePress}>
                    Sign In
                </Text>
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
        backgroundColor: 'red'
    }
});