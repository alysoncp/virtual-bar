// React
import React, { useState } from "react";
import { useStateValue } from "./hooks+context/StateProvider";
import db from "./firebase";

// Firebase
import firebase from "firebase";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

// Custom styles
import "./AddFriend.css";

//Material UI styles
const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			margin: theme.spacing(1),
			width: "25ch",
		},
	},
}));

function AddFriend({ friendID }) {
	const [{ user }] = useStateValue();
	const classes = useStyles();

	const addFriendToList = (e) => {
		e.preventDefault();
		db.collection("users")
			.doc(user.uid)
			.update({
				friends: firebase.firestore.FieldValue.arrayUnion(friendID),
			});
	};

	return (
		<div className="add-friend">
			<AddIcon onClick={addFriendToList} />
			<span className="tooltiptext">Add as friend</span>
		</div>
	);
}

export default AddFriend;
