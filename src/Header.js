import React from "react";
import { useHistory } from "react-router-dom";
import { useStateValue } from "./hooks+context/StateProvider";
import "./Header.css";
import { Avatar } from "@material-ui/core";
// import AccessTimeIcon from "@material-ui/icons/AccessTime";
// import SearchIcon from "@material-ui/icons/Search";
// import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

function Header() {
	const [{ user }] = useStateValue();
	const history = useHistory();

  const goHome = () => {
		history.push(`/`);
	};

	const logout = () => {
		alert('implement logout function')
	}

	return (
		<div className="header">
			<div className="header__left">
				<Avatar
					className="header__avatar"
					alt={user?.displayName}
					src={user?.photoURL}
				/>
				{user?.displayName}
				{/* <AccessTimeIcon /> */}
				
			</div>
			<div className="app__title">
				<h2>Virtual Bar</h2>
			</div>
			<div className="header__right" >
				<div className='nav-item' onClick={logout}><h3>Logout</h3></div>
			</div>
			
		</div>
	);
}

export default Header;
