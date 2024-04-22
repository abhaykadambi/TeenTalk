import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Navbar from "./Navbar";
import PersonTab from "./PersonTab";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import { get, ref, set } from 'firebase/database';
import { db } from './firebase';

const CallPage = () => {
  const [callDuration, setCallDuration] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [timer, setTimer] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [userID, setUserID] = useState([]);
  const [navbarVisible, setNavbarVisible] = useState(false); // State to manage navbar visibility
  const [contentShifted, setContentShifted] = useState(false); // State to manage content shift
  const navigation = useNavigation();

  const people = [
    { contactMethod: "Text", name: "Anonymous 1", tags: ["Divorce", "Relationship Issues"] },
    { contactMethod: "Text", name: "Anonymous 2", tags: ["LGBTQ+", "Family Issues"] },
  ];

  useEffect(() => {
    if (sessionStarted) {
      startTimer();
    }

    onAuthStateChanged(auth, (user) => {
       if (user) {
         const uid = user.uid;
         console.log(uid)
         setUserID(uid)
       } else {
         console.log("user is logged out")
         navigation.navigate('Auth');
       }
     });

    return () => {
      stopTimer();
    };
  }, [sessionStarted]);

  const handleChat = () => {
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  const startTimer = () => {
    const intervalId = setInterval(() => {
      setCallDuration((prevDuration) => prevDuration + 1);
    }, 1000);
    setTimer(intervalId)
  };

  const stopTimer = () => {
    clearInterval(timer);
  };

  const handleReport = () => {
    // alert("Report");
  };

  const congratulateAndRedirect = () => {
    setTimeout(() => {
      navigation.navigate("Profile");
    }, 2000);
  };

  const handleStartSession = () => {
    setSessionStarted(true);
  };

  const endSession = () => {
    setShowConfirmation(true);
  };

  const confirmEndSession = () => {
    setShowConfirmation(false);
    stopTimer(timer);
    const data = {
      user: 'abhay',
      peopleHelped: 1,
      duration: callDuration,
      reported: false,
    }

    const userRef = ref(db, `users/${userID}`);
    get(userRef)
         .then((snapshot) => {
           if (snapshot.exists()) {
             const userData = snapshot.val();
            const peopleHelped = userData.peopleHelped
            const timeSpent = userData.timeSpent
            console.log("the values" + peopleHelped, timeSpent)
            const updatedVolunteerHours = timeSpent + callDuration;
            const updatedPeopleHelped = peopleHelped + 1;
            console.log("call duration" + updatedVolunteerHours)
            set(userRef, {
                ...userData,
                timeSpent: updatedVolunteerHours,
                peopleHelped: updatedPeopleHelped,
            }).then(() => {
                console.log('User information updated successfully');
                congratulateAndRedirect();
            }).catch((error) => {
                console.error('Error updating user information:', error);
            });
             console.log(userData.peopleHelped)
           } else {
             console.log('User data not found');
           }
         })
         .catch((error) => {
           console.error('Error getting user data:', error);
         });

    congratulateAndRedirect();
  };

  const cancelEndSession = () => {
    setShowConfirmation(false);
  };

  const toggleNavbarVisibility = () => {
    setNavbarVisible(!navbarVisible);
    setContentShifted(!contentShifted); // Toggle content shift
  };

  return (
    <View style={styles.callPage}>
      <TouchableOpacity style={styles.menuButton} onPress={toggleNavbarVisibility}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>
      {!sessionStarted ? (
        <TouchableOpacity style={styles.startButton} onPress={handleStartSession}>
          <Text style={styles.startButtonText}>Start Session</Text>
        </TouchableOpacity>
      ) : (
        <View>
          {people.map((person, index) => (
            <PersonTab
              key={index}
              contactMethod={person.contactMethod}
              name={person.name}
              tags={person.tags}
            />
          ))}
          <View style={styles.timerContainer}>
            <Text style={styles.waitingText}>Waiting for people</Text>
            <Text style={styles.timer}>Session Time: {callDuration} seconds</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={endSession}>
            <Text style={styles.buttonText}>End Session</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleReport}>
            <Text style={styles.buttonText}>Report</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal visible={showConfirmation} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.confirmationText}>Are you sure you want to end the session?</Text>
            <View style={styles.buttonContainer }>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmEndSession}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelEndSession}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Navbar visible={navbarVisible} />
    </View>
  );
};

const styles = StyleSheet.create({
  callPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  startButton: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 10,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  timerContainer: {
    marginBottom: 20,
  },
  timer: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  confirmButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  menuButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1, // Ensure it's above other elements
  },
  menuText: {
    fontSize: 24,
  },
});

export default CallPage;
