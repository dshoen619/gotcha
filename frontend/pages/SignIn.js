import React from 'react'
import { StyleSheet,TouchableOpacity ,Text,TextInput, View ,Button, Alert} from 'react-native';
import AuthContext from '../context/AuthContext';

function SignInScreen({navigation}) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
  
    const { signIn } = React.useContext(AuthContext);
    const navigateSignUp = () =>{
        navigation.navigate('Sign Up')
    }
  
    return (
        <View style={styles.container}>
              <Text style={styles.logo}>Gotcha</Text>
              <View style={styles.inputView} >
                <TextInput  
                  style={styles.inputText}
                  placeholder="Email" 
                  placeholderTextColor="#003f5c"
                  value ={email}
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
              <TouchableOpacity>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button style={styles.loginBtn} title="Log In" onPress={() => signIn({ email, password })}/>
              <TouchableOpacity onPress={navigateSignUp} >
                <Text style={styles.loginText}>Signup</Text>
              </TouchableOpacity>
      
        
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
    loginBtn:{
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

export default SignInScreen;