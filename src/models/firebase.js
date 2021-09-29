import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {
  LIMIT_PER_PAGE,
  REQUEST_EVENTS,
  REQUEST_STATUS,
  MODAL_TYPES,
  USERS,
} from "../Common/constants";

var firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);
export const firebaseApp = firebase;
export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const login = async (email, password) => {
  await auth.signInWithEmailAndPassword(email, password);
};

export const signOut = (noRefresh) => {
  auth.signOut().then(function () {
    if (!noRefresh) {
      window.location.reload();
      window.location.href = "/login";
    }
  });
};

export const getRequestsByStatus = async (status, lastSnapshot) => {
  try {
    if (!status) throw "Status is invalid";

    var snapshots = null;
    let usersRef = firestore.collection("requests");

    if (!lastSnapshot) {
      snapshots = await usersRef
        .where("status", "==", status)
        .orderBy("lastUpdatedAt", "desc")
        .limit(LIMIT_PER_PAGE)
        .get();
    } else {
      snapshots = await usersRef
        .where("status", "==", status)
        .orderBy("lastUpdatedAt", "desc")
        .startAt(lastSnapshot)
        .limit(LIMIT_PER_PAGE)
        .get();
    }

    if (!snapshots || snapshots.empty) {
      // console.log("No matching documents.");
      return [];
    }

    let snapshotsList = [];
    snapshots.forEach((doc) => {
      if (!lastSnapshot || doc.id !== lastSnapshot.id) {
        snapshotsList.push(doc);
      }
    });

    // console.log(snapshotsList);

    return snapshotsList;
  } catch (err) {
    console.log(err);
    if (err.message) throw err.message;
    else throw err;
  }
};

export const delayRequest = async (requestId, message, modalType) => {
  if (!requestId) {
    console.log(requestId + "- Request ID is invalid");
    throw "Request ID is invalid";
  }

  let doc = await firestore.collection("requests").doc(requestId).get();
  if (!doc || !doc.data()) throw "Unable to get request with the provided ID";

  let data = doc.data();
  if (!modalType && data.status !== REQUEST_STATUS.IN_PROGRESS)
    throw "Request in invalid status. Please refresh.";

  let logs = data.logs;
  if (logs.length > 0) {
    logs[logs.length - 1].timestamp = data.lastLoggedAt;
  }

  let event = REQUEST_EVENTS.DELAYED
  if (modalType === MODAL_TYPES.REOPEN) {
    event = REQUEST_EVENTS.REOPENED
  }
  logs.push({ event: event, message, user: USERS.ADMIN });

  let newDocRef = await firestore.collection("requests").doc(requestId).update({
    logs,
    status: REQUEST_STATUS.IN_PROGRESS,
    lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    lastLoggedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  return newDocRef;
};

export const approveRequest = async (requestId, message) => {
  if (!requestId) {
    console.log(requestId + "- Request ID is invalid");
    throw "Request ID is invalid";
  }

  let doc = await firestore.collection("requests").doc(requestId).get();
  if (!doc || !doc.data()) throw "Unable to get request with the provided ID";

  let data = doc.data();
  if (
    data.status !== REQUEST_STATUS.PENDING_APPROVAL &&
    data.status !== REQUEST_STATUS.REJECTED
  )
    throw "Request in invalid status. Please refresh.";

  let logs = data.logs;
  if (logs.length > 0) {
    logs[logs.length - 1].timestamp = data.lastLoggedAt;
  }

  logs.push({ event: REQUEST_EVENTS.ACCEPTED, message, user: USERS.ADMIN });

  let newDocRef = await firestore.collection("requests").doc(requestId).update({
    logs,
    status: REQUEST_STATUS.IN_PROGRESS,
    lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    lastLoggedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  return newDocRef;
};

export const rejectRequest = async (requestId, message) => {
  if (!requestId) throw "Request ID is invalid";

  let doc = await firestore.collection("requests").doc(requestId).get();
  if (!doc || !doc.data()) throw "Unable to get request with the provided ID";

  let data = doc.data();
  if (
    data.status !== REQUEST_STATUS.PENDING_APPROVAL &&
    data.status !== REQUEST_STATUS.IN_PROGRESS
  )
    throw "Request in invalid status. Please refresh.";

  let logs = data.logs;
  if (logs.length > 0) {
    logs[logs.length - 1].timestamp = data.lastLoggedAt;
  }
  logs.push({ event: REQUEST_EVENTS.REJECTED, message, user: USERS.ADMIN });

  let newDocRef = await firestore.collection("requests").doc(requestId).update({
    logs,
    status: REQUEST_STATUS.REJECTED,
    lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    lastLoggedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  // console.log(newDocRef);
  return newDocRef;
};

export const completeRequest = async (requestId, message) => {
  if (!requestId) throw "Request ID is invalid";

  let doc = await firestore.collection("requests").doc(requestId).get();
  if (!doc || !doc.data()) throw "Unable to get request with the provided ID";

  let data = doc.data();
  if (data.status !== REQUEST_STATUS.IN_PROGRESS)
    throw "Request in invalid status. Please refresh.";

  let logs = data.logs;
  if (logs.length > 0) {
    logs[logs.length - 1].timestamp = data.lastLoggedAt;
  }
  logs.push({ event: REQUEST_EVENTS.COMPLETED, message, user: USERS.ADMIN });

  let newDocRef = await firestore.collection("requests").doc(requestId).update({
    logs,
    status: REQUEST_STATUS.COMPLETED,
    lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    lastLoggedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  // console.log(newDocRef);
  return newDocRef;
};

export const getServiceRequestById = async (requestId) => {
  try {
    if (!requestId) throw "Request ID is invalid";

    let doc = await firestore.collection("requests").doc(requestId).get();
    if (!doc || !doc.data()) throw "Unable to get request with the provided ID";

    return [doc];
  } catch (err) {
    console.log(err);
    if (err.message) throw err.message;
    else throw "Invalid request";
  }
};

export const getServiceRequestsByAddress = async (address) => {
  try {
    if (!address) throw "Request ID is invalid";

    let collRef = firestore.collection("requests");
    let snapshot = await collRef
      .where("address", "==", address)
      .orderBy("lastUpdatedAt", "desc")
      .limit(3)
      .get();
    if (!snapshot || snapshot.empty)
      throw "Unable to get requests for the provided address";

    let docs = [];
    snapshot.forEach((doc) => {
      // docs.push({ id: doc.id, data: doc.data() });
      docs.push(doc);
    });
    return docs;
  } catch (err) {
    console.log(err);
    if (err.message) throw err.message;
    else throw "Invalid request";
  }
};
