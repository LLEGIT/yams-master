import React from "react";
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import YamsGrid from "./YamsGrid";
import DiceBar from "./DiceBar";

interface BoardLayoutProps {
  gameViewState: any; // TODO: Define proper type for gameViewState
}

const OpponentInfos = () => {
  return (
    <View style={styles.opponentInfosContainer}>
      <Text>Opponent infos</Text>
    </View>
  );
};

const OpponentTimer = () => {
  return (
    <View style={styles.timerContainer}>
      <Text>Timer: </Text>
    </View>
  );
};

const OpponentScore = () => {
  return (
    <View style={styles.scoreContainer}>
      <Text>Score: </Text>
    </View>
  );
};

const OpponentDeck = () => {
  return (
    <View style={styles.deckContainer}>
      <DiceBar />
    </View>
  );
};

const Choices = () => {
  return (
    <View style={styles.choicesContainer}>
      <Text>Choices</Text>
    </View>
  );
};

const PlayerDeck = () => {
  return (
    <View style={styles.deckContainer}>
      <DiceBar />
    </View>
  );
};

const PlayerInfos = () => {
  return (
    <View style={styles.playerInfosContainer}>
      <Text>Player Infos</Text>
    </View>
  );
};

const PlayerTimer = () => {
  return (
    <View style={styles.timerContainer}>
      <Text>Timer: </Text>
    </View>
  );
};

const PlayerScore = () => {
  return (
    <View style={styles.scoreContainer}>
      <Text>PlayerScore</Text>
    </View>
  );
};

const BoardLayout: React.FC<BoardLayoutProps> = ({ gameViewState }) => {
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.gameFoundHeader}>
          <Text style={styles.gameFoundText}>Now playing !</Text>
        </View>

        {/* Players Header */}
        <View style={styles.playersHeader}>
          <Text style={styles.playerHeaderText}>Player - {gameViewState?.opponentName || "Unknown name"}</Text>
          <Text>- vs -</Text>
          <Text style={styles.playerHeaderText}>Player - You</Text>
        </View>

        {/* Opponent Info Bar */}
        <View style={styles.infoBar}>
          <View style={styles.infoBarLeft}>
            <OpponentInfos />
          </View>
          <View style={styles.infoBarRight}>
            <OpponentTimer />
            <OpponentScore />
          </View>
        </View>

        {/* Opponent Deck */}
        <View style={styles.deckSection}>
          <OpponentDeck />
        </View>

        {/* Main Game Area */}
        <View style={styles.mainGameArea}>
          <View style={styles.gridContainer}>
            <YamsGrid />
          </View>
          <View style={styles.choicesSection}>
            <Choices />
          </View>
        </View>

        {/* Player Deck */}
        <View style={styles.deckSection}>
          <PlayerDeck />
        </View>

        {/* Player Info Bar */}
        <View style={styles.infoBar}>
          <View style={styles.infoBarLeft}>
            <PlayerInfos />
          </View>
          <View style={styles.infoBarRight}>
            <PlayerTimer />
            <PlayerScore />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gameFoundHeader: {
    
  },
  gameFoundText: {

  },
  playersHeader: {

  },
  playerHeaderText: {
 
  },
  infoBar: {
  },
  infoBarLeft: {
  
  },
  infoBarRight: {
    
  },
  deckSection: {
   
  },
  mainGameArea: {

  },
  gridContainer: {

  },
  choicesSection: {

  },
  opponentInfosContainer: {

  },
  timerContainer: {

  },
  scoreContainer: {

  },
  deckContainer: {
 
  },
  choicesContainer: {

  },
  playerInfosContainer: {

  },
});

export default BoardLayout;
