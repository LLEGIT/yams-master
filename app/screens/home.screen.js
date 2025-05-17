import { Image, StyleSheet, Text, View } from "react-native";
import PillButton from "../components/button/button.component";
import { TouchableOpacity } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";

export default function HomeScreen({ navigation }) {
  const { username, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Image style={{ width: 200, height: 200, borderRadius: 20 }} source={require('./../assets/image/logo.png')} />
      <Text style={styles.welcomeText}>Welcome back {username ?? 'anonymous'}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('OnlineGameScreen')}>
        <PillButton title="Play online" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('VsBotGameScreen')}>
        <PillButton title="Play against a bot" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => logout()}>
        <PillButton title="Logout" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 50,
  },
  welcomeText: {
    fontStyle: 'italic',
    fontSize: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 46,
    fontWeight: "bold",
    marginBottom: 50,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222222",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});
