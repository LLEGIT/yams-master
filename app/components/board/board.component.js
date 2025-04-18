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

const OpponentScore = ({ score }) => (
    <View style={styles.opponentScoreContainer}>
        <Text>Score: {score}</Text>
    </View>
);

const PlayerInfos = ({ idPlayer }) => (
    <View style={styles.playerInfosContainer}>
        <Text>Player ID: {idPlayer || "N/A"}</Text>
    </View>
);

const PlayerScore = ({ score }) => (
    <View style={styles.playerScoreContainer}>
        <Text>Score: {score}</Text>
    </View>
);

const Board = ({ gameState, idPlayer, idOpponent }) => {
    const isPlayer1 = gameState?.currentTurn === 'player:1';
    const playerScore = isPlayer1 ? gameState.player1Score : gameState.player2Score;
    const opponentScore = isPlayer1 ? gameState.player2Score : gameState.player1Score;
    const playerDeck = isPlayer1 ? gameState.player1Deck : gameState.player2Deck;
    const opponentDeck = isPlayer1 ? gameState.player2Deck : gameState.player1Deck;

    return (
        <View style={styles.container}>
            <View style={[styles.row, { height: '5%' }]}>
                <OpponentInfos idOpponent={idOpponent} />
                <View style={styles.opponentTimerScoreContainer}>
                    <OpponentTimer time={isPlayer1 ? 0 : gameState.timer} />
                    <OpponentScore score={opponentScore} />
                </View>
            </View>
            <View style={[styles.row, { height: '25%' }]}>
                <OpponentDeck deck={opponentDeck} />
            </View>
            <View style={[styles.row, { height: '40%' }]}>
                <Grid grid={gameState.grid} />
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
                    <PlayerScore score={playerScore} />
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
        backgroundColor: "lightgrey"
    },
});
