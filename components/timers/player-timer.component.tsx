// app/components/board/timers/player-timer.component.js

import { SocketContext } from "@/app/contexts/socket.context";
import { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function PlayerTimer() {
    const socketContext = useContext(SocketContext);
    const [playerTimer, setPlayerTimer] = useState<number>(0);
    const { socket } = socketContext;

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
