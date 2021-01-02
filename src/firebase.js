// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

// const firebaseConfig = {
// 	apiKey: "AIzaSyDpmjbTApTaIDEUAIs-I9Gtafhx0n8ias4",
// 	authDomain: "slack-clone-13896.firebaseapp.com",
// 	projectId: "slack-clone-13896",
// 	storageBucket: "slack-clone-13896.appspot.com",
// 	messagingSenderId: "1029680900759",
// 	appId: "1:1029680900759:web:4181a55e42e1e3b452d7d2",
// 	measurementId: "G-DFKXED0DXX",
// };

const firebaseConfig = {
  apiKey: "AIzaSyAZtTYp-SCK5E7bZ2jZtGtH_ZqRAWIn7AU",
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
