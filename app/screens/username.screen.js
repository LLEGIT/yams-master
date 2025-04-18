import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { AuthContext } from '../contexts/auth.context';

const UsernameScreen = () => {
    const [value, setValue] = useState('');
    const { saveUsername } = useContext(AuthContext);

    const handleSubmit = () => {
        if (value.trim()) {
            saveUsername(value.trim());
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Choisis un pseudo :</Text>
            <TextInput
                placeholder="Ton pseudo"
                value={value}
                onChangeText={setValue}
                style={styles.input}
            />
            <Button title="Valider" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { borderWidth: 1, padding: 10, marginVertical: 20, borderRadius: 8 },
    label: { fontSize: 18 },
});

export default UsernameScreen;