import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from '@mdi/react';
import { mdiDice1, mdiDice2, mdiDice3, mdiDice4, mdiDice5, mdiDice6 } from '@mdi/js';

interface GridCellProps {
  content: string | number;
  isGrey?: boolean;
}

const GridCell: React.FC<GridCellProps> = ({ content, isGrey = true }) => {
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
    <View style={[styles.cell, { backgroundColor: isGrey ? '#e2e2e2' : '#ffff' }]}>
      {typeof content === 'number' ? (
        <Icon path={getDiceIcon(content)} size={1} />
      ) : (
        <Text style={styles.cellText}>{content}</Text>
      )}
    </View>
  );
};

const YamsGrid: React.FC = () => {
  const grid = [
    [1, 3, 'Challenge', 4, 6],
    [2, 'Four of\na kind', 'One shot', 'Full', 5],
    ['≤8', 'Full', 'Yam', 'Challenge', 'Straight'],
    [6, 'One shot', 'Straight', '≤8', 1],
    [3, 2, 'Four of\na kind', 5, 4],
  ];

  return (
    <View style={styles.container}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, cellIndex) => (
            <GridCell
              key={`${rowIndex}-${cellIndex}`}
              content={cell}
              isGrey={typeof cell === 'number'}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    margin: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  cellText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default YamsGrid;
