// auth javascript file

import { createUserWithEmailAndPassword, updateProfile, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { getFirestore, doc, setDoc, collection, getDocs } from "firebase/firestore";

// signup function, userprofile creation and doc collection for users

export async function signup(firstname, lastname, email, password) {
    const auth = getAuth();
    const db = getFirestore();

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: `${firstname} ${lastname}`
        });

        // create a new document in the 'users' collection with the user's ID
        await setDoc(doc(db, "users", user.uid), {
            admin: false, // set admin to false
            firstName: firstname,
            lastName: lastname
        });

        return userCredential;
    } catch (error) {
        throw error;
    }
}

// login function

export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password) 
        .then((userCredential) => {
            console.log('Logged in:', userCredential.user);
        })
        .catch((error) => {
            console.error('Error logging in:', error);
        });
    }

// logout function

export function logout(){
    return signOut(auth)
    .then(() => {
        console.log('Logged out');    
    })
    .catch((error) => {
        console.error('Error', error);
    })
}

// function to access all users

export async function getAllUsers() {
    const db = getFirestore();
    const auth = getAuth();
    const usersCollection = collection(db, "users");
    const userDocs = await getDocs(usersCollection);
    const users = [];

    for (const doc of userDocs.docs) {
        const userData = doc.data();
        const userAuthRecord = await auth.getUser(doc.id);

        users.push({
            id: doc.id,
            email: userAuthRecord.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            admin: userData.admin
        });
    }

    return users;
}

