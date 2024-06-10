// auth.js file

import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// signup function, userprofile creation and doc collection for users

export async function signup(firstname, lastname, email, password) {
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
            return userCredential; // Return the userCredential
        })
        .catch((error) => {
            console.error('Error logging in:', error);
            throw error;
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
        throw error;
    })
}
