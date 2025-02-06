import React, { useState, useEffect } from 'react';
import { useForm } from '../../../../hooks/useForm';
import { InputMicelaneo } from './InputMicelaneo';
import "./_styles.scss";
import boxImg from "../../../../../common-assets/images/vcm/box.svg";
import clip from "../../../../../common-assets/images/vcm/clip.png";
import { cargaMasivaMicelaneo, createMicelaneo } from '../../../../service/vcm/micelaneos/micelaneos';
import FormData from 'form-data';
import Swal from 'sweetalert2';
export const Micelaneos = ( { initialForm, title, ruta } ) => {
    const [ form, handleChange, reset ] = useForm( initialForm );
    const [ errors, setErrors ] = useState( "" );
    const [ selectedFile, setSelectedFile ] = useState( "" );
    const validarForm = ( campos )=>{
        setErrors( "" );
        Object.entries( campos ).map( ( [ campo, value ] )=>{
            if ( campo !== "codigo" ) {
                if ( value.length < 3 ) {
                    setErrors( `${ campo } debe contener al menos 3 caracteres` );
                }
            }
        } );
    };
    const validarBoton = ()=>{
        let formValue = true; 
        Object.entries( form ).forEach( ( [ , value ] )=>{
            if ( value.length !== 0 ) {
                formValue = false;
            }
        } );
        return ( ! errors ) || formValue; 
    };
    useEffect( () => {
        validarForm( form );
    }, [ form ] );
    const handleSubmit = async()=>{
        const res = await createMicelaneo( ruta, form );
        if ( res.status === 200 ) {
            Swal.fire( "", "El micelaneo se ha creado correctamente", "success" );
            reset();
        }
        if ( res.status === 400 ) {
            Swal.fire( "", "El micelaneo ya existe", "error" );
        } 
        if ( res.status === 500 ) {
            Swal.fire( "Ha ocurrido un error inesperado", "error" );
        }
    };
    const handleSubmitMasivo = async( e )=>{
        e.preventDefault();
        const bodyFormData = new FormData();
        bodyFormData.set( "csv", selectedFile );
        const res = await cargaMasivaMicelaneo( ruta, bodyFormData );
        if ( res.status === 200 ) {
            Swal.fire( "", "Los micelaneos se han creado correctamente", "success" );
        }
        if ( res.status === 400 ) {
            Swal.fire( "", res.data.mensaje, "error" );
        }
        if ( res.status === 500 ) {
            Swal.fire( "Ha ocurrido un error inesperado", "error" );
        }
    };
    return (
        <div className="container-micelaneos">
            <h1>
                <img src={ boxImg } alt="caja" />
                { title }
            </h1>
            <div className="d-flex justify-content-between container-form">
                <form>
                    {
                        Object.entries( form ).map( ( [ name, value ] )=>{
                            return <InputMicelaneo key={ title + name } name={ name } value={ value } forLabel={ title } onChange={ handleChange } />;
                        } )
                    }
                    <div className="alert" hidden={ validarBoton() } >
                        { errors }
                    </div>
                    
                    <div className="d-flex w-100 justify-content-end">
                        <button className="btn-blue" type="button" disabled={ errors } onClick={ handleSubmit } > Cargar </button>
                    </div>
                </form>
                <div>
                    <form onSubmit={ handleSubmitMasivo }>
                        <input onChange={ ( { target } )=>{
                            setSelectedFile( target.files[ 0 ] );
                        } } name="csv" type="file" />
                        <button disabled={ ! selectedFile } className="btn-orange" type="subtmit" >Cargar</button>
                    </form>
                    <a href={ `ExampleCSV/${ ruta }.csv` } download={ `${ ruta }.csv` }> 
                        <img src={ clip } alt="clip" />
                        Descargar archivo de ejemplo
                    </a>
                </div>
            </div>
        </div>
    );
};
