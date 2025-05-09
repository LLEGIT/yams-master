import { useContext } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SocketContext } from "../contexts/socket.context";
import { Link } from "@react-navigation/native";
import { AuthContext } from "../contexts/auth.context";
import PillButton from '../components/PillButton';

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
                    <Image style={{ width: 200, height: 200, borderRadius: 20 }} source={require('./../../logo.png')} />
                    <Text style={styles.welcomeText}>Welcome back {username ?? 'anonymous'}</Text>
                    <View style={styles.buttonContainer}>
                        <Link style={styles.link} screen="OnlineScreen">
                            <PillButton title="Play online" />
                        </Link>
                        <Link style={styles.link} screen="VsBotScreen">
                            <PillButton title="Play against a bot" />
                        </Link>
                        <Link style={styles.link} onPress={() => logout()}>
                            <PillButton title="Logout" />
                        </Link>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        gap: 20,
        justifyContent: "center",
        alignItems: "center",
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
        padding: 10,
    },
    welcomeText: {
        fontSize: 18,
        marginBottom: 20,
    },
    buttonContainer: {
        gap: 25,
        alignItems: "center",
    }
});
