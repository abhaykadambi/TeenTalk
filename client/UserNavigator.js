// MainNavigator.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "./Profile"; // Import your profile screen component
import CallPage from "./CallPage";
import AuthNavigator from "./AuthNavigator";
import Navbar from "./Navbar";
import ChatScreen from "./ChatScreen";
import userCallPage from "./userCallPage";
import { useEffect } from 'react';

// import OtherScreen1 from "./OtherScreen1"; // Import other screens accessible only to logged-in users
// import OtherScreen2 from "./OtherScreen2"; // Import other screens accessible only to logged-in users

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const UserNavigator = () => {
    useEffect(() => {
        //alert("now on userNavigator");
      }, []);
  return (

      <Stack.Navigator screenOptions={{
            headerShown: false}}>
            <Stack.Screen name="userCallPage" component={userCallPage} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />

            {/* <Tab.Screen name="Other1" component={OtherScreen1} />
            <Tab.Screen name="Other2" component={OtherScreen2} /> */}
            {/* Add more screens as needed */}
            <Stack.Screen
              name="Auth" // Name it as you want
              component={AuthNavigator} // Use the MainNavigator component
              options={{ headerShown: false }} // Optional: Hide header for MainNavigator
            />
            
            
          </Stack.Navigator>
    
  );
};

export default UserNavigator;
