import React, { useState } from "react";
import { useStateValue } from "./hooks+context/StateProvider";
import db from "./firebase";
import firebase from "firebase";
import TextField from "@material-ui/core/TextField";
// import { makeStyles } from "@material-ui/core/styles";

// const useStyles = makeStyles((theme) => ({
// 	root: {
// 		"& > *": {
// 			margin: theme.spacing(1),
// 			width: "99%",
// 		},
// 	},
// }));

function WhisperInput({ barId, tableId }) {
	const [input, setInput] = useState("");
	const [{ user }] = useStateValue();

	const sendMessage = (event) => {
		event.preventDefault();

		db.collection("bars")
			.doc(barId)
			.collection("tables")
			.doc(tableId)
			.collection("messages")
			.add({
				message: input,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				user: user.displayName,
				recipient: "XZzCKJOLQ0g6m1JZcCGW63OxNMf2"
				// userImage: user.photoURL,
			});
		setInput("");
	};

	// const classes = useStyles();

	return (
		<div className="chatInput">
			<form noValidate autoComplete="off">
				<TextField
					id="outlined-basic"
					// label={randomPlaceholder}
					variant="outlined"
					value={input}
					onChange={(event) => setInput(event.target.value)}
					placeholder={`Message Alyson`}
				/>
				<button type="submit" onClick={sendMessage}></button>
			</form>
		</div>
	);
}

export default WhisperInput;
