// app/screens/online-game.screen.js

import React, { useContext } from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import { SocketContext } from './contexts/socket.context';
import { Link } from "expo-router";
import OnlineGameController from "./controller/online-game-controller";

export default function OnlineScreen() {

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
                <OnlineGameController />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    }
});
