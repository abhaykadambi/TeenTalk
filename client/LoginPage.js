import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Picker,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator'; // Import the library
import { auth, db } from './firebase';
import {  signInWithEmailAndPassword, createUserWithEmailAndPassword  } from 'firebase/auth';
import { ref, set } from 'firebase/database';

// import { FIREBASE_AUTH } from './FirebaseConfig';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [name, setName] = useState('');
  const [acctType, setAcctType] = useState()
  // const auth = FIREBASE_AUTH.auth();
  
  function initUserInDatabase(userId, email){
    set(ref(db, 'users/' + userId), {
      username: name,
      email: email,
      timeSpent: 0,
      peopleHelped: 0,
      accountType: acctType
    }).then(()=>{
      //alert('data saved')
    }).catch((error) => {
      alert(error)
    })
  }

  const handleAccountTypeChange = (value) => {
    setAcctType(value); // Set the selected value in the state
  };

  const handleLogin = async () => {

       signInWithEmailAndPassword(auth, email, password)
        .then( async (userCredential) => {
            // Signed in
            const user = userCredential.user;
            // navigate("/home")
            // alert("logged in")
             let userInfo = {email:user.email, username:user.displayName,
                          peopleHelped:0,
                          volunteerHours:0}
            await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            
            navigation.navigate("Main")
            console.log(user.email);

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("something went wrong",errorCode, errorMessage)
        });
    //firebase login
    

    //old login
    // try {
    //   if (!EmailValidator.validate(email)) {
    //     Alert.alert('Invalid Email', 'Please enter a valid email address.');
    //     return;
    //   }
    //  if(password != ""){
    //    alert('password meets requirements' + email + password)
    //    await axios.post('http://192.168.1.245:8080/login', {
    //          email:email,
    //          password:password,
    //        }).then(async function (response) {
    //          if(response.data.success==false){
    //           alert('invalid credentials' + response)
    //           console.log(response.data.success)
    //           return
    //          } else {
    //           console.log(response.data.success)
    //           alert('good login')
    //           await AsyncStorage.setItem('isLoggedIn', "true");
    //           console.log("the user name is" + response.data.username)
    //           let userInfo = {email:email, username:response.data.username,
    //           peopleHelped:response.data.peopleHelped,
    //           volunteerHours:response.data.volunteerHours}
    //           console.log("the user info is:" + userInfo.email)
    //           await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    //           navigation.navigate("Main");
    //          }
    //      })
    //      .catch(function (error) {
    //          console.log(error);
    //      });
    //  }
     
    //   console.log('Login button pressed!');
    // } catch (error) {
      
    // }
  };
  
  const handleSignUp = async () => {
    // if (!EmailValidator.validate(email)) {
    //    Alert.alert('Invalid Email', 'Please enter a valid email address.');
    //    return;
    //  }
    // if(password != ""){
    //   alert('password good')
    //   axios.post('http://localhost:8080/Create-User', {
    //         email:email,
    //         password:password,
    //         age:age,
    //         fakename:name
    //       }).then(function (response) {
    //         console.log(response);
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    // }
    
    await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            initUserInDatabase(user.uid, user.email)


            console.log(user);
            alert("check email")
            //navigate("/login")
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            // ..
        });

  };

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.header}>Welcome Back!</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={text => setPassword(text)}
          value={password}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          onChangeText={text => setAge(text)}
          value={age}
        />
        <TextInput
          style={styles.input}
          placeholder="Fake Name"q
          secureTextEntry
          onChangeText={text => setName(text)}
          value={name}
        />
        <Picker
          selectedValue={acctType}
          onValueChange={(itemValue, itemIndex) => handleAccountTypeChange(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="User" value="1" />
          <Picker.Item label="Volunteer" value="2" />
          <Picker.Item label="Admin" value="3" />
        </Picker>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>or</Text>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default LoginPage;
