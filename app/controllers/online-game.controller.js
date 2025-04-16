// app/controller/online-game.controller.js

import React, { useEffect, useState, useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SocketContext } from '../contexts/socket.context';
import { useNavigation } from "@react-navigation/native";

export default function OnlineGameController() {
    const navigation = useNavigation();
    const socket = useContext(SocketContext);

    const [inQueue, setInQueue] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [idOpponent, setIdOpponent] = useState(null);
    const [gameCancelled, setGameCancelled] = useState(false);

    useEffect(() => {
        console.log('[emit][queue.join]:', socket.id);
        socket.emit("queue.join");
        setInQueue(false);
        setInGame(false);

        socket.on('queue.added', (data) => {
            console.log('[listen][queue.added]:', data);
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
        });

        socket.on('game.start', (data) => {
            console.log('[listen][game.start]:', data);
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
            setIdOpponent(data['idOpponent']);
        });

        socket.on('game.cancelled', (data) => {
            setGameCancelled(true);
            setInGame(false);

            setTimeout(() => {
                setInQueue(false);
                setIdOpponent(null);
                setGameCancelled(false);
                return navigation.navigate('HomeScreen');
            }, 2000);
        });

        return () => {
            socket.off('queue.added');
            socket.off('game.start');
            socket.off('game.cancelled');
        };
    }, []);

    const handleCancel = () => {
        socket.emit('game.cancel');
        setInQueue(false);
        setInGame(false);
        setIdOpponent(null);
        navigation.navigate('HomeScreen');
    };

    return (
        <View style={styles.container}>
            {!inQueue && !inGame && (
                <>
                    <Text style={styles.paragraph}>
                        Waiting for server datas...
                    </Text>
                </>
            )}

            {inQueue && (
                <>
                    <Text style={styles.paragraph}>
                        Waiting for another player...
                    </Text>
                </>
            )}
            {gameCancelled && <Text>Your game has been cancelled. Redirection to homepage...</Text>}
            {inGame && (
                <>
                    <Text style={styles.paragraph}>
                        Game found !
                    </Text>
                    <Text style={styles.paragraph}>
                        Player - {socket.id} -
                    </Text>
                    <Text style={styles.paragraph}>
                        - vs -
                    </Text>
                    <Text style={styles.paragraph}>
                        Player - {idOpponent} -
                    </Text>
                    <Button title="Cancel" onPress={handleCancel} />
                </>
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
        width: '100%',
        height: '100%',
    },
    paragraph: {
        fontSize: 16,
    }
});
