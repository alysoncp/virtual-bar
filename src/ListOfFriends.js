import React, { useState, useEffect } from "react";
import { useStateValue } from "./hooks+context/StateProvider";
import db from "./firebase";
import firebase from "firebase"

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
import FolderIcon from "@material-ui/icons/Folder";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		minWidth: 300,
		maxWidth: 300,
	},
	demo: {
		backgroundColor: theme.palette.background.paper,
	},
	title: {
		margin: theme.spacing(4, 0, 2),
	},
}));

export default function InteractiveList({ friendsList }) {
	const [{ user }] = useStateValue();
	const classes = useStyles();
	const [dense, setDense] = useState(false);
	const [secondary, setSecondary] = useState(false);
	const [friendData, setFriendData] = useState([]);


	useEffect(() => {
		db.collection('users')
			.where(firebase.firestore.FieldPath.documentId(), 'in', friendsList)
			.onSnapshot((snapshot) => {
				setFriendData(snapshot.docs.map((doc) => doc.data()));
			});
	}, [])
		


	return (
		<div className={classes.root}>
			<FormGroup row>
				<FormControlLabel
					control={
						<Checkbox
							checked={secondary}
							onChange={(event) => setSecondary(event.target.checked)}
							color="primary"
						/>
					}
					label="Location"
				/>
			</FormGroup>
			<Grid container spacing={2}>
				<Grid item xs={12} md={8}>
					<div className={classes.demo}>
						<List dense={dense}>
							{friendData.map((friendData) => (
								<ListItem>
									<ListItemAvatar>
										<Avatar src={friendData?.profile_image} />
									</ListItemAvatar>
									<ListItemText
										primary={friendData?.username}
										secondary={secondary ? "Bar & Table" : null}
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
