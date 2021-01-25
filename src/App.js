// React and hooks
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useStateValue } from "./hooks+context/StateProvider";
import useStatus from "./hooks+context/useStatus";
import useBarTable from "./hooks+context/useBarTable";

// Components
import Header from "./Header";
import Chat from "./Chat";
import Login from "./Login";
import Street from "./Street";
import Bar from "./Bar";

// Styling
import "./App.css";

// Primary App function
function App() {
	// Load current user from data layer
	const [{ user }] = useStateValue();

	// Write users present Bar and Table to database
	useBarTable();

	// Custom hook to set Realtime Database online/offline status
	useStatus();

	// Render app with React Router
	return (
		<div className="app">
			<Router>
				{!user ? (
					<Login />
				) : (
					<>
						<Header />
						<div className="app__body">
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
