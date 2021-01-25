import React, { useState, useEffect } from "react";
import db from "./firebase";
import firebase from "firebase";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		minWidth: 300,
		maxWidth: 400,
		maxHeight: 700,
	},
	demo: {
		backgroundColor: theme.palette.background.paper,
	},
	title: {
		margin: theme.spacing(4, 0, 2),
	},
	primary_text: {
		display: "flex",
		fontSize: 20,
		fontWeight: "bold",
		fontStyle: "italic",
	},
	bar_text: {
		display: "inline-block",
		fontWeight: "bold",
		fontSize: 18,
		marginRight: 4,
	},
	table_text: {
		display: "inline-block",
		fontWeight: "bold",
		fontSize: 18,
		marginRight: 4,
	},
	checkbox: {
		color: "#311f34",
		"&$checked": {
			color: "#311f34",
		},
	},
}));

export default function InteractiveList({ friendsList }) {
	const classes = useStyles();
	const [dense, setDense] = useState(false);
	const [secondary, setSecondary] = useState(false);
	const [friendData, setFriendData] = useState([]);

	useEffect(() => {
		db.collection("users")
			.where(firebase.firestore.FieldPath.documentId(), "in", friendsList)
			.where("state", "==", "online")
			.onSnapshot((snapshot) => {
				setFriendData(snapshot.docs.map((doc) => doc.data()));
			});
	}, []);

	return (
		<div className={classes.root}>
			<FormGroup row>
				<FormControlLabel
					className={classes.checkbox}
					control={
						<Checkbox
							className={classes.checkbox}
							checked={secondary}
							onChange={(event) => setSecondary(event.target.checked)}
							color=""
						/>
					}
					label="Location"
				/>
			</FormGroup>
			<Grid container spacing={2}>
				<Grid item xs={12} md={13}>
					<div className={classes.demo}>
						<List dense={dense}>
							{friendData.map((friendData) => (
								<ListItem>
									<ListItemAvatar>
										<Avatar src={friendData?.profile_image} />
									</ListItemAvatar>
									<ListItemText
										disableTypography
										primary={
											<Typography className={classes.primary_text}>
												{friendData?.username}
											</Typography>
										}
										secondary={
											secondary ? (
												<>
													<Typography className={classes.bar_text}>
														{`Bar: `}
													</Typography>
													{friendData?.at_bar_name}
													<br></br>
													<Typography className={classes.table_text}>
														{`Table: `}
													</Typography>
													{friendData?.at_table_name}
												</>
											) : (
												<></>
											)
										}
									/>
								</ListItem>
							))}
						</List>
					</div>
				</Grid>
			</Grid>
		</div>
	);
}
