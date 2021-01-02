import React, { useState, useEffect } from "react";
import { useStateValue } from "../hooks+context/StateProvider";
import db from "../firebase";

import "./Sidebar.css";
import "./SidebarOption.css";

import SidebarOption from "./SidebarOption";

// import InsertCommentIcon from "@material-ui/icons/InsertComment";
// import InboxIcon from "@material-ui/icons/Inbox";
// import DraftsIcon from "@material-ui/icons/Drafts";
// import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
// import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
// import AppsIcon from "@material-ui/icons/Apps";
// import FileCopyIcon from "@material-ui/icons/FileCopy";
// import ExpandLessIcon from "@material-ui/icons/ExpandLess";
// import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
// import CreateIcon from "@material-ui/icons/Create";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import AddIcon from "@material-ui/icons/Add";

function Sidebar() {
	const [channels, setChannels] = useState([]);
	const [{ user }] = useStateValue();

	useEffect(() => {
		// upon load , grab a snapshot of the database and iterate through each doc
		// and create and object with the channels id and name
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
		<div className="sidebar">
			
			{/* <SidebarOption Icon={InsertCommentIcon} title="Threads" />
			<SidebarOption Icon={InboxIcon} title="Mentions & reactions" />
			<SidebarOption Icon={DraftsIcon} title="Saved items" />
			<SidebarOption Icon={BookmarkBorderIcon} title="Channel browser" />
			<SidebarOption Icon={PeopleAltIcon} title="People & user groups" />
			<SidebarOption Icon={AppsIcon} title="Apps" />
			<SidebarOption Icon={FileCopyIcon} title="File browser" />
			<SidebarOption Icon={ExpandLessIcon} title="Show less" /> */}
			{/* <hr />
			<SidebarOption Icon={ExpandMoreIcon} title="Channels" />
			<hr />
			<SidebarOption Icon={AddIcon} addChannelOption title="Add channel" /> */}
			<h3>Open Bars</h3>
			{channels.map((channel) => (
				<SidebarOption key={channel.id} title={channel.name} id={channel.id} />
			))}
			{/* Sidebar Option */}
		</div>
	);
}

export default Sidebar;
