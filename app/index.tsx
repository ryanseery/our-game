import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function HomeScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>Poké Duels</Text>
      <Link href="/our-game/arena" style={styles.button}>
        <Text style={styles.buttonText}>Play Game</Text>
      </Link>
    </View>
  );
}
