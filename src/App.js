import React, { useState } from "react";
import { useStateValue } from "./hooks+context/StateProvider";
import useStatus from "./hooks+context/useStatus";
import useBarTable from "./hooks+context/useBarTable";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Header";
import Chat from "./Chat";
import Login from "./Login";
import Street from "./Street";
import Bar from "./Bar";
import db from "./firebase"

import "./App.css";

function App() {
	
	const [{ user }] = useStateValue();
	const [userDbStatus, setUserDbStatus] = useState();

	// Write users present Bar and Table to database
	useBarTable();

	// Custom hook to set Realtime Database online/offline status
	useStatus();

	if(user){
		db.collection("users")
			.doc(user.uid)
			.onSnapshot((snapshot) => {
				console.log(`Received doc snapshot: ${snapshot}`);
			})
	}

	return (
		<div className="app">
			<Router>
				{!user ? (
					<Login />
				) : (
					<>
						<Header />
						<div className="app__body">
							{/* <Sidebar /> */}
							<Switch>
								<Route path="/bar/:barId/table/:tableId">
									<Chat />
								</Route>
								<Route path="/bar/:barId">
									<Bar />
								</Route>
								<Route path="/">
									<Street />
								</Route>
							</Switch>
						</div>
					</>
				)}
			</Router>
		</div>
	);
}

export default App;
