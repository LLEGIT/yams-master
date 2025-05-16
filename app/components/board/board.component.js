// app/components/board/board.component.js

import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import PlayerDeck from "./decks/player-deck.component";
import PlayerTimer from "./timers/player-timer-component";
import OpponentDeck from "./decks/opponent-deck.component";
import OpponentTimer from "./timers/opponent-timer-component";
import Choices from "./choices/choices.component";
import Grid from "./grid/grid.component";

const OpponentInfos = ({ idOpponent }) => (
    <View style={styles.opponentInfosContainer}>
        <Text>Opponent ID: {idOpponent || "N/A"}</Text>
    </View>
);

const OpponentScore = ({ score, pions }) => (
    <View style={styles.opponentScoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.pionsText}>Pions restants: {pions}</Text>
    </View>
);

const PlayerInfos = ({ idPlayer }) => (
    <View style={styles.playerInfosContainer}>
        <Text>Player ID: {idPlayer || "N/A"}</Text>
    </View>
);

const PlayerScore = ({ score, pions }) => (
    <View style={styles.playerScoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.pionsText}>Pions restants: {pions}</Text>
    </View>
);

const Board = ({ gameState, idPlayer, idOpponent }) => {
    // Déterminer si le joueur actuel est player1 ou player2
    const isCurrentPlayer1 = 'player:1' === gameState.playerKey;

    // Calculer le tour actuel
    const isPlayer1 = gameState?.currentTurn === 'player:1';

    // Calculer les scores et pions
    let topScore, topPions, bottomScore, bottomPions;

    if (isCurrentPlayer1) {
        // Si le joueur actuel est player1
        topScore = gameState.player2Score;
        topPions = gameState.player2Pions;
        bottomScore = gameState.player1Score;
        bottomPions = gameState.player1Pions;
    } else {
        // Si le joueur actuel est player2
        topScore = gameState.player1Score;
        topPions = gameState.player1Pions;
        bottomScore = gameState.player2Score;
        bottomPions = gameState.player2Pions;
    }

    const playerDeck = isPlayer1 ? gameState.player1Deck : gameState.player2Deck;
    const opponentDeck = isPlayer1 ? gameState.player2Deck : gameState.player1Deck;

    return (
        <View style={styles.container}>
            <View style={[styles.row, { height: '5%' }]}>
                <OpponentInfos idOpponent={idOpponent} />
                <View style={styles.opponentTimerScoreContainer}>
                    <OpponentTimer time={isPlayer1 ? 0 : gameState.timer} />
                    <OpponentScore score={topScore} pions={topPions} />
                </View>
            </View>
            <View style={[styles.row, { height: '25%' }]}>
                <OpponentDeck deck={opponentDeck} />
            </View>
            <View style={[styles.row, { height: '40%' }]}>
                <Grid />
                <View style={styles.choicesContainer}>
                    <Choices />
                </View>
            </View>
            <View style={[styles.row, { height: '25%' }]}>
                <PlayerDeck deck={playerDeck} />
            </View>
            <View style={[styles.row, { height: '5%' }]}>
                <PlayerInfos idPlayer={idPlayer} />
                <View style={styles.playerTimerScoreContainer}>
                    <PlayerTimer time={isPlayer1 ? gameState.timer : 0} />
                    <PlayerScore score={bottomScore} pions={bottomPions} />
                </View>
            </View>
        </View>
    );
};

export default Board;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'black',
    },
    opponentInfosContainer: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'black',
        backgroundColor: "lightgrey"
    },
    opponentTimerScoreContainer: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "lightgrey"
    },
    opponentScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        backgroundColor: "lightgrey"
    },
    gridContainer: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'black',
    },
    choicesContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playerInfosContainer: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'black',
        backgroundColor: "lightgrey"
    },
    playerTimerScoreContainer: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "lightgrey"
    },
    playerScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        backgroundColor: "lightgrey"
    },
    scoreText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    pionsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2196F3',
    },
});
