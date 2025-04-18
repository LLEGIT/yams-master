import { useContext } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SocketContext } from "../contexts/socket.context";
import { Link } from "@react-navigation/native";
import { AuthContext } from "../contexts/auth.context";

export default function HomeScreen() {
    const socket = useContext(SocketContext);
    const { username, logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            {!socket && (
                <>
                    <Text style={styles.paragraph}>
                        Connecting to websocket server...
                    </Text>
                    <Text style={styles.footnote}>
                        Make sure the backend is started and reachable
                    </Text>
                </>
            )}

            {socket && (
                <>
                    <Text onPress={() => logout()}>Logout</Text>
                    <Text>Welcome back {username ?? 'anonymous'}</Text>
                    <Image style={{ width: 200, height: 200 }} source={require('./../../logo.png')} />
                    <Link style={styles.link} screen="OnlineScreen">Play online</Link>
                    <Link style={styles.link} screen="VsBotScreen">Play against a bot</Link>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 20,
    },
    paragraph: {
        fontSize: 18,
        color: "#333",
        textAlign: "center",
        marginVertical: 10,
    },
    footnote: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        marginTop: 5,
    },
    link: {
        fontSize: 20,
        borderColor: "black",
        borderWidth: 1,
        padding: 10,
        borderRadius: 10
    }
});