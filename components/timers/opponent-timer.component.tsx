import { SocketContext } from "@/app/contexts/socket.context";
import { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function OpponentTimer() {
    const socketContext = useContext(SocketContext);
    const [opponentTimer, setOpponentTimer] = useState(0);
    const { socket } = socketContext;

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