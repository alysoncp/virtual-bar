import React from "react";
import { useHistory } from "react-router-dom"
import HaversineGeolocation from "haversine-geolocation";
import "./Login.css";
import { Button } from "@material-ui/core";
import firebase from "firebase";
import db, { auth, provider } from "./firebase";
import { useStateValue } from "./hooks+context/StateProvider";
import { actionTypes } from "./hooks+context/reducer";

import image from "./images/logo2.png"

function Login() {
	const [state, dispatch] = useStateValue();
	const history = useHistory();

	const signIn = () => {
		auth
			.signInWithPopup(provider)
			.then((result) => {
				const idToken = result.user.uid;

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

	return (
		<div className="login">
			<img src={image} width={1200}/>
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
