import React, { useState } from "react";
import { useStateValue } from "./hooks+context/StateProvider";
import db from "./firebase";
import firebase from "firebase";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import "./ChatInput.css";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '99%',
    },
  },
}));


function ChatInput({ barId, tableId, tableNumber }) {
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
			// userImage: user.photoURL,
		});
		setInput("");
	};

	
	const classes = useStyles();

	return (
		
		<div className="chatInput">
			<form className={classes.root} noValidate autoComplete="off">
				<TextField
					id="outlined-basic"
					label="This one time at band camp..."
					variant="outlined"
					value={input}
					onChange={(event) => setInput(event.target.value)}
					placeholder={`Message Table #${tableNumber}`}
				/>
				<button type="submit" onClick={sendMessage}>
					SEND
				</button>
			</form>
		</div>
	);
}

export default ChatInput;
