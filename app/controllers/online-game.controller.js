// app/controller/online-game.controller.js

import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SocketContext } from '../contexts/socket.context';
import { useNavigation } from "@react-navigation/native";
import Board from "../components/board/board.component";
import AnimatedBackground from "../components/AnimatedBackground";

export default function OnlineGameController() {
    const navigation = useNavigation();
    const socket = useContext(SocketContext);

    const [gameState, setGameState] = useState(null);
    const [inQueue, setInQueue] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [idOpponent, setIdOpponent] = useState(null);
    const [gameCancelled, setGameCancelled] = useState(false);
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev.length >= 3) return '';
                return prev + '.';
            });
        }, 500);
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
            setGameState({
                ...data,
                player1Pions: 12,
                player2Pions: 12,
                player1Score: 0,
                player2Score: 0
            });
        });

        socket.on('game.state.update', (data) => {
            setGameState(prevState => {
                if (!prevState) return null;
                return {
                    ...prevState,
                    currentTurn: data.currentTurn,
                    player1Score: data.player1Score,
                    player2Score: data.player2Score,
                    player1Pions: data.player1Pions,
                    player2Pions: data.player2Pions,
                    player1Socket: prevState.player1Socket,
                    player2Socket: prevState.player2Socket
                };
            });
        });

        socket.on('game.over', (data) => {
            setInGame(false);
            setInQueue(false);
            navigation.navigate('Home');
        });

        socket.on('queue.cancelled', (data) => {
            setGameCancelled(true);
            setInQueue(false);
            setInGame(false);
            setTimeout(() => {
                navigation.navigate('Home');
            }, 3000);
        });

        return () => {
            clearInterval(interval);
            socket.off('queue.added');
            socket.off('game.start');
            socket.off('game.state.update');
            socket.off('game.over');
            socket.off('queue.cancelled');
        };
    }, []);

    const handleCancel = () => {
        socket.emit("queue.leave");
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
                    <AnimatedBackground/>
                    <View style={styles.card}>
                        <Text style={styles.paragraph}>
                        🕗 Waiting for another player{dots}
                        </Text>
                        <Text onPress={handleCancel}>
                        Cancel
                    </Text>
                    </View>
                </>
            )}
            {gameCancelled && <Text>Your game has been cancelled. Redirection to homepage...</Text>}
            {inGame && gameState && <Board gameState={gameState} idPlayer={socket.id} idOpponent={idOpponent} />}
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
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    paragraph: {
        fontSize: 16,
    }
});
