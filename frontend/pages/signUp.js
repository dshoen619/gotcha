import React from 'react'
import { StyleSheet,TouchableOpacity ,Text,TextInput, View ,Button, Alert} from 'react-native';
import AuthContext from '../context/AuthContext';

function SignUpScreen({navigation}) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordCheck, setPasswordCheck] = React.useState('')
    const passwordLength = 4
  
    const { signUp } = React.useContext(AuthContext);

    const isEmailValid = (email) => {
        // Regular expression for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
        // Test the email against the regular expression
        return emailRegex.test(email);
      };

    const handleSignUp = async (email, password, passwordCheck) =>{
        const isValid = isEmailValid(email)

        if (!isValid){
            alert('Enter an email Account')
        }
        else if (password !== passwordCheck){
            alert('Passwords do not match')
        }
        else if(password.length < passwordLength){
            alert( `Password must be at least ${passwordLength} characters`)
        }
        else{
            const signUpResponse = await signUp({email, password})
            if (signUpResponse===true){
                navigation.navigate('Sign In')
            }else if (signUpResponse === 'email_exists')
            {
                alert('Email already in Use')
            }
        }
        
    }
  
    return (
        <View style={styles.container}>
              <Text style={styles.logo}>Gotcha</Text>
              <View style={styles.inputView} >
                <TextInput  
                  style={styles.inputText}
                  placeholder="Email" 
                  placeholderTextColor="#003f5c"
                //   value ={email}
                  onChangeText={setEmail}/>
              </View>
              <View style={styles.inputView} >
                <TextInput  
                  style={styles.inputText}
                  placeholder="Password" 
                  placeholderTextColor="#003f5c"
                  onChangeText={setPassword}
                  secureTextEntry/>
              </View>
              <View style={styles.inputView} >
                <TextInput  
                  style={styles.inputText}
                  placeholder="Re-Type Password" 
                  placeholderTextColor="#003f5c"
                  onChangeText={setPasswordCheck}
                  secureTextEntry/>
              </View>

              <Button style={styles.signUpbtn} title="Sign Up" onPress={() => handleSignUp(email, password, passwordCheck)}/>
      
        
            </View>
          );
        }


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#003f5c',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo:{
      fontWeight:"bold",
      fontSize:50,
      color:"#fb5b5a",
      marginBottom:40
    },
    inputView:{
      width:"80%",
      backgroundColor:"#465881",
      borderRadius:25,
      height:50,
      marginBottom:20,
      justifyContent:"center",
      padding:20
    },
    inputText:{
      height:50,
      color:"white"
    },
    forgot:{
      color:"white",
      fontSize:11
    },
    signUpbtn:{
      width:"80%",
      backgroundColor:"#fb5b5a",
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:40,
      marginBottom:10
    },
    loginText:{
      color:"white"
    }
  });

export default SignUpScreen;