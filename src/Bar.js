import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import db from "./firebase";

import Table from "./Table";

import "./Bar.css"

function Bar() {

  const { barId } = useParams();
  const history = useHistory();
  console.log("barID is: ", barId);
  const [barDetails, setBarDetails] = useState(null);
  const [tables, setTables] = useState([]);
  
	useEffect(() => {
		if (barId) {
			db.collection("bars")
				.doc(barId)
				.onSnapshot((snapshot) => setBarDetails(snapshot.data()));
    }

    db.collection("bars")
			.doc(barId)
			.collection("tables")
			.orderBy("number", "asc")
			.onSnapshot((snapshot) =>
        setTables(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            number: doc.data().number,
          }))
        )
			);


  }, [barId]);
  
  const leaveBar = () => {
    history.push('/')
  }

  console.log("Tables: ", tables)

	return (
		<div className="container bar_container">

      <div className="bar_header">
        <div className="header-left">
        <h3>{`Here we are in the ${barDetails?.name} bar`}</h3>
        </div>

        <div className="header-right" onClick={leaveBar}>
          <h4>Leave Bar</h4>
        </div>
      </div>

      <div className="table_list">
        {tables.map(( table ) => (
          <Table 
            key={table.id} 
            id={table.id}
            number={table.number}
          />
        ))}
      </div>
    </div>
	);
}

export default Bar
