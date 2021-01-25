// React
import React from "react";
import { useHistory } from "react-router-dom";
import { useStateValue } from "./hooks+context/StateProvider";
import FriendsList from "./FriendsList";

// Material UI Imports
import { Avatar } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MoreIcon from "@material-ui/icons/MoreVert";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

// Logo
import cocktail from "./images/cocktail.png";

// Custom CSS
import "./Header.css";

// Material UI Styles
const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		display: "none",
		[theme.breakpoints.up("sm")]: {
			display: "block",
		},
	},
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		"&:hover": {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(3),
			width: "auto",
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	inputRoot: {
		color: "inherit",
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "20ch",
		},
	},
	sectionDesktop: {
		display: "none",
		[theme.breakpoints.up("md")]: {
			display: "flex",
		},
	},
	sectionMobile: {
		display: "flex",
		[theme.breakpoints.up("md")]: {
			display: "none",
		},
	},
}));

function Header() {
	const [{ user }] = useStateValue();
	const history = useHistory();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

	// Material UI
	const classes = useStyles();
	const menuId = "primary-search-account-menu";
	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		handleMobileMenuClose();
	};

	const handleMobileMenuOpen = (event) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	// Logout and Home
	const clickHome = (e) => {
		e.preventDefault();
		history.push("/");
	};

	const logout = () => {
		window.location.reload(false);
	};

	// Material UI drop-down menu for logout
	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorReference="anchorPosition"
			anchorPosition={{ top: 60, left: 1655 }}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			id={menuId}
			keepMounted
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<MenuItem onClick={logout}>Logout</MenuItem>
		</Menu>
	);

	// Material UI mobile size
	const mobileMenuId = "primary-search-account-menu-mobile";
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			<MenuItem onClick={logout}>Logout</MenuItem>
		</Menu>
	);

	return (
		<div className={classes.grow}>
			<AppBar position="static">
				<Toolbar>
					<Typography
						className={classes.title}
						onClick={clickHome}
						variant="h6"
						noWrap
					>
						<div className="nav__title">VIRTUAL BAR</div>
					</Typography>
					<div onClick={clickHome} className="nav__cocktail">
						<img src={cocktail} />
					</div>
					<div className={classes.grow} />
					<div className={classes.sectionDesktop}>
						<FriendsList />
						<IconButton
							edge="end"
							aria-label="account of current user"
							aria-controls={menuId}
							aria-haspopup="true"
							onClick={handleProfileMenuOpen}
							color="inherit"
						>
							<div className="icon__online">
								<FiberManualRecordIcon />
							</div>
							<Typography
								className={(classes.title, "avatar__name")}
								variant="h6"
								noWrap
							>
								{user?.displayName}
							</Typography>
							<Avatar
								className="header__avatar"
								alt={user?.displayName}
								src={user?.photoURL}
							/>
						</IconButton>
					</div>
					<div className={classes.sectionMobile}>
						<IconButton
							aria-label="show more"
							aria-controls={mobileMenuId}
							aria-haspopup="true"
							onClick={handleMobileMenuOpen}
							color="inherit"
						>
							<MoreIcon />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
			{renderMobileMenu}
			{renderMenu}
		</div>
	);
}

export default Header;
