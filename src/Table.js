import React from "react";
import { useHistory, useParams } from "react-router-dom";
import db from "./firebase";
import { useStateValue } from "./hooks+context/StateProvider";
import "./Table.css";

function Table({ id, name, tableCreatorId, customTableImage }) {
	const { barId } = useParams();
	const history = useHistory();
	const [{ idToken }] = useStateValue();

	const goToTable = () => {
		history.push(`/bar/${barId}/table/${id}`);
	};

	const userCanDelete = (tableIdToken, userIdToken) => {
		return tableIdToken === userIdToken ? true : false;
	};

	const deleteTable = () => {
		if (window.confirm("Are you sure you want to delete your table?")) {
			db.collection("bars").doc(barId).collection("tables").doc(id).delete();
		} else {
			return;
		}
	};

	return (
		<div className="table">
			<img
				src={
					customTableImage
						? customTableImage
						: "https://www.flaticon.com/svg/static/icons/svg/160/160705.svg"
				}
				alt="table logo"
			/>
			<div className="title">{`The #${name} table!!`}</div>
			<button onClick={goToTable}>Join Table</button>
			{userCanDelete(tableCreatorId, idToken) && (
				<button onClick={deleteTable}>Delete Table</button>
			)}
		</div>
	);
}

export default Table;
