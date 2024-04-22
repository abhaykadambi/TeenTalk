import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Navbar = ({ navbarVisible }) => {
  const navigation = useNavigation();

  if (!navbarVisible) return null; // Render nothing if navbar is not visible

  return (
    <View style={styles.navbarContainer}>
      <TouchableOpacity
        style={styles.navbarLink}
        onPress={() => navigation.navigate("Profile")} 
      >
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navbarLink}
        onPress={() => navigation.navigate("Call")} 
      >
        <Text>About</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navbarLink}
        onPress={() => navigation.navigate("Profile")} 
      >
        <Text>Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  navbarContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: 100, // Adjust the width as needed
    height: "100%", // Occupy full height of the screen
    backgroundColor: "lightgray",
    position: "absolute", // Position the navbar absolutely
    top: 0, // Align it to the top of the screen
    left: 0, // Align it to the left of the screen
  },
  navbarLink: {
    padding: 10,
  },
};

export default Navbar;
