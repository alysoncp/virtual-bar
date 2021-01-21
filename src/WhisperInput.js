import React, { useState } from "react";
import { useStateValue } from "./hooks+context/StateProvider";
import db from "./firebase";
import firebase from "firebase";

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
				message: `(WHISPER FROM PERSON) ${input}`,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				user: user.displayName,
				recipient: user.uid,
				userImage: user.photoURL,
			});
		setInput("");
	};

	return (
		<div className="whisperInput">
			<form noValidate autoComplete="off">
				<input type="text" value={input}
					onChange={(event) => setInput(event.target.value)}
					placeholder="Send Whisper..."></input>	
				<button type="submit" onClick={sendMessage}>Whisper</button>
			</form>
		</div>
	);
}

export default WhisperInput;
