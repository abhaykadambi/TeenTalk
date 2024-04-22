import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity } from "react-native"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 
import Navbar from "./Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import {  signOut } from "firebase/auth";
import database from '@react-native-firebase/database';
import { db } from './firebase'; 
import { get, ref } from 'firebase/database';

const Profile = (props) => {
  
  const [userInfo, setUserInfo] = useState({});
  const [volunteerHours, setVolunteerHours] = useState(0);
  const [peopleHelped, setPeopleHelped] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(false); // State to manage navbar visibility
  const [contentShifted, setContentShifted] = useState(false); // State to manage content shift

  useEffect(() => {
    checkLoginStatus();
    onAuthStateChanged(auth, (user) => {
       if (user) {
         const uid = user.uid;
         const userRef = ref(db, `users/${uid}`);
         get(userRef)
         .then((snapshot) => {
           if (snapshot.exists()) {
             const userData = snapshot.val();
             setVolunteerHours(userData.timeSpent || 0);
             setPeopleHelped(userData.peopleHelped || 0);
           } else {
             console.log('User data not found');
           }
         })
         .catch((error) => {
           console.error('Error getting user data:', error);
         });
        setUserInfo(user)
       } else {
         console.log("user is logged out")
         navigation.navigate('Auth');
       }
     });
    console.log('userinfo: '+ userInfo)
  }, []);
  
  const navigation = useNavigation(); 

  const checkLoginStatus = async () => {
    let isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    isLoggedIn = JSON.parse(isLoggedIn)
    console.log(isLoggedIn)
    if (!isLoggedIn || isLoggedIn !== true) {
      navigation.navigate('Auth');
    } 
  };

  const toggleNavbarVisibility = () => {
    setNavbarVisible(!navbarVisible);
    setContentShifted(!contentShifted); // Toggle content shift
  };

  return (
    <View style={styles.profile}>
      <TouchableOpacity style={styles.menuButton} onPress={toggleNavbarVisibility}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>
      <View style={[styles.profileContent, contentShifted && styles.shiftedContent]}>
        <View style={styles.profileHeader}>
          <Text style={styles.name}>{userInfo.email}</Text>
          <Text style={styles.username}>@{userInfo.username}</Text>
          <TouchableOpacity
            style={styles.roundedButton}
            onPress={() => {setTimeout(async () => {
              await AsyncStorage.setItem('isLoggedIn', false);
            }, 2000);}}
          >
            <Text style={styles.buttonText}>Manage Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.roundedButton}
            onPress={() => {
              signOut(auth).then(() => {
                navigation.navigate('Auth');
                console.log("Signed out successfully")
              }).catch((error) => {
                console.error("Sign-out error:", error);
              });
            }}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profileBio}>
          <Text>*bio*</Text>
        </View>
        <View style={styles.profileStats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Total Time Spent</Text>
            <Text style={styles.statValue}>{volunteerHours}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>People Helped</Text>
            <Text style={styles.statValue}>{peopleHelped}</Text>
          </View>
        </View>
      </View>
      <Navbar navbarVisible={navbarVisible} />
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    padding: 20,
  },
  menuButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  menuText: {
    fontSize: 24,
  },
  profileContent: {
    flex: 1,
    width: "100%",
  },
  shiftedContent: {
    marginLeft: 200,
  },
  profileHeader: {
    marginBottom: 20,
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    marginBottom: 5,
  },
  username: {
    color: "#888",
  },
  profileBio: {
    marginBottom: 20,
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    alignItems: "center",
    padding: 20,
  },
  statLabel: {
    fontSize: 16,
    color: "#888",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  roundedButton: {
    backgroundColor: "#841584",
    padding: 10,
    borderRadius: 20, // Make the button rounded
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Profile;
