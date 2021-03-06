
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();

// ----------------------------------------------------------------------------

// auth trigger (new user signup)
exports.newUserSignUp = functions.auth.user().onCreate(user => {
  // for background triggers you must return a value/promise
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    username: user.displayName,
    profile_image: user.photoURL,
  });
});

// ----------------------------------------------------------------------------


// Listen for any change on document `uid` in collection `users`
exports.updateTableUsers = functions.firestore
    .document('users/{uid}')
    .onUpdate((change, context) => {
      // Get an object representing the document
      const newValue = change.after.data();

      // ...or the previous value before this update
      // const previousValue = change.before.data();

      // access a particular field, then update table corresponding 
      if (newValue.state == "offline") {
        return admin.firestore()
          .collection("bars")
          .doc(newValue.last_bar)
          .collection("tables")
          .doc(newValue.last_table)
          .collection("usersAtTable")
          .doc(context.params.uid)
          .delete()
      }

    });



// ----------------------------------------------------------------------------

// Create a new function which is triggered on changes to /users/{uid}
// Note: This is a Realtime Database trigger, *not* Firestore.
exports.onUserStatusChanged = functions.database.ref('/users/{uid}').onUpdate(
    async (change, context) => {
      // Get the data written to Realtime Database
      const eventStatus = change.after.val();

      // Then use other event data to create a reference to the
      // corresponding Firestore document.
      const userStatusFirestoreRef = firestore.doc(`users/${context.params.uid}`);

      // It is likely that the Realtime Database change that triggered
      // this event has already been overwritten by a fast change in
      // online / offline status, so we'll re-read the current data
      // and compare the timestamps.
      const statusSnapshot = await change.after.ref.once('value');
      const status = statusSnapshot.val();
      console.log(status, eventStatus);
      // If the current timestamp for this data is newer than
      // the data that triggered this event, we exit this function.
      if (status.last_changed > eventStatus.last_changed) {
        return null;
      }

      // Otherwise, we convert the last_changed field to a Date
      eventStatus.last_changed = new Date(eventStatus.last_changed);

      // ... and write it to Firestore.
      return userStatusFirestoreRef.update(eventStatus);
    });
// [END presence_sync_function]

