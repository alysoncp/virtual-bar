// React
import React, { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useStateValue } from "./hooks+context/StateProvider";
import { actionTypes } from "./hooks+context/reducer";
import db from "./firebase";
import Table from "./Table";

// Material UI 
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import HomeIcon from '@material-ui/icons/Home';

// Custom CSS
import "./Bar.css";

function Bar() {
	const { barId } = useParams();
	const history = useHistory();
	const [barDetails, setBarDetails] = useState(null);
	const [tables, setTables] = useState([]);
	const [{ user, idToken }, dispatch] = useStateValue();
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

		
		dispatch({
			type: actionTypes.LEAVE_BAR_OR_TABLE,
			at_bar: barId,
			at_table: null,
		})
	

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
		link: {
			display: 'flex',
		},
		icon: {
			marginRight: theme.spacing(0.5),
			width: 20,
			height: 20,
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

	return (
			<div className="street">
				<Breadcrumbs aria-label="breadcrumb" className="breadCrumbs">
					<Link color="inherit" onClick={leaveBar} className={classes.link}>
						<HomeIcon className={classes.icon} />
						Bars Nearby
					</Link>
					<Link color="inherit" onClick={leaveBar} className={classes.link}>
						<HomeIcon className={classes.icon} />
						{barDetails?.name}
					</Link>
					<Button
						// className="button__grab_table"
						id="form_close"
						variant="contained"
						color="primary"
						onClick={handleClick}
						disableFocusRipple={true}
						disableRipple={true}
					>
					Grab a table
					</Button>
				</Breadcrumbs>
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
									id="input__bar_box"
									type="submit"
									onClick={addTable}
								></button>
							</div>
						</form>
					</Typography>
				</Popover>
				<div className="table_list">
					{tables.map((table) => (
						<Table
							key={table.id}
							id={table.id}
							name={table.name}
							tableCreatorId={table.creatorId}
							customTableImage={table.customTableImage}
						/>
					))}
				</div>
			</div>
	);

	// return (
	// 	<div className="container bar_container">
	// 		<div className="bar_header">
	// 			<div className="header-left">
	// 				<h3>{`Here we are in the ${barDetails?.name} bar`}</h3>
	// 			</div>
	// 			<Button
	// 				className="button__grab_table"
	// 				id="form_close"
	// 				variant="contained"
	// 				color="primary"
	// 				onClick={handleClick}
	// 				disableFocusRipple={true}
	// 				disableRipple={true}
	// 			>
	// 				Grab a table
	// 			</Button>
	// 			<Popover
	// 				id={id}
	// 				open={open}
	// 				anchorEl={anchorEl}
	// 				onClose={handleClose}
	// 				anchorOrigin={{
	// 					vertical: "bottom",
	// 					horizontal: "center",
	// 				}}
	// 				transformOrigin={{
	// 					vertical: "top",
	// 					horizontal: "center",
	// 				}}
	// 			>
	// 				<Typography className={classes.typography}>
	// 					<form className={classes.root} noValidate autoComplete="off">
	// 						<TextField
	// 							id="outlined-basic"
	// 							label="Enter your table's name"
	// 							variant="outlined"
	// 							onChange={(event) => setInput(event.target.value)}
	// 							value={input}
	// 						/>
	// 						<TextField
	// 							id="outlined-basic"
	// 							label="Enter an image URL"
	// 							variant="outlined"
	// 							onChange={(event) => setImageUrl(event.target.value)}
	// 							value={imageUrl}
	// 						/>
	// 						<div>
	// 							<button
	// 								id="input__table_box"
	// 								type="submit"
	// 								onClick={addTable}
	// 							></button>
	// 						</div>
	// 					</form>
	// 				</Typography>
	// 			</Popover>
	// 			<div className="header-right">
	// 				<h4 onClick={leaveBar}>Leave Bar</h4>
	// 			</div>
	// 		</div>
			// <div className="table_list">
			// 	{tables.map((table) => (
			// 		<Table
			// 			key={table.id}
			// 			id={table.id}
			// 			name={table.name}
			// 			tableCreatorId={table.creatorId}
			// 			customTableImage={table.customTableImage}
			// 		/>
			// 	))}
			// </div>
	// 	</div>
	// );
}

export default Bar;
