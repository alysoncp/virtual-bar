import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useStateValue } from "./hooks+context/StateProvider";
import { actionTypes } from "./hooks+context/reducer";
import { Avatar } from "@material-ui/core";
import ChatInput from "./ChatInput";
import Message from "./Message";
import db from "./firebase";
import "./Chat.css";
import WhisperInput from "./WhisperInput";

function Chat() {
	const { barId, tableId } = useParams();
	const [tableDetails, setTableDetails] = useState(null);
	const [tableMessages, setTableMessages] = useState([]);
	const [tableUsers, setTableUsers] = useState([]);
	const [{ user }, dispatch] = useStateValue();
	const [userList, setUserList] = useState([]);
	const [barName, setBarName] = useState([]);

	const history = useHistory();

	// --------------------------------------------------------
	// For autoscrolling to bottom of chat
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(scrollToBottom, [tableMessages]);
	// --------------------------------------------------------
	// For only loading contemporary messages

	const joinTimestamp = new Date();
	console.log("User joined at: " + joinTimestamp);
	const twoMinAgo = new Date(joinTimestamp - 120000);
	console.log("Two minutes ago was: " + twoMinAgo);

	// -------------------------------------------------------

	useEffect(() => {
		if (tableId) {
			db.collection("bars")
				.doc(barId)
				.collection("tables")
				.doc(tableId)
				.onSnapshot((snapshot) => {
					setTableDetails(snapshot.data());
				});
		}

		db.collection("bars")
			.doc(barId)
			.collection("tables")
			.doc(tableId)
			.collection("messages")
			.where("recipient", "array-contains-any", ["all", user.uid])
			.where("timestamp", ">=", twoMinAgo)
			.orderBy("timestamp", "asc")
			.onSnapshot((snapshot) => {
				setTableMessages(snapshot.docs.map((doc) => doc.data()));
			});

		db.collection("bars")
			.doc(barId)
			.collection("tables")
			.doc(tableId)
			.collection("usersAtTable")
			.doc(user.uid)
			.set({
				name: user?.displayName,
				photoURL: user?.photoURL,
				uid: user?.uid,
			});

		db.collection("bars")
			.doc(barId)
			.collection("tables")
			.doc(tableId)
			.collection("usersAtTable")
			.onSnapshot((snapshot) => {
				setTableUsers(snapshot.docs.map((doc) => doc.data()));
			});

		db.collection("bars")
			.doc(barId)
			.onSnapshot((snapshot) => {
				setBarName(snapshot.data());
			});

		dispatch({
			type: actionTypes.SET_BAR_AND_TABLE,
			at_table: tableId,
			at_bar: barId,
		});
	}, [tableId]);

	const leaveTable = () => {
		const userToDelete = db
			.collection("bars")
			.doc(barId)
			.collection("tables")
			.doc(tableId)
			.collection("usersAtTable")
			.doc(user.uid)
			.delete();
		history.push(`/bar/${barId}`);
	};

	return (
		<div className="table_chat">
			<div className="table_users">
				<div className="table_users_header">
					<h3>{barName.name} Patrons</h3>
				</div>
				<div className="table_users_list">
					<ul>
						{tableUsers.map(({ name, photoURL, uid }) => (
							<li className="userName">
								<Avatar className="header__avatar" alt={name} src={photoURL} />
								<h5>{name}</h5>
								<WhisperInput
									barId={barId}
									tableId={tableId}
									id={uid}
									recipientName={name}
								/>
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className="chat">
				<div className="chat__header">
					<div className="chat__headerLeft">
						<h4 className="chat__channelName">
							<strong>Hanging at #{tableDetails?.name}</strong>
						</h4>
					</div>
					<div className="chat__headerRight" onClick={leaveTable}>
						Leave Table
					</div>
				</div>

				<div className="chat__messages">
					{tableMessages.map(({ message, timestamp, user, userImage }) => (
						<Message
							message={message}
							timestamp={timestamp}
							user={user}
							userImage={userImage}
						/>
					))}
				</div>
				<div className="scroll-spacer" ref={messagesEndRef} />

				<ChatInput
					barId={barId}
					tableId={tableId}
					tableNumber={tableDetails?.name}
				/>
			</div>
		</div>
	);
}

export default Chat;
