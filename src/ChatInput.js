import React, { useState } from "react";
import { useStateValue } from "./hooks+context/StateProvider";
import db from "./firebase";
import firebase from "firebase";

import "./ChatInput.css";

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
			// timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			user: user.displayName,
			// userImage: user.photoURL,
		});
		setInput("");
	};

	return (
		<div className="chatInput">
			<form>
				<input
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
