import React from "react";
import "./Message.css";

const moment = require("moment-timezone");

function Message({
	message,
	user,
	timestamp,
	userImage,
	iSent,
	whisper,
}) {

// Format time stamp -------------	
	function utcTimeChange(timeStamp, fromTz, toTz) {
		const newDate = moment
			.tz(timeStamp, fromTz)
			.tz(toTz)
			.format("YYYY-MM-DD LT");
		return newDate;
	}

	const UTC = new Date(timestamp?.toDate()).toUTCString();



// Set message classes -----------
	let classString = ""
	if(iSent) {
		classString = classString.concat("message__bubble bubble__lip ")
	} else {
		classString = classString.concat("message__bubble__alt bubble__lip__alt ")
	}
	if(whisper){
		classString = classString.concat("whisper__bubble")
	}	
// -------------------------------


	return (
		<div className="message container">
			<img src={userImage} alt="" />
			<div className="message__info">
				<p>
					<b>{user}</b>
					<span className="message__timestamp">
						{utcTimeChange(UTC, "Europe/London", moment.tz.guess())}
					</span>
				</p>
				<div className={classString}>
					<p>{message}</p>
				</div>
			</div>
		</div>
	);
}

export default Message;
