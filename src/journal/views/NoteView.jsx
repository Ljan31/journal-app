import { useMemo, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { SaveOutlined, UploadOutlined, DeleteOutline } from "@mui/icons-material"
import { Button, Grid, IconButton, TextField, Typography } from "@mui/material"
import Swal from "sweetalert2"
import 'sweetalert2/dist/sweetalert2.css';

import { ImageGallery } from "../components"
import { useForm } from "../../hooks"
import { setActiveNote, startDeletingNote, startSavedNote, startUploadingFiles } from "../../store/journal"

export const NoteView = () => {
  const dispatch = useDispatch();
  const { active: note, messageSaved, isSaving } = useSelector(state => state.journal);

  const {body, title, date, onInputChange, formState} = useForm(note);

  const dateString = useMemo(()=>{
    
    const newDate = new Date(date);
    return newDate.toUTCString();

  },[date]);
  
  const fileInputRef = useRef();


  useEffect(()=>{
    dispatch( setActiveNote( formState ) );
  },[formState]);

  useEffect( () => {
    if( messageSaved.length > 0 ){
      Swal.fire('Nota actualizada', messageSaved, 'success');
    }
  },[messageSaved] );

  const onSaveNote = () => {
    dispatch( startSavedNote() );
  }

  const onFileInputChange = ({ target }) => {
    // console.log(target.files)
    if( target.files === 0 ) return;
    // console.log('Subiendo archivos')
    dispatch( startUploadingFiles(target.files) );
  }

  const onDelete = () => {
    dispatch( startDeletingNote() );
  };

  return (
    <Grid 
      className='animate__animated animate__fadeIn animate__faster'
      container 
      direction='row' 
      justifyContent='space-between' 
      sx={{ mb:1 }}
    >
      <Grid item>
        <Typography fontSize={39} fontWeight='light'>{ dateString }</Typography>
      </Grid>

      <Grid item>
        <input
          type='file'
          multiple
          ref = { fileInputRef }
          onChange={ onFileInputChange }
          style={{ display:'none' }}
        />
        <IconButton
          color="primary"
          disabled = { isSaving }
          onClick={ () => fileInputRef.current.click() }
        >
          <UploadOutlined/>
        </IconButton>
        <Button 
          disabled={ isSaving }
          onClick={ onSaveNote }
          color='primary' 
          sx={{padding:2}}
        >
          <SaveOutlined sx={{fontSize:30, mr:1}}/>
            Guardar
        </Button>
      </Grid>

      <Grid container>
        <TextField
          type="text"
          variant="filled" // gris
          fullWidth // all el ancho posible
          placeholder="Intrese un titulo"
          label="Titulo"
          sx={{ border:'none', mb:1 }}
          name="title"
          value={title}
          onChange={ onInputChange }
        />

        <TextField
          type="text"
          variant="filled" // gris
          fullWidth // all el ancho posible
          multiline
          placeholder="¿Que sucedio en el dia de hoy?"
          minRows={5}
          name="body"
          value={body}
          onChange={ onInputChange }
        />

      </Grid>
        
        <Grid container justifyContent='end'>
          <Button
            onClick={ onDelete }
            sx={{ mt:2 }}
            color = 'error'
          >
            <DeleteOutline/>
            Borrar
          </Button>
        </Grid>

        <ImageGallery images = {note.imageUrls}/>
    </Grid>
  )
}