import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView
} from 'react-native';
import { useFonts, Cormorant_500Medium } from '@expo-google-fonts/cormorant';
import AsyncStorage from '@react-native-async-storage/async-storage';




const MovingPage = ({ navigation,route }) => {
  const movers = route.params.movers
  const [movingPageOpen, setMovingPageOpen] = useState(true);
  const [moverProfileOpen, setUserProfileOpen] = useState(false);

  const [fontsLoaded] = useFonts({
    Cormorant_500Medium,
  });

  const handleCardPress = async (mover) => {
    const token = await AsyncStorage.getItem('userToken')

    navigation.navigate('MoverProfile', mover)
  };

  const CardView = ({ title, description, onPress }) => {
    return (
      <Pressable onPress={onPress} style={styles.card}>
        <View style={styles.avatarContainer}>
            <Text>{title[0]}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
    {movingPageOpen && (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Movers Near You</Text>
        </View>
        {movers.map((mover, index) => (
          <CardView
            key={index}
            title={mover.first_name}
            description={mover.location}
            onPress={() => handleCardPress(mover)}
          />
        ))}
      </View>
    )}
  </ScrollView>
);
};

const styles = StyleSheet.create({
  scroll: {
    marginTop: 20,
    width: '100%',
    flexGrow: 1,
  },
  container: {
    flex: 1,
    width: '90%',
    alignContent:'center',
    alignSelf:'center'
},

  header: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 5,
    marginTop: 0,
    padding: 20,
  },
  headerText: {
    fontFamily: 'Cormorant_500Medium',
    fontSize: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: '1%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Cormorant_500Medium',
  },
  cardDescription: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Cormorant_500Medium',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MovingPage;
