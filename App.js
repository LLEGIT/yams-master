import React, { Fragment } from 'react';
import { LogBox, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './app/screens/home.screen';
import { SocketContext, socket } from './app/contexts/socket.context';
import OnlineGameScreen from './app/screens/online-game.screen';
import VsBotGameScreen from './app/screens/vs-bot-game.screen';

const Stack = createStackNavigator();
LogBox.ignoreAllLogs(true);

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="OnlineScreen" component={OnlineGameScreen} />
          <Stack.Screen name="VsBotScreen" component={VsBotGameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketContext.Provider>
  );
}

export default App;