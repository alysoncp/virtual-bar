// React
import React, { useState } from "react";
import { useStateValue } from "./hooks+context/StateProvider";
import db from "./firebase";

// Firebase
import firebase from "firebase";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

// Custom styles


//Material UI styles
const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			margin: theme.spacing(1),
			width: "25ch",
		},
	},
}));

function AddFriend({ friendID, friendName }) {
	const [{ user }] = useStateValue();
	const classes = useStyles();

	const addFriendToList = (e) => {
		e.preventDefault()
		db.collection("users")
			.doc(user.uid)
			.update(
				{
					friends: firebase.firestore.FieldValue.arrayUnion(friendID)
				}
			)
	}


	return (
		<div className="add-friend">
			<Button onClick={addFriendToList}>Add Friend!</Button>
		</div>
	);
}

export default AddFriend;
