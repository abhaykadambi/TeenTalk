import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from './firebase';
import {  signOut } from "firebase/auth";


import { onAuthStateChanged } from "firebase/auth";
import database from '@react-native-firebase/database';
import { db } from './firebase'; // Assuming you have already imported Firebase dependencies in your code.
import { get, ref } from 'firebase/database';


const userCallPage = ({ navigation }) => {
  const [topic, setTopic] = useState('');
  const [topicList, setTopicList] = useState([]);
  const [userID, setUserID] = useState([]);



  // useEffect(() => {
  //   // checkLoginStatus();
  //   onAuthStateChanged(auth, (user) => {

  //      if (user) {
  //        // User is signed in, see docs for a list of available properties
  //        // https://firebase.google.com/docs/reference/js/firebase.User
  //        const uid = user.uid;
  //        setUserID(uid)

         

  //      } else {
  //        // User is signed out
  //        // ...
        
  //        console.log("user is logged out")
  //        navigation.navigate('Auth');
        
  //      }
  //    });
  //   console.log('userinfo: '+ userInfo)
  // }, []);

  const handleStartChat = () => {
    navigation.navigate('ChatScreen');
  };

  const handleLogout = () => {
    // Implement your logout logic here
    signOut(auth).then(() => {
      // Sign-out successful.
          navigation.navigate('Auth');
          console.log("Signed out successfully")
      }).catch((error) => {
      // An error happened.
      });
  };

  const handleAddTopic = () => {
    if (topic.trim() !== '') {
      setTopicList([...topicList, topic]);
      setTopic('');
    }
  };

  const handleRemoveTopic = (index) => {
    const updatedTopics = [...topicList];
    updatedTopics.splice(index, 1);
    setTopicList(updatedTopics);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.startButton} onPress={handleStartChat}>
        <Text style={styles.startButtonText}>Start Chat</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.topicInput}
        placeholder="Enter main topics"
        value={topic}
        onChangeText={(text) => setTopic(text)}
        onSubmitEditing={handleAddTopic}
      />
      {topicList.map((item, index) => (
        <View key={index} style={styles.topicItem}>
          <Text style={styles.topicText}>{item}</Text>
          <TouchableOpacity onPress={() => handleRemoveTopic(index)}>
            <Text style={styles.removeButton}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  topicInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    width: '80%',
    padding: 10,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  topicItem: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  topicText: {
    fontSize: 16,
  },
  removeButton: {
    color: 'red',
    marginLeft: 10,
  },
});

export default userCallPage;
