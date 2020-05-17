// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

var rsvpListener = null;
var guestbookListener = null;

// Add Firebase project configuration object here
var firebaseConfig = {
  apiKey: "AIzaSyCX54HpOEQZjilFynYb19K0okfsTd8BjH4",
  authDomain: "sbydev-firebase-00.firebaseapp.com",
  databaseURL: "https://sbydev-firebase-00.firebaseio.com",
  projectId: "sbydev-firebase-00",
  storageBucket: "sbydev-firebase-00.appspot.com",
  messagingSenderId: "1081638590172",
  appId: "1:1081638590172:web:29a786e8f8fd641e944619"
};

firebase.initializeApp(firebaseConfig);

// FirebaseUI config
const uiConfig = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [
    // Email / Password Provider.
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl){
      // Handle sign-in.
      return false; // Return false to avoid redirect.
    }
  }
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

startRsvpButton.addEventListener("click", () => {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut(); // User is signed in; allows user to sign out
  } else {
    // No user is signed in; allows user to sign in
    ui.start("#firebaseui-auth-container", uiConfig);
  }
});

firebase.auth().onAuthStateChanged((user) => {
  if(user) {
    startRsvpButton.textContent = "LOGOUT"
    guestbookContainer.style.display = "block";
    subscribeGuestbook();
    document.getElementById("greeting").textContent = "Hi, "+firebase.auth().currentUser.displayName;
  } else {
    startRsvpButton.textContent = "RSVP"
    guestbookContainer.style.display = "none";
    unsubscribeGuestbook();
    document.getElementById("greeting").textContent = "Please login";
  }
})

form.addEventListener("submit", (e) => {
  e.preventDefault();
  firebase.firestore().collection("guestbook").add({
    text: input.value,
    timestamp: Date.now(),
    name: firebase.auth().currentUser.displayName,
    userId: firebase.auth().currentUser.uid,
  });

  input.value = "";
  return false;
});

function subscribeGuestbook() {
  //--Get data from firestore
  guestbookListener = firebase.firestore().collection("guestbook")
  .orderBy("timestamp", "desc")
  .onSnapshot((snaps) => {
    guestbook.innerHTML = "";

    snaps.forEach((doc) => {
      const entry = document.createElement("p");
      entry.textContent = doc.data().name + ": " + doc.data().text;
      guestbook.appendChild(entry);
    });
  })
}

function unsubscribeGuestbook(){
  if (guestbookListener != null)
  {
    guestbookListener();
    guestbookListener = null;
  }
};