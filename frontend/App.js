import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';



import AppStack from './stacks/AppStack';
import AuthStack from './stacks/AuthStack';
import AuthContext from './context/AuthContext';
import * as SecureStore from 'expo-secure-store'
import { signIn } from './api/auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuProvider } from 'react-native-popup-menu';


const Stack = createNativeStackNavigator()


const App = () =>{

    return (
   <MenuProvider>
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="AppStack" component={AppStack} options={{headerShown:false}}/>
        <Stack.Screen name="AuthStack" component ={AuthStack} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>   
   </MenuProvider>
                 


    )
}

export default App;