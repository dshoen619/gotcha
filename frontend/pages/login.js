import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,Button, Alert} from 'react-native';

export default function Login() {



  return (
    <View style={styles.container}>
      <Button 
      title="hello"
      onPress={alertPress}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});