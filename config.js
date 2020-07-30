import * as firebase from 'firebase';
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyBMOrR9eyDnI7KYuJaH9nmMTFaO8kQL08c",
    authDomain: "wireleibrary-6fe6a.firebaseapp.com",
    databaseURL: "https://wireleibrary-6fe6a.firebaseio.com",
    projectId: "wireleibrary-6fe6a",
    storageBucket: "wireleibrary-6fe6a.appspot.com",
    messagingSenderId: "986308189647",
    appId: "1:986308189647:web:5081d7dae1e954884e06ba"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();