import * as firebase from 'firebase';
require('@firebase/firestore')
var firebaseConfig = {
  apiKey: "AIzaSyD-weFxyNnKhznOqrY836qh4EtszTwCKFI",
  apiKey: "AIzaSyDfTJ9PVcwzIwZxyokxpIFkHksce6_-_i4",
  authDomain: "kwitter-9bad9.firebaseapp.com",
  databaseURL: "https://kwitter-9bad9.firebaseio.com",
  projectId: "kwitter-9bad9",
  storageBucket: "kwitter-9bad9.appspot.com",
  messagingSenderId: "414971373697",
  appId: "1:414971373697:web:8b8acd99e615d2a2e54580"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();