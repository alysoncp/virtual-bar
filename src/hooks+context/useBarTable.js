import { useEffect } from "react";
import db from "../firebase";
import { useStateValue } from "./StateProvider";

export default function useBarTable() {
	const [{ user, at_bar, at_table, last_bar, last_table }] = useStateValue();

	let at_bar_name;
	let at_table_name;

	useEffect(async () => {
		if (user) {
			if (at_bar) {
				const snap = await db.collection("bars").doc(at_bar).get();
				at_bar_name = snap.data().name;
			} else {
				at_bar_name = null;
			}

			if (at_table) {
				const snap = await db
					.collection("bars")
					.doc(at_bar)
					.collection("tables")
					.doc(at_table)
					.get();
				at_table_name = snap.data().name;
			} else {
				at_table_name = null;
			}

			db.collection("users").doc(user.uid).update({
				at_bar: at_bar,
				at_bar_name: at_bar_name,
				at_table: at_table,
				at_table_name: at_table_name,
				last_bar: last_bar,
				last_table: last_table,
			});

			if (!at_table && last_table) {
				db.collection("bars")
					.doc(last_bar)
					.collection("tables")
					.doc(last_table)
					.collection("usersAtTable")
					.doc(user.uid)
					.delete();
			}
		}
	}, [at_bar, at_table]);
}
