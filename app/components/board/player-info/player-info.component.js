import { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { SocketContext } from '../../../contexts/socket.context';

const PlayerInfo = () => {

    const socket = useContext(SocketContext);
    const [playerScore, setPlayerScore] = useState(0);
    const [playerTokens, setPlayerTokens] = useState(12);

    useEffect(() => {

        socket.on("game.player-info.view-state", (data) => {
            setPlayerScore(data['score']);
            setPlayerTokens(data['tokens']);
            console.log(data);
        });

    }, []);

    return (

        <View style={styles.playerInfosContainer}>

            <View style={styles.row}>
                <Text style={styles.playerInfosText}>
                    Your tokens: {playerTokens}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.playerInfosText}>
                    Your score: {playerScore}
                </Text>
            </View>

        </View>

    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerInfosContainer: {
        alignItems: 'start',
        width: '35%',
        paddingLeft: "8%",
    },
    playerInfosText: {
        marginLeft: 5,
        fontSize: 14,
        fontWeight: 'bold'
    },
});

export default PlayerInfo;
