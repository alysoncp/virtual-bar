// React
import React, { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useStateValue } from "./hooks+context/StateProvider";
import db from "./firebase";
import Table from "./Table";

// Material UI
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import HomeIcon from "@material-ui/icons/Home";

// Custom CSS
import "./Bar.css";

function Bar() {
	const { barId } = useParams();
	const history = useHistory();
	const [barDetails, setBarDetails] = useState(null);
	const [tables, setTables] = useState([]);
	const [{ idToken }] = useStateValue();
	const [{ user }] = useStateValue();
	const [anchorEl, setAnchorEl] = useState(null);
	const [input, setInput] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [desc, setDesc] = useState("");

	const location = useLocation();
	console.log(location.pathname);

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
						description: doc.data().description,
					}))
				)
			);

		db.collection("users").doc(user.uid).update({
			at_bar: barId,
			at_table: null,
		});
	}, [barId]);

	const leaveBar = () => {
		history.push("/");
	};

	const addTable = (event) => {
		event.preventDefault();
		const randomPhrase = [
			"What is this? A table for ants!?",
			"Awwwwwwlrighty then!",
			"Join knights who say 'NI!'",
			"How about that Limp Bizkit?",
			"Do you like things and stuff? We do!",
			"Sharks & frickin' laser beams",
			"Go for Broke",
			"I ate a sock cuz peeps on the Net told me to",
			"They drank life before spitting it out",
			"Come on Barbie let's go party!",
			"Shenanigans",
			"The blue parrot drove by the hitchhiking mongoose",
			"Flying fish flew by the space station",
			"#Drunk",
			"Girls, Girls, Girls 🤟🎶",
			"Tomorrow is a storyteller without equal",
			"Insignificance loves to love",
			"The legend of the raven's roar visits Japan in the winter",
		];
		if (!input) {
			alert("Your table must have a name");
			return;
		} else {
			db.collection("bars")
				.doc(barId)
				.collection("tables")
				.add({
					name: input,
					creatorId: idToken,
					customTableImage: imageUrl ? imageUrl : null,
					description: desc
						? desc
						: randomPhrase[Math.floor(Math.random() * randomPhrase.length)],
				});
		}

		setInput("");
		setDesc("");
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
			display: "flex",
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
							label="Enter a short description"
							variant="outlined"
							onChange={(event) => setDesc(event.target.value)}
							value={desc}
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
						description={table.description}
					/>
				))}
			</div>
		</div>
	);
}

export default Bar;
