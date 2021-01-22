// React and hooks
import React from "react";
import { useHistory } from "react-router-dom";
import { useStateValue } from "./hooks+context/StateProvider";
import { actionTypes } from "./hooks+context/reducer";

// Geolocation module
import HaversineGeolocation from "haversine-geolocation";

// Firebase
import { auth, provider } from "./firebase";

// Styling
import "./Login.css";
import { Button } from "@material-ui/core";
import logo from "./images/logo2.png";
import cocktail from "./images/cocktail.png";


// Primary Login function
function Login() {
	const [state, dispatch] = useStateValue();
	const history = useHistory();

	// Use Google Authentication to sign in a user
	const signIn = () => {
		auth
			.signInWithPopup(provider)
			.then((result) => {
				const idToken = result.user.uid;

				// Grab users location
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
						idToken: idToken,
					});
				});
				history.replace(`/`);
			})
			.catch((error) => {
				alert(error.message);
			});
	};

	// Render Login
	return (
		<div className="login">
			<img src={logo} width={1200} />
			<div className="login__container">
				{/* <img
					src="https://cdn4.vectorstock.com/i/1000x1000/52/38/speed-beer-logo-icon-design-vector-22545238.jpg"
					alt="beer logo"
				/> */}
				<img classname="icon" src={cocktail} />
				<h1>Welcome to Virtual Bar</h1>
				<Button id="neon-btn" className="btn two" onClick={signIn}>
					Sign in with Google
				</Button>
				{/* <img src={googleIcon} onClick={signIn} width={50}/> */}
			</div>
		</div>
	);
}

export default Login;
