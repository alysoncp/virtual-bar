import React, { useState, useEffect } from "react";
import { useStateValue } from "./hooks+context/StateProvider";
import firebase from "firebase";
import db from "./firebase";
import HaversineGeolocation from "haversine-geolocation";

import BarListing from "./BarListing";
import "./Street.css";
import "./BarListing.css";

import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

function Street() {
	const [channels, setChannels] = useState([]);
	const [{ user, userLocation, idToken }] = useStateValue();
	const [anchorEl, setAnchorEl] = useState(null);
	const [input, setInput] = useState("");

	useEffect(() => {
		db.collection("bars").onSnapshot((snapshot) => {
			setChannels(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					name: doc.data().name,
					creatorId: doc.data().creatorId,
					location: {
						latitude: doc.data().location.latitude,
						longitude: doc.data().location.longitude,
					},
				}))
			);
		});
	}, []);

	// flag for rendering information telling user no bars are near them
	let atLeastOneBar;

	const closeProximityToUser = (location) => {
		// user location [0], bar location [1]
		const locations = [
			{
				latitude: userLocation.latitude,
				longitude: userLocation.longitude,
			},
			{
				latitude: location.latitude,
				longitude: location.longitude,
			},
		];
		// calculate distance in km
		const distanceBetween = HaversineGeolocation.getDistanceBetween(
			locations[0],
			locations[1]
		);
		const closeProximity = distanceBetween <= 20 ? true : false;

		return closeProximity;
	};

	const addBar = (event) => {
		event.preventDefault();
		if (input) {
			db.collection("bars").add({
				table_size: 6,
				capacity: 60,
				name: input,
				creatorId: idToken,
				location: new firebase.firestore.GeoPoint(
					userLocation.latitude,
					userLocation.longitude
				),
			});
		}
		setInput("");
		handleClose();
	};

	// start of code for bar name popup input
	const useStyles = makeStyles((theme) => ({
		root: {
			"& > *": {
				margin: theme.spacing(1),
				width: "25ch",
			},
		},
		typography: {
			padding: theme.spacing(2),
		},
	}));

	const classes = useStyles();

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;
	// end of code for bar name popup input
	return (
		<div className="street">
			<div className="street_header">
				<div>Open Bars</div>
				<div>
					<Button
						className="button__open_new_bar"
						id="form_close"
						variant="contained"
						color="primary"
						onClick={handleClick}
						disableFocusRipple={true}
						disableRipple={true}
					>
						Open New Bar
					</Button>
					<Popover
						id={id}
						open={open}
						anchorEl={anchorEl}
						onClose={handleClose}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "center",
						}}
						transformOrigin={{
							vertical: "top",
							horizontal: "center",
						}}
					>
						<Typography className={classes.typography}>
							<form className={classes.root} noValidate autoComplete="off">
								<TextField
									id="outlined-basic"
									label="Enter your bar's name"
									variant="outlined"
									onChange={(event) => setInput(event.target.value)}
									value={input}
								/>
								<div>
									<button
										id="input__bar_box"
										type="submit"
										onClick={addBar}
									></button>
								</div>
							</form>
						</Typography>
					</Popover>
				</div>
			</div>
			<div className="bar_list">
				{channels.map((channel) =>
					closeProximityToUser(channel.location) ? (
						((atLeastOneBar = true),
						(
							<BarListing
								key={channel.id}
								title={channel.name}
								id={channel.id}
								barCreatorId={channel.creatorId}
							/>
						))
					) : (
						<></>
					)
				)}
				{!atLeastOneBar && (
					<h1 id="test__no_bar">
						Sorry, there no bars are near you. Start your own!
					</h1>
				)}
			</div>
		</div>
	);
}

export default Street;
