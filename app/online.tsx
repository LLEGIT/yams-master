import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Online() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Link style={{ position: 'absolute', top: 70, left: 20 }} href='/'>Retour</Link>
            <Text>Je joue en ligne</Text>
        </View>
    )
}