// React and hooks
import React, { useState, useEffect } from "react";
import { useStateValue } from "./hooks+context/StateProvider";
import { useHistory } from "react-router-dom";

// Firebase
import db from "./firebase";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

// Custom CSS
import "./BarListing.css";

// Material UI Styles
const useStyles = makeStyles({
	root: {
		maxWidth: 345,
		minWidth: 345,
		marginTop: 15,
		marginBottom: 15,
		backgroundColor: "#311f34",
		boxShadow: "4px 4px 5px 0px rgba(50, 50, 50, 0.9)",
	},
	media: {
		height: 250,
	},

	bar__button: {
		color: "#FFDC14",
		"&:hover": {
			background: "#FFDC14",
			color: "#311f34",
			boxShadow: "10px 10px 99px 6px #ffdc14",
		},
	},
});

// Primary Bar Listing function
function BarListing({ title, id, description, barCreatorId, photo }) {
	const history = useHistory();
	const [{ idToken }] = useStateValue();
	const [usersPresent, setUsersPresent] = useState(null);
	const [allTableId, setAllTableId] = useState([]);
	const classes = useStyles();

	// Check to see how many users are at a bar
	// useEffect(() => {
	// 	db.collection("bars")
	// 		.doc(id)
	// 		.collection("tables")
	// 		.onSnapshot((snapshot) => {
	// 			setAllTableId(snapshot.docs.map((doc) => doc.id));
	// 		});
	// }, []);

	// Check to see if any users are at any tables
	// const checkForUsers = async (tableIdArr, barId) => {
	// 	const results = [];
	// 	const promises = tableIdArr.map((tableId) => {
	// 		return db
	// 			.collection("bars")
	// 			.doc(barId)
	// 			.collection("tables")
	// 			.doc(tableId)
	// 			.collection("usersAtTable")
	// 			.get();
	// 			.onSnapshot((snapshot) => {
	// 			console.log("snapshotdocs size", snapshot.size);
	// 			return Number(snapshot.size);
	// 		});
	// 	});
	// 	console.log("this is promises +>", promises);
	// 	return await Promise.all(promises).then((snapshots) => {
	// 		console.log("this is snapshots", snapshots);
	// 		for (let result of snapshots) {
	// 			if (result) {
	// 				result.forEach((doc) => {
	// 					console.log(doc.id, " => ", doc.data());
	// 				});
	// 			}
	// 			// console.log("this is the result value", result);
	// 			if (result !== 0) {
	// 				return true;
	// 			}
	// 		}
	// 		return false;
	// 	});

	// Original query
	// 	// for (let tableId of tableIdArr) {
	// 	// 	// for each tableId, do a db query and find out if there are any docs.
	// 	// 	const result = await db
	// 	// 		.collection("bars")
	// 	// 		.doc(barId)
	// 	// 		.collection("tables")
	// 	// 		.doc(tableId)
	// 	// 		.collection("usersAtTable")
	// 	// 		.onSnapshot((snapshot) => {
	// 	// 			console.log("snapshotdocs size", snapshot.size);
	// 	// 			return snapshot.size;
	// 	// 		});

	// 	// 	results.push(result);
	// 	// }
	// };

	// Route to a bar
	const selectChannel = () => {
		if (id) {
			history.push(`/bar/${id}`);
		} else {
			history.push(title);
		}
	};

	// Check if bar belongs to user
	const userCanDelete = (barIdToken, userIdToken) => {
		if (barIdToken === userIdToken) {
			return true;
		} else {
			return false;
		}
	};

	// Delete a bar
	const deleteBar = () => {
		if (window.confirm("Are you sure you want to delete the bar?")) {
			db.collection("bars").doc(id).delete();
		} else {
			return;
		}
	};

	// Render Bar Listing
	return (
		<Card className={classes.root}>
			<CardActionArea onClick={selectChannel}>
				<CardMedia
					className={classes.media}
					image={
						photo
							? photo
							: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8YmFyfGVufDB8fDB8&ixlib=rb-1.2.1&w=1000&q=80"
					}
					title="Contemplative Reptile"
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						{title}
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						{description}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<Button
					className={classes.bar__button}
					size="small"
					color="primary"
					onClick={selectChannel}
				>
					Join Bar
				</Button>
				{!checkForUsers(allTableId, id) && (
					<Button
						className={classes.bar__button}
						size="small"
						color="primary"
						onClick={deleteBar}
					>
						Delete Bar
					</Button>
				)}
			</CardActions>
		</Card>
	);
}

export default BarListing;
