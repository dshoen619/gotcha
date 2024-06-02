import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Pressable, Button } from 'react-native';
import { useFonts, Cormorant_500Medium } from '@expo-google-fonts/cormorant';
import { Card } from '@rneui/themed';
import { showMovers } from '../api/auth';
import MovingPage from './movingPage';
import { useEffect, useState } from 'react';

const Homepage = ({navigation}) => {
  var movingImage = require("../assets/static/moving.jpg")
  var cleaningImage = require("../assets/static/cleaningImage.jpeg")
  const [movingPageOpen, setMovingPageOpen] = useState(false)
  const [taskSelectionOpen, setTaskSelectionOpen] = useState(true)
  const [moversData, setMoversData] = useState()

  const [fontsLoaded] = useFonts({
    Cormorant_500Medium,
  });
  const tasksList = [
    {
      id:1,
      task: 'Moving',
      avatar: movingImage, 
      press:handleMovingPress
    },
    {
      id:2,
      task: 'Cleaning',
      avatar: cleaningImage,

    },


  ];
  const handleMovingPress =async ()=>{
    try {
      const response = await showMovers();
      setMoversData(response.data);

      // Navigate only if moversData is truthy
      moversData && navigation.navigate('MovingPage', {movers: moversData });
    } catch (error) {
      console.log(error);
      // Handle error appropriately
    }
  };
  const GoBackButton = () =>{
    return(
      <View style={styles.backButtonView}>
        <Button
          style={styles.backButton}
          title="Back"
          color='gray'
          font='Cormorant_500Medium'
          onPress={() => {
            setMovingPageOpen(false);
            setTaskSelectionOpen(true);
          }}
        ></Button>

      </View>
      

    )
  }

  return (
<ScrollView
  contentContainerStyle={[
    styles.container,
    {
      flexDirection: 'column',
      alignItems: 'center',
    },
  ]}
>
<View style={styles.container}>
  {taskSelectionOpen ? (
    <>
      <View style={styles.header}>
        <Text style={styles.header_text}>What Do You Need Help With?
        </Text>
      </View>

      <View style={styles.cardContainer}>
        {tasksList.map(u => (
          <Pressable
            key={u.id}
            onPress={handleMovingPress}
          >
            <Card >
              <Card.Title style={{
                fontFamily: 'Cormorant_500Medium',
              }}>
                {u.task}
                </Card.Title>
              <Card.Divider />
              <View>
                <Image
                  style={styles.image}
                  resizeMode="cover"
                  source={u.avatar}
                />
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </>
  ) : null}
</View>

</ScrollView>
 



  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems:'center',
    position:'relative'
  },
  header: {
    flex: 1,
  },
  cardContainer: {
    flex: 4,
    marginTop: 10,
    width:300,
    alignItems:'center',
    fontFamily: 'Cormorant_500Medium',
  },
  header_text: {
    fontFamily: 'Cormorant_500Medium',
    textAlign: 'center',
    fontSize: 30,
    marginTop: 10,
    padding:10,  
  },

  image: {
    // Define your image style here if needed
    // width: '100%',
    // height: '100%',
    width:200,
    height:200
  },
  backButtonView:{
    position:'absolute',
    top:10,
    left:10,
    padding:10,
    marginTop:10,
  },
  backButton:{
    fontFamily:'Cormorant_500Medium',
    color:'gray'
  }
});

export default Homepage;
