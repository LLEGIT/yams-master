import React, { useEffect, useState, useContext, useRef } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { SocketContext } from '../../../contexts/socket.context';

const Timer = () => {
    const socket = useContext(SocketContext);
    const [duration, setDuration] = useState(0); // in milliseconds
    const [isEnd, setIsEnd] = useState(false);
    const [displayTime, setDisplayTime] = useState('00.000');
    const intervalRef = useRef(null);

    useEffect(() => {
        socket.on("game.timer", (seconds) => {
            const newDuration = seconds * 1000;
            setDuration(newDuration);
            setIsEnd(false);

            if (intervalRef.current) clearInterval(intervalRef.current);

            const startTime = Date.now();
            intervalRef.current = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, newDuration - elapsed);

                const s = Math.floor(remaining / 1000);
                const ms = remaining % 1000;
                setDisplayTime(`${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`);

                if (remaining <= 0) {
                    clearInterval(intervalRef.current);
                }
            }, 16); // ~60fps
        });

        socket.on("game.end", () => {
            setIsEnd(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
        });

        return () => {
            socket.off("game.timer");
            socket.off("game.end");
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <>
            {!isEnd &&
                <View style={styles.timerContainer}>
                    <Text style={styles.text}>{displayTime}</Text>
                </View>
            }
        </>
    );
};

const styles = StyleSheet.create({
    timerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 12,
        borderWidth: 3,
        borderColor: '#222',
        width: 200,
    },
    text: {
        fontSize: 42,
        fontWeight: 'bold',
        fontFamily: 'Courier',
        color: '#ff1e1e',
        letterSpacing: 2,
        textShadowColor: '#ff1e1e',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    }
});

export default Timer;
