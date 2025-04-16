import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../../contexts/socket.context";
import { Text, View } from "react-native";

const OpponentTimer = () => {
    const socket = useContext(SocketContext);
    const [opponentTimer, setOpponentTimer] = useState(0);

    useEffect(() => {

        socket.on("game.timer", (data) => {
            setOpponentTimer(data['opponentTimer'])
        });

    }, []);
    return (
        <View>
            <Text>Timer: {opponentTimer}</Text>
        </View>
    );
};

export default OpponentTimer;
