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

        socket.on('game.state.update', (data) => {
            setGameState(prevState => ({
                ...prevState,
                currentTurn: data.currentTurn,
                player1Score: data.player1Score,
                player2Score: data.player2Score,
                player1Pions: data.player1Pions,
                player2Pions: data.player2Pions
            }));
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

        socket.on('game.over', (data) => {
            let message = 'Game over !';
            if (data.winner) {
                const isWinner = data.winner === (gameState.currentTurn === 'player:1' ? 'player:1' : 'player:2');
                if (data.winType === 'alignment') {
                    message = isWinner ? 'Vous avez gagné avec un alignement de 5 pions !' : 'Votre adversaire a gagné avec un alignement de 5 pions !';
                } else if (data.winType === 'noPions') {
                    message = isWinner ? 'Vous avez gagné car votre adversaire n\'a plus de pions !' : 'Votre adversaire a gagné car vous n\'avez plus de pions !';
                } else {
                    message = isWinner ? 'Vous avez gagné !' : 'Votre adversaire a gagné !';
                }
            }
            alert(message);
            return navigation.navigate('HomeScreen');
        });

        return () => {
            socket.off('queue.added');
            socket.off('game.start');
            socket.off('game.state.update');
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
