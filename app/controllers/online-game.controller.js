// app/controller/online-game.controller.js

import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SocketContext } from '../contexts/socket.context';
import { useNavigation } from "@react-navigation/native";
import Board from "../components/board/board.component";

export default function OnlineGameController() {
    const navigation = useNavigation();
    const socket = useContext(SocketContext);

    const [gameState, setGameState] = useState(null);
    const [inQueue, setInQueue] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [idOpponent, setIdOpponent] = useState(null);
    const [gameCancelled, setGameCancelled] = useState(false);

    useEffect(() => {
        socket.emit("queue.join");
        setInQueue(false);
        setInGame(false);

        socket.on('queue.added', (data) => {
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
        });

        socket.on('game.start', (data) => {
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
            setIdOpponent(data['idOpponent']);
            setGameState(data);
        });

        socket.on('game.cancelled', (data) => {
            setGameState(null);
            setGameCancelled(true);
            setInGame(false);

            setTimeout(() => {
                setInQueue(false);
                setIdOpponent(null);
                setGameCancelled(false);
                return navigation.navigate('HomeScreen');
            }, 2000);
        });

        socket.on('game.over', () => {
            alert('Game over !');
            return navigation.navigate('HomeScreen');
        });

        return () => {
            socket.off('queue.added');
            socket.off('game.start');
            socket.off('game.cancelled');
        };
    }, []);

    const handleCancel = () => {
        socket.emit('queue.leave');
        setInQueue(false);
        setInGame(false);
        setIdOpponent(null);
        setGameState(null);
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
                    <Text onPress={handleCancel}>
                        Cancel
                    </Text>
                </>
            )}
            {gameCancelled && <Text>Your game has been cancelled. Redirection to homepage...</Text>}
            {inGame && <Board gameState={gameState} idPlayer={socket.id} idOpponent={idOpponent} />}
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
