// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
  apiKey: REACT_APP_FIREBASEAPIKEY,
  authDomain: "virtual-bar-9a045.firebaseapp.com",
  projectId: "virtual-bar-9a045",
  storageBucket: "virtual-bar-9a045.appspot.com",
  messagingSenderId: "1053209643695",
  appId: "1:1053209643695:web:262d567469c7f8cbc9e25a"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
