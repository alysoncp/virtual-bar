// React
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import db from "./firebase";
import { useStateValue } from "./hooks+context/StateProvider";

// Materiul UI
import "./Table.css";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

// Material UI styles override
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

// Table component
function Table({ id, name, tableCreatorId, customTableImage, description }) {
	const { barId } = useParams();
	const history = useHistory();
	const [{ idToken }] = useStateValue();
	const [usersPresent, setUsersPresent] = useState(null);
	const classes = useStyles();

	// Check to see how many users are at a table
	useEffect(() => {
		db.collection("bars")
			.doc(barId)
			.collection("tables")
			.doc(id)
			.collection("usersAtTable")
			.onSnapshot((snapshot) => {
				setUsersPresent(snapshot.docs.map((doc) => doc.data()));
			});
	}, []);

	// Goto a table
	const goToTable = () => {
		history.push(`/bar/${barId}/table/${id}`);
	};

	// If user has authorization to delete a table
	const userCanDelete = (tableIdToken, userIdToken) => {
		return tableIdToken === userIdToken ? true : false;
	};

	// Delete table if authorized
	const deleteTable = () => {
		if (window.confirm("Are you sure you want to delete your table?")) {
			db.collection("bars").doc(barId).collection("tables").doc(id).delete();
		} else {
			return;
		}
	};

	return (
		<Card className={classes.root}>
			<CardActionArea onClick={goToTable}>
				<CardMedia
					className={classes.media}
					image={
						customTableImage
							? customTableImage
							: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8YmFyfGVufDB8fDB8&ixlib=rb-1.2.1&w=1000&q=80"
					}
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						{name}
					</Typography>
					<Typography variant="body1" color="textSecondary" component="p">
						{description}
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						{`${usersPresent?.length} patron${
							usersPresent?.length === 1 ? "" : "s"
						} at this table`}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<Button
					className={classes.bar__button}
					size="small"
					color="primary"
					onClick={goToTable}
				>
					Join Table
				</Button>
				{usersPresent?.length === 0 && userCanDelete(tableCreatorId, idToken) && (
					<Button
						className={classes.bar__button}
						size="small"
						color="primary"
						onClick={deleteTable}
					>
						Delete Table
					</Button>
				)}
			</CardActions>
		</Card>
	);
}

export default Table;
