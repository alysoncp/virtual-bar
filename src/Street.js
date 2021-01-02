import React, { useState, useEffect } from "react";
import { useStateValue } from "./hooks+context/StateProvider";
import db from "./firebase";

import "./Street.css";
import "./BarListing.css";

import BarListing from "./BarListing";


function Street() {
	const [channels, setChannels] = useState([]);
	const [{ user }] = useStateValue();

	useEffect(() => {
		db.collection("bars").onSnapshot((snapshot) =>
			setChannels(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					name: doc.data().name,
				}))
			)
		);
	}, []);

	return (
		<div className="street">

			<div className="street_header">
				Open Bars
			</div>

			<div className="bar_list">
				{channels.map((channel) => (
					<BarListing key={channel.id} title={channel.name} id={channel.id} />
				))}
			</div>

			
			

		</div>
	);
}

export default Street;
