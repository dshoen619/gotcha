// In MoverProfile component
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFonts, Cormorant_500Medium } from '@expo-google-fonts/cormorant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { isTokenValid } from '../api/auth';

const MoverProfile = ({ navigation, route, isLoggedIn }) => {
  const [fontsLoaded] = useFonts({
        Cormorant_500Medium,
      });
    
  const mover = route.params;
  const rating = mover.rating;
  const full_name = `${mover.first_name} ${mover.family_name}`;


  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars > 0 ? 1 : 0;

    const stars = [];

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesome key={i} name="star" size={30} color="gold" />);
    }

    // Half star (if applicable)
    if (halfStar) {
      stars.push(<FontAwesome key="half" name="star-half-full" size={30} color="gold" />);
    }

    // Remaining empty stars
    const emptyStars = 5 - fullStars - halfStar;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesome key={`empty-${i}`} name="star" size={30} color="gray" />);
    }

    return stars;
  };
  
  const openMessager = async() =>{
    let userToken = await AsyncStorage.getItem('userToken');
    const validToken = await isTokenValid(userToken)   
    console.log('token check 2', validToken)
    const userData = await AsyncStorage.getItem('userData') 

    if (validToken === undefined || !validToken.data.status){
      navigation.navigate('AuthStack', { route: route });
  } else {
      navigation.navigate('Messaging', {moverInfo: mover});
  }
    
}

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.top}>
        <View style={styles.profileImage}></View>
        <Text style={styles.nameText}>{full_name}</Text>
        <View style={styles.ratingContainer}>{renderStars()}</View>
        <Text style={styles.jobsComplete}>{mover.jobs_completed} Jobs Completed</Text>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.description}>
            {mover.description}
        </Text>
            <Pressable style={styles.buttonContainer} onPress={openMessager}>
                <Text style={styles.buttonText}>Message</Text>
            </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'silver',
    height: '45%', // Set the height to 45% of the screen
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    fontFamily:'Cormorant_500Medium'
  },
  jobsComplete:{
    fontStyle:'italic',
    fontSize:12,
    marginTop:7
  },
  bottom:{
    flex:1,
    alignItems:'center'
    
  },
  description:{
    color:'black',
    fontFamily:'Cormorant_500Medium',
    width:'90%',
    textAlign:'center',
    alignSelf:'center',
    fontSize:18,
    marginTop:10
  },
  buttonContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    marginTop:20
  },
  buttonText:{
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  }
});

export default MoverProfile;
