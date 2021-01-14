import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";

import ChatInput from "./ChatInput";
import Message from "./Message";
import db from "./firebase";
import "./Chat.css";

import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";


function Chat() {
	const { barId, tableId } = useParams();
	const [tableDetails, setTableDetails] = useState(null);
	const [tableMessages, setTableMessages] = useState([]);

	const history = useHistory();


	// For autoscrolling to bottom of chat
	const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [tableMessages]);


	
	useEffect(() => {
		
		if (tableId) {
			db.collection("bars")
				.doc(barId)
				.collection("tables")
				.doc(tableId)
				.onSnapshot((snapshot) => {
					setTableDetails(snapshot.data())
				});
		}

		db.collection("bars")
			.doc(barId)
			.collection("tables")
			.doc(tableId)
			.collection("messages")
			.orderBy("timestamp", "asc")
			.onSnapshot((snapshot) => {
				setTableMessages(snapshot.docs.map((doc) => doc.data()))
			});

	}, [tableId]);

	

	console.log("TableDetails: ", tableDetails);


	const leaveTable = () => {
		history.push(`/bar/${barId}`);
	}
	

	return (
		<div className="table_chat">
			
			<div className="table_users">
				<div className="table_users_header">
					<h3>Users at Table</h3>
				</div>
				<div className="table_users_list">
					<h4>User list needs to be implemented</h4>
					<ul>
						<li>Add user collection to table</li>
						<li>Function to update users at table with leave/enter room functions</li>
					</ul>
				</div>
				
			</div>

			<div className="chat">
				<div className="chat__header">
					<div className="chat__headerLeft">
						<h4 className="chat__channelName">
							<StarBorderOutlinedIcon />
							<strong>  Table Number {tableDetails?.number}</strong>
						</h4>
					</div>
					<div className="chat__headerRight" onClick={leaveTable}>
						Leave Table
					</div>
				</div>
				
					<div className="chat__messages">
						{tableMessages.map(({ message, timestamp, user }) => (
							<Message
								message={message}
								timestamp={timestamp}
								user={user}
							/>
						))}
					</div>
					<div className="scroll-spacer" ref={messagesEndRef} />
				
				<ChatInput barId={barId} tableId={tableId} tableNumber={tableDetails?.number}/>
			</div>
		</div>
	);
}

export default Chat;
