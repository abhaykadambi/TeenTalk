import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { auth } from './firebase';




const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { id: messages.length, text: newMessage }]);
      setNewMessage('');
    }
  };

  const cloudFunctionTry = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Get the user's ID token
        // const token = await user.getIdToken();
        // Include the token in the request headers
        const response = await axios.get('http://127.0.0.1:5001/teentalkapp-fec6e/us-central1/sayHello');
        //real url: https://us-central1-teentalkapp-fec6e.cloudfunctions.net/myFunctionName
        console.log('Cloud Function response:', response.data);
      }
    } catch (error) {
      console.error('Error:', error.message);
      // Handle error here
    }
  };

  const handleEndChat = () => {
    // Navigate back to the previous screen
    navigation.goBack();
  };

  // const callCloudFunction = async () => {
  //   setLoading(true);
  //   try {
  //     const myFunction = firebase.functions().httpsCallable('myFunctionName');
  //     const result = await myFunction({ /* data to send to the function */ });
  //     setResponse(result.data);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     setResponse('Error occurred. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stopwatch}>{seconds} s</Text>
        <Button title="Report" onPress={() => alert('Report button pressed')} />
        <Button title="End Chat" onPress={handleEndChat} />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.message}>{item.text}</Text>}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={handleSendMessage} />
        <Button title="TestCallCloud" onPress={cloudFunctionTry} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stopwatch: {
    fontSize: 18,
  },
  message: {
    fontSize: 18,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
    paddingHorizontal: 8,
  },
});

export default ChatScreen;
