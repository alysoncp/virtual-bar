// React
import React, { useState } from "react";
import { useStateValue } from "./hooks+context/StateProvider";
import db from "./firebase";
import firebase from "firebase";

// Material UI
import TextField from "@material-ui/core/TextField";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

// Custom styles
import "./WhisperInput.css";
import CommentIcon from '@material-ui/icons/Comment';
import white from "@material-ui/core/colors/red";

//Material UI styles
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
}));

function WhisperInput({ recipientName, barId, tableId, uid }) {
	const [input, setInput] = useState("");
	const [{ user }] = useStateValue();
	const [anchorEl, setAnchorEl] = useState(null);
	const classes = useStyles();

	const sendMessage = (event) => {
		event.preventDefault();

		db.collection("bars")
			.doc(barId)
			.collection("tables")
			.doc(tableId)
			.collection("messages")
			.add({
				message: `(Whisper from ${user.displayName}) ${input}`,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				user: user.displayName,
				recipient: [uid],
				userImage: user.photoURL,
			});

		db.collection("bars")
			.doc(barId)
			.collection("tables")
			.doc(tableId)
			.collection("messages")
			.add({
				message: `(Whisper to ${recipientName}) ${input}`,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				user: user.displayName,
				recipient: [user.uid],
				userImage: user.photoURL,
			});

		setInput("");
		handleClose();
	};

	// start of code for whisper popup input
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
	// end of code for whisper popup input

	return (
		<div className="whisperInput">
			<CommentIcon
				className="whisper__button"
				id="form_close"
				variant="contained"
				style={{ color: white }}
				onClick={handleClick}
				disableFocusRipple={true}
				disableRipple={true}
			/>
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
							label={`Whisper ${recipientName}`}
							variant="outlined"
							onChange={(event) => setInput(event.target.value)}
							value={input}
						/>
						<div>
							<button
								id="input__whisper__box"
								type="submit"
								onClick={sendMessage}
							></button>
						</div>
					</form>
				</Typography>
			</Popover>
			{/* <form noValidate autoComplete="off">
				<input
					type="text"
					value={input}
					onChange={(event) => setInput(event.target.value)}
					placeholder="Send Whisper..."
				></input>
				<button type="submit" onClick={sendMessage}>
					Whisper
				</button>
			</form> */}
		</div>
	);
}

export default WhisperInput;
