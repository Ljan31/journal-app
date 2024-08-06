import { loginWithEmailPassword, logoutFirebase, registerUserWithEmailPassword, singInWithGoogle } from "../../firebase/providers";
import { clearNotesLogout } from "../journal/journalSlice";
import { checkingCredentials, login, logout } from "./";

export const checkingAuthentication = (email, password) => {
    return async( dispatch ) => {
        dispatch( checkingCredentials() );
    }
}

export const startGoogleSingIn = () =>{
    return async( dispatch ) => {
        dispatch( checkingCredentials() );

        const result = await singInWithGoogle();
        // console.log({result})
        if( !result.ok ) return dispatch( logout( result.errorMessage ) );
        // delete result.ok;
        dispatch( login( result ) );
    }
}

export const startCreatingUserWithEmailPassword = ({email, password, displayName}) => {
    return async( dispatch ) => {
        dispatch( checkingCredentials() );

        const result = await registerUserWithEmailPassword({email, password, displayName});
        // console.log(resp)
        if( !result.ok ) return dispatch( logout(result) );

        dispatch( login( result) );
    }
}

export const startLoginWithEmailPassword = ({ email, password }) =>{
    return async(dispatch) => {
        dispatch( checkingCredentials() );
        const result = await loginWithEmailPassword({email, password});
        // console.log(result)
        if( !result.ok ) return dispatch( logout(result) );

        dispatch( login( result ) )
    }
}

export const startLogout = () => {
    return async( dispatch ) => {
        await logoutFirebase();
        dispatch( clearNotesLogout() );
        dispatch( logout() );
    }
}