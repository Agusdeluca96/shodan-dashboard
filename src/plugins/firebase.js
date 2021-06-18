import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "b"
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (user, additionalData) => {
  if (!user) return;

  const userRef = firestore.doc(`users/${user.uid}`);
  const userSnapShot = await userRef.get();

  if (!userSnapShot.exists) {
    const { displayName, email, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData
      });
    } catch (error) {
      return Promise.reject("Error creating user");
    }
  }
  return userRef;
};

export const getUserHostsRef = async userId => {
  const hostsRef = firestore.collection("hosts").where("userId", "==", userId);
  const snapShot = await hostsRef.get();
  if (snapShot.empty) {
    const hostsDocRef = firestore.collection("hosts").doc();
    await hostsDocRef.set({ userId, searchedHosts: [], scans: [] });
    return hostsDocRef;
  } else {
    return snapShot.docs[0].ref;
  }
};

export const firestore = firebase.firestore();
export const auth = firebase.auth();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebase;
