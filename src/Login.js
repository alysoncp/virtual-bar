import React from "react";
import HaversineGeolocation from "haversine-geolocation";
import "./Login.css";
import { Button } from "@material-ui/core";
import firebase from "firebase";
import { auth, provider } from "./firebase";
import { useStateValue } from "./hooks+context/StateProvider";
import { actionTypes } from "./hooks+context/reducer";

function Login() {
	const [state, dispatch] = useStateValue();
	const signIn = () => {
		let displayName;
		let photoURL;
		auth
			.signInWithPopup(provider)
			.then((result) => {

				displayName = result.user.displayName;
				photoURL = result.user.photoURL;

				HaversineGeolocation.isGeolocationAvailable().then((data) => {
					const userLocation = {
						latitude: data.coords.latitude,
						longitude: data.coords.longitude,
					};
					// fire off dispatch only once we have the lat/lon data
					dispatch({
						type: actionTypes.SET_USER,
						user: result.user,
						location: userLocation,
					});
				});
				// addUserToDB(displayName, photoURL);
			})
			.catch((error) => {
				alert(error.message);
			});


}; // END OF LOGIN FUNCTION




// ---------------------------------------------

	// const addUserToDB = (displayName, profileImage) => {
	// 	db.collection("users").add({
	// 		username: displayName,
	// 		profile_image: profileImage,
	// 		is_online: true
	// 	})
	// }

	return (
		<div className="login">
			<div className="login__container">
				<img
					src="https://cdn4.vectorstock.com/i/1000x1000/52/38/speed-beer-logo-icon-design-vector-22545238.jpg"
					alt="beer logo"
				/>
				<h1>Sign in to Virtual Bar</h1>
				<Button onClick={signIn}>Sign in with Google</Button>
			</div>
		</div>
	);
}

export default Login;
