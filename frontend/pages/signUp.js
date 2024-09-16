import React,{useEffect, useState, useCallback} from 'react'
import { StyleSheet,TouchableOpacity ,Text,TextInput, View ,Button, Alert} from 'react-native';
import AuthContext from '../context/AuthContext';
import { signUp } from '../api/auth';

const WorkerDropdown = ({selectedValue,setSelectedValue,handleChange})=>{
  return (
    <div>
      <h1>Choose an option</h1>
      <select value={selectedValue} onChange={handleChange}>
        <option value="" disabled>Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
    </div>
  )
}

const WorkerSignUpForm = ({ email, setEmail, password, setPassword, passwordCheck, setPasswordCheck, handleSignUp, WorkerDropdown }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Gotcha</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Re-Type Password"
          placeholderTextColor="#003f5c"
          value={passwordCheck}
          onChangeText={setPasswordCheck}
          secureTextEntry
        />
      </View>

      <Button
        style={styles.signUpbtn}
        title="Sign Up"
        onPress={handleSignUp}
      />
    </View>
  );
};

// Define SignUpForm outside the main component
const RegularSignUpForm = ({ email, setEmail, password, setPassword, passwordCheck, setPasswordCheck, handleSignUp }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Gotcha</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Re-Type Password"
          placeholderTextColor="#003f5c"
          value={passwordCheck}
          onChangeText={setPasswordCheck}
          secureTextEntry
        />
      </View>
      <Button
        style={styles.signUpbtn}
        title="Sign Up"
        onPress={handleSignUp}
      />
    </View>
  );
};

function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [signUpType, setSignUpType] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange =(event) =>{
    setSelectedValue(event.target.value)
  }


  const isEmailValid = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Test the email against the regular expression
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    const isValid = isEmailValid(email)
    const passwordLength = 3

    if (!isValid){
      alert('Enter a valid email account')
    }
    else if (password !== passwordCheck){
      alert('Passwords do not match')
    }
    else if(password.length < passwordLength){
      alert( `Password must be at least ${passwordLength} characters`)
    }
    else{
        const signUpResponse = await signUp({email, password})
        if (signUpResponse.data === true){
            navigation.navigate('Sign In')
        } else if (signUpResponse.data === 'email_exists') {
            alert('Email already in use')
        }
    }
};

  if (signUpType === '') {
    return (
      <View style={styles.container}>
        <Button
          style={styles.signUpbtn}
          title="Regular Signup"
          onPress={() => setSignUpType('regular')}
        />
        <Button
          style={styles.signUpbtn}
          title="Worker Signup"
          onPress={() => setSignUpType('worker')}
        />
      </View>
    );
  }

  else if (signUpType === 'regular'){
    return (
      <RegularSignUpForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        passwordCheck={passwordCheck}
        setPasswordCheck={setPasswordCheck}
        handleSignUp={handleSignUp}
      />
    );
  }
  else if (signUpType === 'worker'){
    return(
      <WorkerSignUpForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      passwordCheck={passwordCheck}
      setPasswordCheck={setPasswordCheck}
      handleSignUp={handleSignUp}
      WorkerDropdown={<WorkerDropdown 
                          selectedValue={selectedValue}
                          setSelectedValue={setSelectedValue}
                          handleChange={handleChange}
      />}
    />
    )

  }
  
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