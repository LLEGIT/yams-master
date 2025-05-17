import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './app/screens/home.screen';
import OnlineGameScreen from './app/screens/online-game.screen';
import VsBotGameScreen from './app/screens/vs-bot-game.screen';

import { SocketContext, socket } from './app/contexts/socket.context';
import { AuthContext, AuthProvider } from './app/contexts/auth.context';
import LoginScreen from './app/screens/login.screen';
import RegisterScreen from './app/screens/register.screen';

const Stack = createStackNavigator();
LogBox.ignoreAllLogs(true);

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <NavigationContainer>
        <AuthProvider>
          <SocketContext.Provider value={socket}>
            <AuthContext.Consumer>
              {({ username, isLoading }) => {
                if (isLoading) return null;
                return (
                  <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {!username ? (
                      <>
                        <Stack.Screen name="LoginScreen" component={LoginScreen} />
                        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                      </>

                    ) : (
                      <>
                        <Stack.Screen name="HomeScreen" component={HomeScreen} />
                        <Stack.Screen name="OnlineGameScreen" component={OnlineGameScreen} />
                        <Stack.Screen name="VsBotGameScreen" component={VsBotGameScreen} />
                      </>
                    )}
                  </Stack.Navigator>
                );
              }}
            </AuthContext.Consumer>
          </SocketContext.Provider>
        </AuthProvider>
      </NavigationContainer>
    </SocketContext.Provider >
  );
}

export default App;
