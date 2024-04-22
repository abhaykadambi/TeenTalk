import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import UserNavigator from "./UserNavigator";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import { AuthProvider } from "./AuthContext";
import { db } from './firebase'; // Assuming you have already imported Firebase dependencies in your code.
import { get, ref } from 'firebase/database';


const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(2);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedLoginStatus = await AsyncStorage.getItem('isLoggedIn');

      if (storedLoginStatus === 'true') {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          console.log("uid", uid);
          const userRef = ref(db, `users/${uid}`);
          get(userRef)
         .then((snapshot) => {
           if (snapshot.exists()) {
             const userData = snapshot.val();
             setUserType(userData.accountType)
             console.log("the account type is: " + userData.accountType)
           } else {
             console.log('User data not found');
           }
         })
         .catch((error) => {
           console.error('Error getting user data:', error);
         });

          await AsyncStorage.setItem('isLoggedIn', "true");
          setIsLoggedIn(true);
        } else {
          console.log("user is logged out");
          await AsyncStorage.setItem('isLoggedIn', "false");
          setIsLoggedIn(false);
        }
        setLoading(false);
      });
    };

    checkLoginStatus();
  }, []); // Empty dependency array to run the effect only once

  if (loading) {
    return null; // Add a loading screen or other UI here if needed
  }

  return (
    <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          userType == 1 ? (
            <Stack.Screen name="User" component={UserNavigator} />
          ) : (
            <Stack.Screen name="Main" component={MainNavigator} />
          )
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  </AuthProvider>
  );
};

export default App;
