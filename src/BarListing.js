import React from "react";
import { useHistory } from "react-router-dom";
import db from "./firebase";
import "./BarListing.css";

function BarListing({ Icon, title, id, addChannelOption }) {
	const history = useHistory();

	const selectChannel = () => {
		if (id) {
			history.push(`/bar/${id}`);
		} else {
			history.push(title);
		}
	};

	return (
		<div className="bar_listing" onClick={selectChannel}>
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
		</div>
	);
}

export default BarListing;
