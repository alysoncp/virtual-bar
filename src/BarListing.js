import React from "react";
import { useHistory } from "react-router-dom";
import db from "./firebase";
import { useStateValue } from "./hooks+context/StateProvider";
import "./BarListing.css";

function BarListing({ Icon, title, id, addChannelOption, barCreatorId }) {
	const history = useHistory();
	const [{ idToken }] = useStateValue();

	const selectChannel = () => {
		if (id) {
			history.push(`/bar/${id}`);
		} else {
			history.push(title);
		}
	};

	const userCanDelete = (barIdToken, userIdToken) => {
		if (barIdToken === userIdToken) {
			return true
		} else {
			return false
		}
	}

	const deleteBar = () => {

		if (window.confirm('Are you sure you want to delete the bar?')) {
			db
			.collection("bars")
			.doc(id)
			.delete()
		} else {
			return;
		}
		
	}

	return (
		<div className="bar_listing">
			<div className="bar_listing_header">
				<img
					className="bar_logo"
					src="https://cdn4.vectorstock.com/i/1000x1000/52/38/speed-beer-logo-icon-design-vector-22545238.jpg"
					alt="beer logo"
				/>
				<h4>{title}</h4>
			</div>
			<div className="bar_description">
				Need to add descriptions to database...
			</div>
			<button onClick={selectChannel}>Join Bar</button>
			{userCanDelete(barCreatorId, idToken) && (
					<button onClick={deleteBar}>Delete Bar</button> 
			)}
		</div>
	);
}

export default BarListing;
