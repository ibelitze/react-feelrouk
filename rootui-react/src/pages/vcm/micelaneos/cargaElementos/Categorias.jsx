import React, { useState, useEffect } from 'react';
import { useForm } from '../../../../hooks/useForm';
import "../Components/_styles.scss";
import boxImg from "../../../../../common-assets/images/vcm/box.svg";
import { createMicelaneo } from '../../../../service/vcm/micelaneos/micelaneos';
import { InputMicelaneo } from '../Components/InputMicelaneo';
import { renderTooltip } from '../../helpers/renderToolTip';
import { OverlayTrigger } from 'react-bootstrap';
import alert from '../../../../../common-assets/images/vcm/alert-circle.png';
import Swal from 'sweetalert2';
const initialForm = {
    nombre: "",
    rel_seccion: "",
};
export const Categorias = ( { secciones = [] } ) => {
    const [ form, handleChange, reset ] = useForm( initialForm );
    const [ errors, setErrors ] = useState( "" );
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
        const res = await createMicelaneo( "categorias", form );
        if ( res.status === 200 ) {
            reset();
            Swal.fire( "", "Categoria creada con exito", "success" );
        }
        if ( res.status === 400 ) {
            Swal.fire( "", "La categoria ya existe", "error" );
        }
        if ( res.status === 500 ) {
            Swal.fire( "", "Error al crear la categoria", "error" );
        }
    };
    return (
        <div className="container-micelaneos">
            <h1>
                <img src={ boxImg } alt="caja" />
                Categorias
            </h1>
            <div className="d-flex justify-content-between container-form">
                <form>
                    <label className="carga-productos-label" htmlFor={ "seccion" }>
                        Seccion
                        <div>
                            <select className="form-control" name="rel_seccion" value={ form.rel_seccion } onChange={ handleChange }>
                                <option value="">Seleccione una opción</option>
                                {
                                    secciones.map( ( seccion )=>{
                                        return (
                                            <option key={ seccion._id } value={ seccion._id }>{ seccion.nombre }</option>
                                        );
                                    } )
                                }
                            </select>
                            <OverlayTrigger
                                placement="right"
                                delay={ { show: 250, hide: 400 } }
                                overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                            >
                                <img alt={ "informacion" } src={ alert } />
                            </OverlayTrigger>
                        </div>
                    </label>
                    <InputMicelaneo name={ "nombre" } value={ form.nombre } forLabel={ "categorias" } onChange={ handleChange } />
                    <div className="alert" hidden={ validarBoton() } >
                        { errors }
                    </div>
                    
                    <div className="d-flex w-100 justify-content-end">
                        <button className="btn-blue" type="button" disabled={ errors } onClick={ handleSubmit } > Cargar </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
