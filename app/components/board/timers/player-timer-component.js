import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../../contexts/socket.context";
import { Text, View } from "react-native";

const PlayerTimer = () => {
    const socket = useContext(SocketContext);
    const [playerTimer, setPlayerTimer] = useState(0);

    useEffect(() => {
        socket.on("game.timer", (data) => {
            setPlayerTimer(data['playerTimer'])
        });
    }, []);

    return (
        <View>
            <Text>Timer: {playerTimer}</Text>
        </View>
    );
};

export default PlayerTimer;