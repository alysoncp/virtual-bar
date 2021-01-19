import { useEffect } from "react"
import db from "../firebase";
import { useStateValue } from "./StateProvider";

export default function useBarTable() {

  const [{ user, at_bar, at_table, last_bar, last_table }] = useStateValue();

  useEffect(() => {
		console.log("At bar: ", at_bar);
    console.log("At table: ", at_table);
    console.log("Last bar: ", last_bar);
    console.log("Last table: ", last_table);
    
    if(user) {
      db.collection("users")
        .doc(user.uid)
        .update({
          at_bar: at_bar,
          at_table: at_table,
        })

      if(!at_table) {
        db.collection("bars")
        .doc(last_bar)
        .collection("tables")
        .doc(last_table)
        .collection("usersAtTable")
        .where("uid", "==", user.uid)
        .get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          }); 
        }); 
      }  
    }
     


      
  }, [at_bar, at_table])
  
  useEffect(() => {
    console.log("Update to user: ", user);

  }, [user])


}