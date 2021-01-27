// React
import React, { useState, useEffect, Fragment } from "react";
import { useStateValue } from "./hooks+context/StateProvider";
import { actionTypes } from "./hooks+context/reducer";
import firebase from "firebase";
import db from "./firebase";
import HaversineGeolocation from "haversine-geolocation";
import BarListing from "./BarListing";

// Material UI
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import HomeIcon from "@material-ui/icons/Home";

// Custom Styles
import "./Street.css";
import "./BarListing.css";

// Material UI Styles
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
	link: {
		display: "flex",
	},
	icon: {
		marginRight: theme.spacing(0.5),
		width: 20,
		height: 20,
	},
	bar__button: {
		backgroundColor: "#311f34",
		color: "#FFDC14",
		"&:hover": {
			background: "#FFDC14",
			color: "#311f34",
		},
	},

}));

function Street() {
	const [channels, setChannels] = useState([]);
	const [{ userLocation, idToken }, dispatch] = useStateValue();
	const [anchorEl, setAnchorEl] = useState(null);
	const [input, setInput] = useState("");
	const [desc, setDesc] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	// Material UI
	const classes = useStyles();

	// Load all bars from db
	useEffect(() => {
		db.collection("bars")
			.orderBy("name", "asc")
			.onSnapshot((snapshot) => {
				setChannels(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						name: doc.data().name,
						creatorId: doc.data().creatorId,
						photo: doc.data().photo_url,
						location: {
							latitude: doc.data().location.latitude,
							longitude: doc.data().location.longitude,
						},
						description: doc.data().description,
					}))
				);
			});

		dispatch({
			type: actionTypes.LEAVE_BAR_OR_TABLE,
			at_table: null,
			at_bar: null,
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
		// make sure to change this back to <= 20 for deployment
		return closeProximity;
	};

	const addBar = (event) => {
		event.preventDefault();

		if (!input) {
			alert("You must give your bar a name");
			return;
		}

		if (input) {
			db.collection("bars").add({
				table_size: 6,
				capacity: 60,
				name: input,
				creatorId: idToken,
				description: desc ? desc : "Your standard generic watering hole",
				photo_url: imageUrl ? imageUrl : null,
				location: new firebase.firestore.GeoPoint(
					userLocation.latitude,
					userLocation.longitude
				),
			});
		}
		setImageUrl("");
		setInput("");
		setDesc("");
		handleClose();
	};

	// start of code for table name popup input
	// ----------------------------------------

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;
	// --------------------------------------
	// end of code for table name popup input

	return (
		<Fragment>
			<div className="street">
				<Breadcrumbs aria-label="breadcrumb" className="breadCrumbs">
					<Link color="inherit" className={classes.link}>
						<HomeIcon className={classes.icon} />
						Bars Nearby
					</Link>
					<Button
						className={`${classes.bar__button} "button__open_new_bar"`}
						id="form_close"
						variant="contained"
						color="primary"
						onClick={handleClick}
						disableFocusRipple={true}
						disableRipple={true}
					>
						Open New Bar
					</Button>
				</Breadcrumbs>
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
							<TextField
								id="outlined-basic"
								label="Enter a description"
								variant="outlined"
								onChange={(event) => setDesc(event.target.value)}
								value={desc}
							/>
							<TextField
								id="outlined-basic"
								label="Enter an image URL"
								variant="outlined"
								onChange={(event) => setImageUrl(event.target.value)}
								value={imageUrl}
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
									description={channel.description}
									photo={channel.photo}
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
		</Fragment>
	);
}

export default Street;
