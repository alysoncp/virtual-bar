// React and state imports
import React, { useState, useEffect, useRef, Fragment } from "react";
import { useParams, useHistory } from "react-router-dom";

// Firebase and state imports
import { useStateValue } from "./hooks+context/StateProvider";
import { actionTypes } from "./hooks+context/reducer";
import db from "./firebase";

// Components
import Message from "./Message";
import ChatInput from "./ChatInput";
import WhisperInput from "./WhisperInput";
import AddFriend from "./AddFriend";

// Style
import "./Chat.css";
import { Avatar } from "@material-ui/core";
import PeopleIcon from '@material-ui/icons/People';


// Primary Chat function
function Chat() {
	// Data layer and hooks
	const [{ user }, dispatch] = useStateValue();
	const { barId, tableId } = useParams();
	const history = useHistory();

	// Local State
	const [tableDetails, setTableDetails] = useState(null);
	const [tableMessages, setTableMessages] = useState([]);
	const [tableUsers, setTableUsers] = useState([]);
	const [barName, setBarName] = useState([]);
	const [friendsArray, setFriendsArray] = useState([]);

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

	const twoMinAgo = new Date(joinTimestamp - 120000);

	// -------------------------------------------------------

	useEffect(() => {
		db.collection("users")
			.doc(user.uid)
			.onSnapshot((snapshot) => {
				setFriendsArray(snapshot.data().friends);
			});
	}, [user]);



	// For updating data
	useEffect(() => {
		// Grab table details
		if (tableId) {
			db.collection("bars")
				.doc(barId)
				.collection("tables")
				.doc(tableId)
				.onSnapshot((snapshot) => {
					setTableDetails(snapshot.data());
				});
		}

		// Load the messages that were sent to you either by general or whisper chat
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

		// Add yourself to the list of users at table
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
				isTyping: false,
			});

		// 	Load the list of users at table
		db.collection("bars")
			.doc(barId)
			.collection("tables")
			.doc(tableId)
			.collection("usersAtTable")
			.onSnapshot((snapshot) => {
				setTableUsers(snapshot.docs.map((doc) => doc.data()));
			});

		// Grab bar name
		db.collection("bars")
			.doc(barId)
			.onSnapshot((snapshot) => {
				setBarName(snapshot.data());
			});

		// Set bar id and table id in data layer
		dispatch({
			type: actionTypes.SET_BAR_AND_TABLE,
			at_table: tableId,
			at_bar: barId,
		});
	}, [tableId]); // End of UseEffect hook

	// Remove yourself from the table users list when cleanly leaving the table
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

	// Render the chat
	return (
		<div className="table_chat">
			{/* -------- Users at table sidebar -------- */}
			<div className="table_users">
				<div className="table_users_header">
					<h3>{barName.name} Patrons</h3>
				</div>
				<div className="table_users_list">
					<ul>
						{tableUsers.map(({ name, photoURL, uid, isTyping }) => (
						<Fragment>
							<li className="userName">
								<WhisperInput
									barId={barId}
									tableId={tableId}
									uid={uid}
									recipientName={name}
								/>
								{uid === user.uid ? <span></span> :
									friendsArray.includes(uid) ? 
										<PeopleIcon /> :
										<AddFriend
											friendID={uid}
											friendName={name}
										/>
								}	
								<Avatar className="header__avatar" alt={name} src={photoURL} />
								<h5>{name}</h5>
								{isTyping ? <i><h5>is typing...</h5></i> : <p></p>}
							</li>
						</Fragment>
						))}
					</ul>
				</div>
			</div>

			{/* -------- Chat window -------- */}
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
					{tableMessages.map((doc) => (
						<Message
							iSent={doc.user === user.displayName ? true : false}
							whisper={doc.recipient[0] !== "all" ? true : false}
							message={doc.message}
							timestamp={doc.timestamp}
							user={doc.user}
							userImage={doc.userImage}
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
