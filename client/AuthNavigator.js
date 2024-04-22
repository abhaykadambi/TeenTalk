// AuthNavigator.js

import React, { useEffect } from "react"; // Import useEffect
import { createStackNavigator } from "@react-navigation/stack";
import LoginPage from "./LoginPage"; // Import your login screen component
import CallPage from "./CallPage";
import MainNavigator from "./MainNavigator";
// import SignupScreen from "./SignupScreen"; // Import your signup screen component

const Stack = createStackNavigator();


const AuthNavigator = () => {
  
  useEffect(() => {
    // alert("now on the auth navigator")
  }, []);

  return (
    
    <Stack.Navigator screenOptions={{
      headerShown: false}}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Call" component={CallPage} />
      <Stack.Screen
        name="Main" // Name it as you want
        component={MainNavigator} // Use the MainNavigator component
        options={{ headerShown: false }} // Optional: Hide header for MainNavigator
      />
      {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
