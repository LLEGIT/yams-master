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
            clearInterval(interval);
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
                    <AnimatedBackground/>
                    <View style={styles.card}>
                        <Text style={styles.paragraph}>
                        🕗 Waiting for another player{dots}
                        </Text>
                    </View>
                </>
            )}
            {gameCancelled && <Text>Your game has been cancelled. Redirection to homepage...</Text>}
            {inGame && <Board />}
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
