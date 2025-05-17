import { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { SocketContext } from '../../../contexts/socket.context';

const OpponentInfo = () => {

    const socket = useContext(SocketContext);
    const [playerScore, setPlayerScore] = useState(0);
    const [playerTokens, setPlayerTokens] = useState(12);

    useEffect(() => {

        socket.on("game.opponent-info.view-state", (data) => {
            setPlayerScore(data['score']);
            setPlayerTokens(data['tokens']);
            console.log(data);
        });

    }, []);

    return (

        <View style={styles.playerInfosContainer}>

            <View style={styles.row}>
                <Text style={styles.playerInfosText}>
                    Tokens: {playerTokens}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.playerInfosText}>
                    Score: {playerScore}
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
        alignItems: 'flex-end',
        width: '35%',
        paddingRight: "8%",
    },
    playerInfosText: {
        marginRight: 5,
        fontSize: 14,
        fontWeight: 'bold',
        color: "red"
    },
});

export default OpponentInfo;
