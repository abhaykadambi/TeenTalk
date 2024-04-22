// PersonTab.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ChatScreen from "./ChatScreen";
import { useNavigation } from "@react-navigation/native";
import database from '@react-native-firebase/database';

const PersonTab = ({ contactMethod, name, tags}) => {
  const [showChat, setShowChat] = useState(false);
  const navigation = useNavigation();
  const handleChat = () => {
    //setShowChat(true);
    navigation.navigate('ChatScreen');
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  

  return (
    <View>
      <TouchableOpacity style={styles.personTab} onPress={handleChat}>
        <View style={styles.contactMethod}>
          <Text>{contactMethod}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.tags}>{tags.join(", ")}</Text>
        </View>
      </TouchableOpacity>
      {showChat && <ChatScreen onClose={handleCloseChat} />}
    </View>
  );
};

const styles = StyleSheet.create({
  personTab: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  contactMethod: {
    backgroundColor: "#eee",
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  tags: {
    color: "#555",
  },
});

export default PersonTab;
