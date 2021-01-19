import { useEffect } from "react"
import firebase from "firebase";
import { useStateValue } from "./StateProvider";

export default function useStatus() {

  console.log("useStatus hook")

  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
		console.log("User changed: ", user)
			
		if(user != null) {
			// ----------------------------------------------------------
			// Code to connect to Realtime database

			// Fetch the current user's ID from Firebase Authentication.
			const uid = firebase.auth().currentUser?.uid;

			// Create a reference to this user's specific status node.
			// This is where we will store data about being online/offline.
			const userStatusDatabaseRef = firebase.database().ref('/users/' + uid);

			// Create two constants which we will write to the Realtime database when this device is offline or online.
			const isOfflineForDatabase = {
					state: 'offline',
					last_changed: firebase.database.ServerValue.TIMESTAMP,
					at_bar: null,
					at_table: null,
			};

			const isOnlineForDatabase = {
					state: 'online',
					last_changed: firebase.database.ServerValue.TIMESTAMP,
			};

			// Create a reference to the special '.info/connected' path in Realtime Database. 
			// Returns `true` when connected and `false` when disconnected.
			firebase.database().ref('.info/connected').on('value', function(snapshot) {
					if (snapshot.val() == false) {
							return;
			};

				// Use 'onDisconnect()' 
				// Triggers when client has disconnected by closing the app, losing internet, etc.
				userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
						userStatusDatabaseRef.update(isOnlineForDatabase);
				});
			});
			

			console.log("Current user uid: ", uid)

			// ------------------------------------------------------------------------
			// Update Cloud firestore's local cache...

			const userStatusFirestoreRef = firebase.firestore().doc('/users/' + uid);

			// Firestore uses a different server timestamp value 
			// Instead create two more constants for Firestore state.
			const isOfflineForFirestore = {
					state: 'offline',
					last_changed: firebase.firestore.FieldValue.serverTimestamp(),
					at_bar: null,
					at_table: null,
			};

			const isOnlineForFirestore = {
					state: 'online',
					last_changed: firebase.firestore.FieldValue.serverTimestamp(),
			};

			firebase.database().ref('.info/connected').on('value', function(snapshot) {
					if (snapshot.val() == false) {
							// Set Firestore's state to 'offline'. This ensures that our Firestore cache is awarevof the switch to 'offline.'
							userStatusFirestoreRef.update(isOfflineForFirestore);
							return;
					};

					userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
							userStatusDatabaseRef.update(isOnlineForDatabase);

							// We'll also add Firestore set here for when we come online.
							userStatusFirestoreRef.update(isOnlineForFirestore);
					});
			});

			// -------------------------------------------------------------------

			// ****** CANNOT USE CODE BELOW WHEN STORING DATA IS USER COLLECTION INSTEAD OF STATUS
			// Check and console what what the client thinks the online status is
			// userStatusFirestoreRef.onSnapshot(function(doc) {
			// 	const isOnline = doc.data().state == 'online';
			// 	console.log("Is online function says: ", isOnline)
			// });

		}		
	
	}, [user])  // END OF USE EFFECT HOOK - UPDATES WHEN USER CHANGES (login/logout/disconnect)


}