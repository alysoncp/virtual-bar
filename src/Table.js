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

const useStyles = makeStyles({
	root: {
		maxWidth: 345,
	},
	media: {
		height: 140,
	},
});

function Table({ id, name, tableCreatorId, customTableImage, description }) {
	const { barId } = useParams();
	const history = useHistory();
	const [{ idToken }] = useStateValue();
	const classes = useStyles();
	const [usersPresent, setUsersPresent] = useState(null);

	useEffect(() => {
		db.collection("bars")
			.doc(barId)
			.collection("tables")
			.doc(id)
			.collection("usersAtTable")
			.get()
			.then((snap) => {
				const usersPresent = snap.size;
				setUsersPresent(usersPresent);
			});
	}, []);

	const goToTable = () => {
		history.push(`/bar/${barId}/table/${id}`);
	};

	const userCanDelete = (tableIdToken, userIdToken) => {
		return tableIdToken === userIdToken ? true : false;
	};

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
					title="Some title"
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						{name}
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						{description}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<Button size="small" color="primary" onClick={goToTable}>
					Join Table
				</Button>
				{!usersPresent && userCanDelete(tableCreatorId, idToken) && (
					<Button size="small" color="primary" onClick={deleteTable}>
						Delete Bar
					</Button>
				)}
			</CardActions>
		</Card>
	);
}

export default Table;
