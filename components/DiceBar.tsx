import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Dice from './decks/dice.component';

const DiceBar = ({ opponent }: { opponent: boolean }) => {
  const [diceValues, setDiceValues] = useState<number[]>([]);
  const [lockedDice, setLockedDice] = useState<number[]>([]);

  const rollDice = () => {
    const newDiceValues = Array(5).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
    setDiceValues(newDiceValues);
    setLockedDice([]); // reset locks on roll
  };

  useEffect(() => {
    rollDice();
  }, []);

  const handleDicePress = (index: number) => {
    if (lockedDice.includes(index)) {
      setLockedDice(lockedDice.filter(i => i !== index));
    } else {
      setLockedDice([...lockedDice, index]);
    }
  };

  const handleValidate = () => {
    console.log('Validating locked dice:', lockedDice);
  };

  const handleReroll = () => {
    console.log('Rerolling dice');
    rollDice();
  };

  return (
    <View style={styles.container}>
      <View style={styles.diceContainer}>
        {diceValues.map((value, index) => (
          <Dice
            key={index}
            index={index}
            value={value}
            locked={lockedDice.includes(index)}
            onPress={handleDicePress}
            opponent={opponent}
          />
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.rerollButton]} onPress={handleReroll}>
          <Text style={styles.buttonText}>Relancer 🔄</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.validateButton]} onPress={handleValidate}>
          <Text style={styles.buttonText}>Valider ✔️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
  },
  diceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  validateButton: {
    backgroundColor: '#67eb69',
  },
  rerollButton: {
    backgroundColor: '#38afff',
  },
});

export default DiceBar;
