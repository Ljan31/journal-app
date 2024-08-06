import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { FirebaseAuth } from "./config";

const googleProvider = new GoogleAuthProvider();

export const singInWithGoogle = async() => {
    try {
        const result = await signInWithPopup( FirebaseAuth, googleProvider );
        // const credentials = GoogleAuthProvider.credentialFromResult( result );
        // console.log({ credentials });
        const { displayName, email, photoURL, uid } = result.user;
        // console.log({user})
        return {
            ok: true,
            displayName, email, photoURL, uid
        }
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // the email of the users account used.
        // const email = error.customData.email;
        // the AuthCredentials type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);

        return {
            ok: false,
            errorMessage
        }
    }
}

export const registerUserWithEmailPassword = async({email, password, displayName}) => {
    try {
        // console.log({email, password, displayName});
        const resp = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
        const { uid, photoURL } = resp.user;
        // console.log('privder',{resp})
        // todo actualizar el dislpayName en firebase
        await updateProfile(FirebaseAuth.currentUser, {
            displayName
        });
        
        return {
            ok: true,
            uid, photoURL, email, displayName
        }
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {
            ok: false,
            errorMessage: error.message
        }
    }
}

export const loginWithEmailPassword = async({ email, password }) =>{
    try {
        // signInWithEmailAndPassword
        const resp = await signInWithEmailAndPassword( FirebaseAuth, email, password );
        // console.log(resp)
        const { uid, displayName, photoURL } = resp.user;
        // console.log('provider',{resp})
        return {
            ok: true,
            uid, displayName, photoURL
        }
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {
            ok: false,
            errorMessage: error.message
        }
    }
}


export const logoutFirebase = async() => {
    return await FirebaseAuth.signOut();
}