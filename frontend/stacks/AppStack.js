import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, Modal, View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Cormorant_500Medium } from '@expo-google-fonts/cormorant';
import { NavigationContainer, CommonActions, useNavigation } from '@react-navigation/native';

// Import your pages here
import Homepage from '../pages/homePage';
import MovingPage from '../pages/movingPage';
import MoverProfile from '../pages/moverProfile';
import SignInScreen from '../pages/SignIn';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTokenValid } from '../api/auth';
import Chat from '../pages/Chat';
import Messaging from '../pages/Messaging'

const Stack = createNativeStackNavigator();

export default function AppStack() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [validToken, setValidToken] = useState(null);

  
  // Assuming initial state is not logged in
  const [fontsLoaded] = useFonts({
    Cormorant_500Medium,
  });
  const navigation = useNavigation()

  const handleLogin = () => {
    // Perform login actions here
    setIsLoggedIn(true); // Update login status
  };

  const handleLogout = async() => {
    // Perform logout actions here
    await AsyncStorage.clear()
    setValidToken(false); // Update login status
    navigation.navigate('Homepage')
    
  };


  const MenuButton = ({ isLoggedIn, onLogout }) => {
    const navigation = useNavigation(); // Ensure navigation is available
  
    useEffect(() => {
      const fetchToken = async () => {
        try {
          const userToken = await AsyncStorage.getItem('userToken');
          const tokenIsValid = await isTokenValid(userToken);
          setValidToken(tokenIsValid.data.status);
        } catch (error) {
          console.error('Error fetching user token:', error);
        }
      };
      fetchToken();
    }, []); // Refetch token when isLoggedIn changes
  
    return (
      <View style={styles.menuButtonContainer}>
        {!validToken ? (
          <Menu>
            <MenuTrigger>
              <FontAwesomeIcon icon={faBars} size={32} />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => navigation.navigate('AuthStack', { route: null })}>
                <Text style={styles.menuOption}>Login</Text>
              </MenuOption>
              <MenuOption onSelect={() => alert(`About`)} style={styles.menuOption}>
                <Text style={styles.menuOption}>About</Text>
              </MenuOption>
              <MenuOption onSelect={() => navigation.navigate(`Homepage`, {route: null})}>
                <Text style={styles.menuOption}>Home</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        ) : (
          <Menu>
            <MenuTrigger>
              <FontAwesomeIcon icon={faBars} size={32} />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={handleLogout}>
                <Text style={styles.menuOption}>Log Out</Text>
              </MenuOption>
              <MenuOption onSelect={() => navigation.navigate(`Homepage`, {route: null})}>
                <Text style={styles.menuOption}>Home</Text>
              </MenuOption>
              <MenuOption onSelect={() => navigation.navigate('Chat')}>
                <Text style={styles.menuOption}>Messages</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </View>
    );
  };
  

  return (
  <View style={{ flex: 1 }}>

    <MenuButton />

      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide the header
        }}
      >
        <Stack.Screen name = "Homepage" component={Homepage} />
        <Stack.Screen name = "MovingPage" component={MovingPage} />
        <Stack.Screen name = "MoverProfile" component={MoverProfile} />
        <Stack.Screen name = "Chat" component={Chat} />
        <Stack.Screen name = "Messaging" component={Messaging} />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  menuButtonContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    zIndex: 999, // Ensure it appears above other content
    paddingHorizontal: 10, // Adjust padding as needed
    paddingTop: 10,
    marginBottom:50,
  },
menuOption:{
  fontFamily:'Cormorant_500Medium'
}
});