import React, { useEffect } from "react";
import { useStateValue } from "./hooks+context/StateProvider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase from "firebase";
import Header from "./Header";
import Chat from "./Chat";
import Login from "./Login";
import Street from "./Street";
import Bar from "./Bar";

import "./App.css";

function App() {
	
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
			const userStatusDatabaseRef = firebase.database().ref('/status/' + uid);

			// We'll create two constants which we will write to 
			// the Realtime database when this device is offline
			// or online.
			const isOfflineForDatabase = {
					state: 'offline',
					last_changed: firebase.database.ServerValue.TIMESTAMP,
			};

			const isOnlineForDatabase = {
					state: 'online',
					last_changed: firebase.database.ServerValue.TIMESTAMP,
			};

			// Create a reference to the special '.info/connected' path in 
			// Realtime Database. This path returns `true` when connected
			// and `false` when disconnected.
			firebase.database().ref('.info/connected').on('value', function(snapshot) {
					// If we're not currently connected, don't do anything.
					if (snapshot.val() == false) {
							return;
			};

				// If we are currently connected, then use the 'onDisconnect()' 
				// method to add a set which will only trigger once this 
				// client has disconnected by closing the app, 
				// losing internet, or any other means.
				userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
						// The promise returned from .onDisconnect().set() will
						// resolve as soon as the server acknowledges the onDisconnect() 
						// request, NOT once we've actually disconnected:
						// https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

						// We can now safely set ourselves as 'online' knowing that the
						// server will mark us as offline once we lose connection.
						userStatusDatabaseRef.set(isOnlineForDatabase);
				});
			});
			

			console.log("Current user uid: ", uid)

			// ------------------------------------------------------------------------
			// Update Cloud firestore's local cache...

			const userStatusFirestoreRef = firebase.firestore().doc('/status/' + uid);

			// Firestore uses a different server timestamp value, so we'll 
			// create two more constants for Firestore state.
			const isOfflineForFirestore = {
					state: 'offline',
					last_changed: firebase.firestore.FieldValue.serverTimestamp(),
			};

			const isOnlineForFirestore = {
					state: 'online',
					last_changed: firebase.firestore.FieldValue.serverTimestamp(),
			};

			firebase.database().ref('.info/connected').on('value', function(snapshot) {
					if (snapshot.val() == false) {
							// Instead of simply returning, we'll also set Firestore's state
							// to 'offline'. This ensures that our Firestore cache is aware
							// of the switch to 'offline.'
							userStatusFirestoreRef.set(isOfflineForFirestore);
							return;
					};

					userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
							userStatusDatabaseRef.set(isOnlineForDatabase);

							// We'll also add Firestore set here for when we come online.
							userStatusFirestoreRef.set(isOnlineForFirestore);
					});
			});

			// -------------------------------------------------------------------

			
			userStatusFirestoreRef.onSnapshot(function(doc) {
				const isOnline = doc.data().state == 'online';
				console.log("Is online function says: ", isOnline)
			});

		}		
	
	}, [user])
// END OF USE EFFECT HOOK


	return (
		<div className="app">
			<Router>
				{!user ? (
					<Login />
				) : (
					<>
						<Header />
						<div className="app__body">
							{/* <Sidebar /> */}
							<Switch>
								<Route path="/bar/:barId/table/:tableId">
									<Chat />
								</Route>
								<Route path="/bar/:barId">
									<Bar />
								</Route>
								<Route path="/">
									<Street />
								</Route>
							</Switch>
						</div>
					</>
				)}
			</Router>
		</div>
	);
}

export default App;
