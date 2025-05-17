// app/components/board/board.component.js
import { View, Text, StyleSheet } from 'react-native';
import PlayerDeck from "./decks/player-deck.component";
import PlayerTimer from "./timers/player-timer-component";
import OpponentDeck from "./decks/opponent-deck.component";
import OpponentTimer from "./timers/opponent-timer-component";
import Choices from "./choices/choices.component";
import Grid from "./grid/grid.component";

const OpponentScore = ({ score, pions }) => (
    <View style={styles.opponentScoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.pionsText}>🪙 {pions}</Text>
    </View>
);

const PlayerScore = ({ score, pions }) => (
    <View style={styles.playerScoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.pionsText}>🪙 {pions}</Text>
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
                <Text>Opponent</Text>
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
                <Choices />
            </View>
            <View style={[styles.row, { height: '25%' }]}>
                <PlayerDeck deck={playerDeck} />
            </View>
            <View style={[styles.row, { height: '5%', borderColor: 'black', borderTopWidth: 1 }]}>
                <Text>Your board</Text>
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
        backgroundColor: '#fff',
    },
    row: {
        width: '100%',
    },
    opponentInfosContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    opponentTimerScoreContainer: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: 'black'
    },
    opponentScoreContainer: {
        alignItems: 'flex-end',
    },
    playerInfosContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    playerTimerScoreContainer: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    playerScoreContainer: {
        alignItems: 'flex-end',
    },
    scoreText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    pionsText: {
        fontSize: 12,
        color: '#555',
    },
});
