import React, { useState, useEffect } from "react";
import { useStateValue } from "./hooks+context/StateProvider";
import db from "./firebase";
import ListOfFriends from "./ListOfFriends";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// Custom CSS
import "./FriendsList.css";

// Material UI styles
const useStyles = makeStyles((theme) => ({
	typography: {
		padding: theme.spacing(2),
	},
	bar__button: {
		position: "relative",
		top: 12,
		backgroundColor: "#000",
		color: "#fff",
		"&:hover": {
			background: "#fff",
			color: "#000",
		},
	},
}));

export default function SimplePopover() {
	const [{ user }] = useStateValue();
	const [friendsList, setFriendsList] = useState([]);
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState(null);

	useEffect(() => {
		db.collection("users")
			.doc(user.uid)
			.onSnapshot((snapshot) => {
				setFriendsList(snapshot.data().friends);
			});
	}, [user]);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	return (
		<div>
			<Button
				className={classes.bar__button}
				disableFocusRipple={true}
				disableRipple={true}
				aria-describedby={id}
				variant="contained"
				color="primary"
				onClick={handleClick}
			>
				Online Friends
			</Button>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 50, left: 1365 }}
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
					<ListOfFriends friendsList={friendsList} />
				</Typography>
			</Popover>
		</div>
	);
}
