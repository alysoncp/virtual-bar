import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useStateValue } from "./hooks+context/StateProvider";
import db from "./firebase";

import Table from "./Table";

import "./Bar.css";

import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

function Bar() {
	const { barId } = useParams();
	const history = useHistory();
	const [barDetails, setBarDetails] = useState(null);
	const [tables, setTables] = useState([]);
	const [{ idToken }] = useStateValue();
	const [anchorEl, setAnchorEl] = useState(null);
	const [input, setInput] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	useEffect(() => {
		if (barId) {
			db.collection("bars")
				.doc(barId)
				.onSnapshot((snapshot) => setBarDetails(snapshot.data()));
		}

		db.collection("bars")
			.doc(barId)
			.collection("tables")
			.orderBy("name", "asc")
			.onSnapshot((snapshot) =>
				setTables(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						name: doc.data().name,
						creatorId: doc.data().creatorId,
						customTableImage: doc.data().customTableImage,
					}))
				)
			);
	}, [barId]);

	const leaveBar = () => {
		history.push("/");
	};

	const addTable = (event) => {
		event.preventDefault();

		if (input && !imageUrl) {
			db.collection("bars").doc(barId).collection("tables").add({
				name: input,
				creatorId: idToken,
			});
		}

		if (input && imageUrl) {
			db.collection("bars").doc(barId).collection("tables").add({
				name: input,
				creatorId: idToken,
				customTableImage: imageUrl,
			});
		}

		setInput("");
		setImageUrl("");
		handleClose();
	};

	// start of code for table name popup input
	// ----------------------------------------
	const useStyles = makeStyles((theme) => ({
		root: {
			"& > *": {
				margin: theme.spacing(1),
				width: "25ch",
			},
		},
		typography: {
			padding: theme.spacing(2),
		},
	}));

	const classes = useStyles();

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;
	// --------------------------------------
	// end of code for table name popup input

	const usersPresent = async (tableId) => {
		const result = await db
			.collection("bars")
			.doc(barId)
			.collection("tables")
			.doc(tableId)
			.collection("usersAtTable")
			.get()
			.then((snap) => {
				const usersPresent = snap.size;
				console.log("this is the size", usersPresent);
				return usersPresent;
			});
		console.log("this is the result", result);
		return result;
	};

	return (
		<div className="container bar_container">
			<div className="bar_header">
				<div className="header-left">
					<h3>{`Here we are in the ${barDetails?.name} bar`}</h3>
				</div>
				<Button
					className="button__grab_table"
					id="form_close"
					variant="contained"
					color="primary"
					onClick={handleClick}
					disableFocusRipple={true}
					disableRipple={true}
				>
					Grab a table
				</Button>
				<Popover
					id={id}
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "center",
					}}
				>
					<Typography className={classes.typography}>
						<form className={classes.root} noValidate autoComplete="off">
							<TextField
								id="outlined-basic"
								label="Enter your table's name"
								variant="outlined"
								onChange={(event) => setInput(event.target.value)}
								value={input}
							/>
							<TextField
								id="outlined-basic"
								label="Enter an image URL"
								variant="outlined"
								onChange={(event) => setImageUrl(event.target.value)}
								value={imageUrl}
							/>
							<div>
								<button
									id="input__table_box"
									type="submit"
									onClick={addTable}
								></button>
							</div>
						</form>
					</Typography>
				</Popover>
				<div className="header-right">
					<h4 onClick={leaveBar}>Leave Bar</h4>
				</div>
			</div>
			<div className="table_list">
				{tables.map((table) => (
					<Table
						key={table.id}
						id={table.id}
						name={table.name}
						tableCreatorId={table.creatorId}
						customTableImage={table.customTableImage}
						// usersPresent={usersPresent(table.id)}
					/>
				))}
			</div>
		</div>
	);
}

export default Bar;
