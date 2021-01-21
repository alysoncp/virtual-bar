import React from "react";
import "./Message.css";

function Message({ message, user, timestamp, userImage }) {
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
