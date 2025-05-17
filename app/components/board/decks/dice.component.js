import { TouchableOpacity, StyleSheet, Image } from 'react-native';

const dicePlaceholder = require('../../../assets/dice_placeholder.png');

const diceImages = [
    require('../../../assets/dice1.png'),
    require('../../../assets/dice2.png'),
    require('../../../assets/dice3.png'),
    require('../../../assets/dice4.png'),
    require('../../../assets/dice5.png'),
    require('../../../assets/dice6.png'),
];

const Dice = ({ index, value, locked, onPress, opponent }) => {
    const handlePress = () => {
        if (!opponent) {
            onPress(index);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.dice, locked && styles.lockedDice]}
            onPress={handlePress}
            disabled={opponent}
        >
            {value ?
                <Image source={diceImages[value - 1]} style={styles.image} /> :
                <Image source={dicePlaceholder} style={styles.placeHolderImage} />
            }
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    dice: {
        width: 40,
        height: 40,
        backgroundColor: 'lightblue',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockedDice: {
        backgroundColor: 'gray',
    },
    image: {
        width: 40,
        height: 40
    },
    placeHolderImage: {
        width: 45,
        height: 45
    }
});

export default Dice;
