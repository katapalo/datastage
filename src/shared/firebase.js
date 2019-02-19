import firebase from 'firebase/app'
import firestore from 'firebase/firestore'

const settings = {timestampsInSnapshots: true};

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCB8tcrsA5_T4Uzr2HZELCMorNusYgg58g",
    authDomain: "backdwh.firebaseapp.com",
    databaseURL: "https://backdwh.firebaseio.com",
    projectId: "backdwh",
    storageBucket: "backdwh.appspot.com",
    messagingSenderId: "735269630308"
  };

firebase.initializeApp(config);
firebase.firestore().settings(settings);

//export default firebase;
export const db = firebase.firestore();