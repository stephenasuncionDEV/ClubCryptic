import env from "react-dotenv";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

initializeApp({
    apiKey: env.apiKey,
    authDomain: env.authDomain,
    projectId: env.projectId,
    storageBucket: env.storageBucket,
    messagingSenderId: env.messagingSenderId,
    appId: env.appId
});

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();
const analytics = getAnalytics();

const logoutHandler = () => {
    signOut(auth)
    .catch((error) => { 
        console.log(error) 
    });
}

const loginHandler = (userData) => {
    const hash = Base64.stringify(sha256(userData.id));
    signInWithEmailAndPassword(auth, userData.email, hash)
    .catch((error) => {
        console.log(error)
    })
}

const registerHandler = (userData) => {
    const hash = Base64.stringify(sha256(userData.id));
    createUserWithEmailAndPassword(auth, userData.email, hash)
    .then((res) => {
        return updateProfile(auth.currentUser, {
            displayName: userData.username,
            photoURL: "https://i.postimg.cc/Fz23jtHw/noprofile.png"
        })
    })
    .then((res) => {
        return setDoc(doc(db, "players", userData.email), {
            email: userData.email,
            id: userData.id,
            nickname: userData.username,
            hash: hash,
            properties: []
        })
    })
    .then((res) => {
        loginHandler(userData);
    })
    .catch((error) => {
        console.log(error)
    });
}

const loginDiscordHandler = (userData) => {
    const userRef = doc(db, "players", userData.email);
    getDoc(userRef)
    .then((snap) => {
        if (snap.exists) {
            loginHandler(userData);
        } else {
            registerHandler(userData);
        }
    }).catch((error) => {
        console.log(error)
    })
}

export { db, auth, storage, analytics, loginDiscordHandler, logoutHandler };