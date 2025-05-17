// app/components/board/choices/choices.component.js

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../../contexts/socket.context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Choices = () => {

    const socket = useContext(SocketContext);

    const [displayChoices, setDisplayChoices] = useState(false);
    const [canMakeChoice, setCanMakeChoice] = useState(false);
    const [idSelectedChoice, setIdSelectedChoice] = useState(null);
    const [availableChoices, setAvailableChoices] = useState([]);

    useEffect(() => {

        socket.on("game.choices.view-state", (data) => {
            setDisplayChoices(data['displayChoices']);
            setCanMakeChoice(data['canMakeChoice']);
            setIdSelectedChoice(data['idSelectedChoice']);
            setAvailableChoices(data['availableChoices']);
        });

    }, []);

    const handleSelectChoice = (choiceId) => {
        if (canMakeChoice) {
            setIdSelectedChoice(choiceId);
            socket.emit("game.choices.selected", { choiceId });
        }

    };

    return (
        <View style={styles.choicesContainer}>
            {displayChoices &&
                availableChoices.map((choice) => (
                    <TouchableOpacity
                        key={choice.id}
                        style={[
                            styles.choice,
                            idSelectedChoice === choice.id && styles.selectedChoice,
                            !canMakeChoice && styles.disabledChoice
                        ]}
                        onPress={() => handleSelectChoice(choice.id)}
                        disabled={!canMakeChoice}
                    >
                        <Text>{choice.value}</Text>
                    </TouchableOpacity>
                ))}
        </View>
    );
};

export default Choices;

const styles = StyleSheet.create({
    choicesContainer: {
        marginTop: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    choice: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'white',
    },
    selectedChoice: {
        backgroundColor: 'lightgreen',
        borderColor: 'green',
    },
    disabledChoice: {
        opacity: 0.5,
    },
});
