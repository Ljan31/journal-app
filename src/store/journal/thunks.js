import { collection, deleteDoc, doc, setDoc } from "firebase/firestore/lite";
import { FirebaseDB } from "../../firebase/config";
import { addNewEmptyNote, deleteNoteById, savingNewNote, setActiveNote, setNotes, setPhotosToActionNote, setSaving, updateNote } from "./";
import { fileUpload, loadNotes } from "../../helpers";

export const startNewNote = () => {
    return async( dispatch, getState )=>{
        // console.log(getState())
        // dispatch isSaving?
        dispatch( savingNewNote() );
        
        // uid
        const { uid } = getState().auth;
        console.log('startNewNote')
        const newNote = {
            title: '',
            body: '',
            date: new Date().getTime(),
        }
        // coleccion 
        const newDoc = doc( collection( FirebaseDB, `${uid}/journal/notes` ) );
        const setDocResp = await setDoc( newDoc, newNote );
        
        // console.log({newDoc, setDocResp})
        newNote.id = newDoc.id;

        // dispatch
        dispatch( addNewEmptyNote( newNote ) );
        dispatch( setActiveNote(newNote) );
    }
}

export const startLoadingNotes = () =>{
    return async(dispatch, getState) => {
        const { uid } = getState().auth;
        if(!uid) throw new Error("El UID del usuario no existe");
        
        const notes = await loadNotes(uid);
        // console.log(notes)
        dispatch( setNotes( notes ) );
    }
}

export const startSavedNote = () => {
  return async( dispatch, getState ) =>{
    dispatch( setSaving() );
    const { uid } = getState().auth;
    const { active: note } = getState().journal;

    const noteToFireStore = {...note};
    delete noteToFireStore.id;
    // console.log(noteToFireStore)
    const docRef = doc(FirebaseDB, `${uid}/journal/notes/${note.id}`);
    await setDoc(docRef, noteToFireStore, { merge: true });

    dispatch( updateNote( note ) );
  }   
}

export const startUploadingFiles = (files = []) => {
    return async( dispatch ) => {
        dispatch( setSaving() );
        // console.log(files)
        // await fileUpload( files[0] ); // subir un archivo

        // subir varios archivos simultaneamente
        const fileUploadPromises = [];
        for (const file of files) {
            fileUploadPromises.push( fileUpload( file ) ) // creando las promesas
        }

        const photosUrls = await Promise.all( fileUploadPromises );
        // console.log(photosUrls);
        dispatch( setPhotosToActionNote(photosUrls) );
    }
}

export const startDeletingNote = () => {
    return async( dispatch, getState ) => {
        const {uid} = getState().auth;
        const {active: note} = getState().journal;
        // console.log({uid, note})
        const docRef = doc( FirebaseDB, `${uid}/journal/notes/${note.id}`);
        // const resp = await deleteDoc( docRef );
        await deleteDoc( docRef );
        dispatch( deleteNoteById(note.id) );
        
    }
}