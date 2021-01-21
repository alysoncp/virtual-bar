import React from "react";
import "./Message.css";

const moment = require('moment-timezone');

function Message({ message, user, timestamp, userImage }) {

	function utcTimeChange(timestamp, fromTz, toTz) {
		const newDate = (moment.tz(timestamp, fromTz)).tz(toTz).format('YYYY-MM-DD LT');
		return newDate;
	}
	
	return (
		<div className="message container">
			<img src={userImage} alt="" />
			<div className="message__info">
				<h4>
					{user}{" "}
					<span className="message__timestamp">
						{new Date(timestamp?.toDate()).toUTCString()}
					</span>
				</h4>
				<div className="box sb1">
					<p>{message}</p>
				</div>
			</div>
		</div>
	);
}

export default Message;