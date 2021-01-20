// React
import React from "react";
import { useHistory } from "react-router-dom";
import { useStateValue } from "./hooks+context/StateProvider";
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
	},
	media: {
		height: 140,
	},
});

function BarListing({ title, id, description, barCreatorId, photo }) {
	const history = useHistory();
	const [{ idToken }] = useStateValue();
	const classes = useStyles();

	const selectChannel = () => {
		if (id) {
			history.push(`/bar/${id}`);
		} else {
			history.push(title);
		}
	};

	const userCanDelete = (barIdToken, userIdToken) => {
		if (barIdToken === userIdToken) {
			return true;
		} else {
			return false;
		}
	};

	const deleteBar = () => {
		if (window.confirm("Are you sure you want to delete the bar?")) {
			db.collection("bars").doc(id).delete();
		} else {
			return;
		}
	};

	return (
		<Card className={classes.root}>
			<CardActionArea onClick={selectChannel}>
				<CardMedia
					className={classes.media}
					image={photo}
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
				<Button size="small" color="primary" onClick={selectChannel}>
					Join Bar
				</Button>
				{userCanDelete(barCreatorId, idToken) && (
					<Button size="small" color="primary" onClick={deleteBar}>
						Delete Bar
					</Button>
				)}
			</CardActions>
		</Card>
	);
}

export default BarListing;
