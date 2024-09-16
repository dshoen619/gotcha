import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,Button, Alert} from 'react-native';
import Homepage from '../pages/homePage';
import { NavigationContainer, CommonActions, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MovingPage from '../pages/movingPage';
import MoverProfile from '../pages/moverProfile';
import SignInScreen from '../pages/SignIn';
import AuthContext from '../context/AuthContext';
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn, signUp, signUpWorker } from '../api/auth';
import SignUpScreen from '../pages/signUp';
import { useState, useEffect } from 'react';

const Stack = createNativeStackNavigator()


export default function AuthStack(route){
  const [isReadyForNavigation, setIsReadyForNavigation] = useState(false);
  const [previousPageData, setPreviousPageData] = useState(null)
  const [previousPath, setPreviousPath] = useState(null)
  const navigation = useNavigation();

  useEffect(() => {
    if (route.route.params.route) {
      const previousPageParams = route.route.params;
      setPreviousPath(previousPageParams.route.name);
      setPreviousPageData(route.route.params.route.params);
      setIsReadyForNavigation(true);

    }
    else{
      setPreviousPath('Homepage')
    }
  }, [route]);

  const [state,dispatch] = React.useReducer(
    (prevstate,action) => {
        switch(action.type) {
            case 'RESTORE_TOKEN':
                return {
                    ...prevstate,
                    userToken: action.token,
                    isLoading:false,
                };
            case 'SIGN_IN':

                return {
                    ...prevstate,
                    isSignout:false,
                    userToken: action.token,
                };
            case 'SIGN_OUT':
                return{
                    ...prevstate,
                    isSignout: true,
                    userToken: null,
                };
        }
    },
    {
        isLoading: true,
        isSignout: false,
        userToken: null,    
    }
);

React.useEffect(() =>{
    const bootstrapAsync = async () =>{
        let userToken;
        try {
            userToken = await AsyncStorage.getItem('userToken');
        } catch (e) {
            console.log(e)
        }
        dispatch({type:'RESTORE_TOKEN', token: userToken})
    };
    bootstrapAsync();
}, []);


const authContext = React.useMemo( () => ({
    signIn: async(data) =>{

        const email = data.email
        const password = data.password

        const signIndData = {email, password}
        const response = await signIn(signIndData)
        const responseData = response.data

        console.log('responseData',responseData)
        
        if (responseData != false) {
            await AsyncStorage.setItem('userData', responseData[0])
            await AsyncStorage.setItem('userToken', responseData[0].token);
            dispatch({type:'SIGN_IN', token: responseData[0].token})
            
            navigation.dispatch(
              CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'AppStack', params: { screen: previousPath, params:previousPageData } }],
              })
          );

        }
        else{
            dispatch({type:'SIGN_IN', token: null})
            alert('Incorrect email and/or password')
        }
        
    },
    signOut: ()=> dispatch({type: 'SIGN_OUT'}),
    signUp: async (data) => {
      const email = data.email;
      const password = data.password;
      const signUpData = { email, password };
    
      try {
        const response = await signUp(signUpData);
        return response.data

      } catch (error) {
        console.error('Error during sign-up:', error);
      }
    },
    signUpWorker: async (data) => {
      const email = data.email;
      const password = data.password;
      const signUpData = { email, password };
    
      try {
        const response = await signUpWorker(signUpData);
        return response.data

      } catch (error) {
        console.error('Error during sign-up:', error);
      }
    },

}),
[previousPageData, navigation]
);
   
    return(    
      <AuthContext.Provider value={authContext}>
        <Stack.Navigator>
          <Stack.Screen name="Sign In" component={SignInScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Sign Up" component={SignUpScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
      </AuthContext.Provider> 
    )
  }

