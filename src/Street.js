import React, { useState, useEffect } from "react";
import HaversineGeolocation from "haversine-geolocation";
import { useStateValue } from "./hooks+context/StateProvider";
import db from "./firebase";

import "./Street.css";
import "./BarListing.css";

import BarListing from "./BarListing";

function Street() {
	const [channels, setChannels] = useState([]);
	const [{ user, userLocation }] = useStateValue();

	useEffect(() => {
		db.collection("bars").onSnapshot((snapshot) => {
			setChannels(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					name: doc.data().name,
					location: {
						latitude: doc.data().location.latitude,
						longitude: doc.data().location.longitude,
					},
				}))
			);
		});
	}, []);

	// flag for rendering info telling user no bars are near them
	let atLeastOneBar;

	const closeProximityToUser = (location) => {
		// user location [0], bar location [1]
		const locations = [
			{
				latitude: userLocation.latitude,
				longitude: userLocation.longitude,
			},
			{
				latitude: location.latitude,
				longitude: location.longitude,
			},
		];
		// calculate distance in km
		const distanceBetween = HaversineGeolocation.getDistanceBetween(
			locations[0],
			locations[1]
		);
		const closeProximity = distanceBetween <= 20 ? true : false;

		return closeProximity;
	};

	const addBar = () => {
		const barName = prompt("Please enter a Bar name");

		if (barName) {
			db.collection("bars").add({
				table_size: 6,
				capacity: 60,
				name: barName,
				location: {
					latitude: userLocation.latitude,
					longitude: userLocation.longitude,
				},
			});
		}
	};

	return (
		<div className="street">
			<div className="street_header">
				<div>Open Bars</div>
				<div onClick={addBar}>Open New Bar</div>
			</div>
			<div className="bar_list">
				{channels.map((channel) =>
					closeProximityToUser(channel.location) ? (
						((atLeastOneBar = true),
						(
							<BarListing
								key={channel.id}
								title={channel.name}
								id={channel.id}
							/>
						))
					) : (
						<></>
					)
				)}
				{!atLeastOneBar && <h1>😪😪😪😪😪😪😪😪</h1>}
			</div>
		</div>
	);
}

export default Street;
