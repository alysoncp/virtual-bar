import React from "react";
import "./Message.css";

const moment = require("moment-timezone");

function Message({ message, user, timestamp, userImage, altMessageColor }) {
	function utcTimeChange(timeStamp, fromTz, toTz) {
		const newDate = moment
			.tz(timeStamp, fromTz)
			.tz(toTz)
			.format("YYYY-MM-DD LT");
		return newDate;
	}

	const UTC = new Date(timestamp?.toDate()).toUTCString();

	return (
		<div className="message container">
			<img src={userImage} alt="" />
			<div className="message__info">
				<h4>
					{user}{" "}
					<span className="message__timestamp">
						{utcTimeChange(UTC, "Europe/London", moment.tz.guess())}
					</span>
				</h4>
				<div
					className={
						altMessageColor ? altMessageColor : "message__bubble bubble__lip"
					}
				>
					<p>{message}</p>
				</div>
			</div>
		</div>
	);
}

export default Message;
