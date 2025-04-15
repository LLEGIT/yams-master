// app/screens/vs-bot-game.screen.js

import React, { useContext } from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import { SocketContext } from './contexts/socket.context';
import { Link } from "expo-router";

export default function BotScreen() {

    const socket = useContext(SocketContext);

    return (
        <View style={styles.container}>
            {!socket && (
                <>
                    <Text>
                        No connection with server...
                    </Text>
                    <Text>
                        Restart the app and wait for the server to be back again.
                    </Text>
                </>
            )}

            {socket && (
                <>
                    <Text>
                        VsBot Game Interface
                    </Text>
                    <Text>
                        My socket id is: {socket.socket.id}
                    </Text>
                    <Link href='/'>
                        Retour au menu
                    </Link>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
});
