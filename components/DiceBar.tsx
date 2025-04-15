import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import Icon from '@mdi/react';
import { mdiDice1, mdiDice2, mdiDice3, mdiDice4, mdiDice5, mdiDice6 } from '@mdi/js';

const DiceBar: React.FC = () => {
  const [diceValues, setDiceValues] = useState<number[]>([]);
  const [selectedDice, setSelectedDice] = useState<number[]>([]);
  const [hoveredDice, setHoveredDice] = useState<number | null>(null);
  const scaleAnimations = useRef<Animated.Value[]>([]).current;

  const rollDice = () => {
    const newDiceValues = Array(5).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
    setDiceValues(newDiceValues);
    setSelectedDice([]);
    setHoveredDice(null);
    // Initialize animations for each dice
    scaleAnimations.length = 0;
    newDiceValues.forEach(() => {
      scaleAnimations.push(new Animated.Value(1));
    });
  };

  useEffect(() => {
    rollDice();
  }, []);

  useEffect(() => {
    // Update animations for all dice based on selection and hover state
    scaleAnimations.forEach((anim, index) => {
      const isSelected = selectedDice.includes(index);
      const isHovered = hoveredDice === index;
      const targetScale = isSelected || isHovered ? 1.2 : 1;
      
      Animated.spring(anim, {
        toValue: targetScale,
        useNativeDriver: true,
      }).start();
    });
  }, [selectedDice, hoveredDice]);

  const handleDicePress = (index: number) => {
    if (selectedDice.includes(index)) {
      setSelectedDice(selectedDice.filter(i => i !== index));
    } else {
      setSelectedDice([...selectedDice, index]);
    }
  };

  const handleValidate = () => {
    // TODO: Implement validate logic
    console.log('Validating selected dice:', selectedDice);
  };

  const handleReroll = () => {
    // TODO: Implement reroll logic
    console.log('Rerolling dice');
    rollDice();
  };

  const getDiceIcon = (number: number) => {
    const diceIcons = {
      1: mdiDice1,
      2: mdiDice2,
      3: mdiDice3,
      4: mdiDice4,
      5: mdiDice5,
      6: mdiDice6,
    };
    return diceIcons[number as keyof typeof diceIcons];
  };

  return (
    <View style={styles.container}>
      <View style={styles.diceContainer}>
        {diceValues.map((value, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleDicePress(index)}
            onPressIn={() => setHoveredDice(index)}
            onPressOut={() => setHoveredDice(null)}
            activeOpacity={1}
          >
            <Animated.View
              style={[
                styles.dice,
                selectedDice.includes(index) && styles.selectedDice,
                {
                  transform: [
                    { scale: scaleAnimations[index] || 1 },
                  ],
                },
              ]}
            >
              <Icon path={getDiceIcon(value)} size={1.5} color={selectedDice.includes(index) ? '#fff' : '#000'} />
            </Animated.View>
          </TouchableOpacity>
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 30,
  },
  diceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dice: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  selectedDice: {
    backgroundColor: '#4CAF50',
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  }
});

export default DiceBar; 