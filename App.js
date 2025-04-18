import React from 'react';
import { LogBox, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './app/screens/home.screen';
import { SocketContext, socket } from './app/contexts/socket.context';
import OnlineGameScreen from './app/screens/online-game.screen';
import VsBotGameScreen from './app/screens/vs-bot-game.screen';
import { AuthContext, AuthProvider } from './app/contexts/auth.context';
import UsernameScreen from './app/screens/username.screen';

const Stack = createStackNavigator();
LogBox.ignoreAllLogs(true);

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <SocketContext.Provider value={socket}>
          <AuthContext.Consumer>
            {({ username, isLoading }) => {
              if (isLoading) return null;
              return (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  {!username ? (
                    <Stack.Screen name="UsernameScreen" component={UsernameScreen} />
                  ) : (
                    <>
                      <Stack.Screen name="HomeScreen" component={HomeScreen} />
                      <Stack.Screen name="OnlineScreen" component={OnlineGameScreen} />
                      <Stack.Screen name="VsBotScreen" component={VsBotGameScreen} />
                    </>
                  )}
                </Stack.Navigator>
              );
            }}
          </AuthContext.Consumer>
        </SocketContext.Provider>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;