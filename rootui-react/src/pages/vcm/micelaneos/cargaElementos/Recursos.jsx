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
import { isEmpty } from '../../crearLDP/utilities';
const initialForm = {
    nombre: "",
    modelo: "",
    costo: "",
    rel_seccion: "",
    rel_categoria: "",
    rel_subcategoria: "",
};
export const Recursos = ( { updateSecciones, updateCategorias, updateSubcategorias, secciones, categorias, subcategorias, setCategorias, setSubcategorias } ) => {
    const [ form, handleChange, reset, setForm ] = useForm( initialForm );
    const [ errors, setErrors ] = useState( "" );
    const validarForm = ( { nombre, modelo, costo, rel_seccion: seccion } )=>{
        setErrors( "" );
        if ( seccion < 3 ) {
            setErrors( `Debe Seleccionar una seccion` );
        }
        if ( nombre.length < 3 ) {
            setErrors( `El nombre debe contener al menos 3 caracteres` );
        }
        if ( modelo.length < 3 ) {
            setErrors( `El modelo debe contener al menos 3 caracteres` );
        }
        if ( costo === "" ) {
            setErrors( `El campo costo no puede estar vacio` );
        }
        if ( isNaN( parseInt( costo ) ) ) {
            setErrors( `El campo costo solo debe contener numeros` );
        }
        if ( ! costo > 0 ) {
            setErrors( `El campo costo debe ser mayor a 0` );
        }
    };

    useEffect( () => {
        validarForm( form );
    }, [ form ] );
    useEffect( () => {
        updateSecciones();
    }, [] );
    useEffect( () => {
        setForm( ( f )=>{
            return { ...f,
                rel_categoria: "",
                rel_subcategoria: "" };
        } );
        
        if ( form.rel_seccion ) {
            updateCategorias( form.rel_seccion );
        } else {
            setCategorias( [] );
            setSubcategorias( [] );
        }
    }, [ form.rel_seccion ] );
    useEffect( () => {
        setForm( ( f )=>{
            return { ...f,
                rel_subcategoria: "" };
        } );
        if ( form.rel_categoria ) {
            updateSubcategorias( form.rel_categoria );
        }
        setSubcategorias( [] );
    }, [ form.rel_categoria ] );
    const handleSubmit = async()=>{
        const res = await createMicelaneo( "recursos", form );
        if ( res.status === 200 ) {
            reset();
            Swal.fire( "", "Recurso creado con exito", "success" );
        }
        if ( res.status === 400 ) {
            Swal.fire( "", "El recurso ya existe", "error" );
        }
        if ( res.status === 500 ) {
            Swal.fire( "", "Error al crear el recurso", "error" );
        }
    };
    return (
        <div className="container-micelaneos">
            <h1>
                <img src={ boxImg } alt="caja" />
                Recursos
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
                                overlay={ props => renderTooltip( { props, texto: "Campo Obligatorio" } ) }
                            >
                                <img alt={ "informacion" } src={ alert } />
                            </OverlayTrigger>
                        </div>
                    </label>
                    <label className="carga-productos-label" htmlFor={ "categorias" }>
                        Categorias
                        <div>
                            <select className="form-control" name="rel_categoria" value={ form.rel_categoria } onChange={ handleChange }>
                                <option value="">Seleccione una opción</option>
                                {
                                    categorias.map( ( categoria )=>{
                                        return (
                                            <option key={ categoria._id } value={ categoria._id }>{ categoria.nombre }</option>
                                        );
                                    } )
                                }
                            </select>
                            <OverlayTrigger
                                placement="right"
                                delay={ { show: 250, hide: 400 } }
                                overlay={ props => renderTooltip( { props, texto: "Campo Opcional" } ) }
                            >
                                <img alt={ "informacion" } src={ alert } />
                            </OverlayTrigger>
                        </div>
                    </label>
                    <label className="carga-productos-label" htmlFor={ "subcategorias" }>
                        Subcategorias
                        <div>
                            <select className="form-control" name="rel_subcategoria" value={ form.rel_subcategoria } onChange={ handleChange }>
                                <option value="">Seleccione una opción</option>
                                {
                                    subcategorias.map( ( subcategoria )=>{
                                        return (
                                            <option key={ subcategoria._id } value={ subcategoria._id }>{ subcategoria.nombre }</option>
                                        );
                                    } )
                                }
                            </select>
                            <OverlayTrigger
                                placement="right"
                                delay={ { show: 250, hide: 400 } }
                                overlay={ props => renderTooltip( { props, texto: "Campo Opcional" } ) }
                            >
                                <img alt={ "informacion" } src={ alert } />
                            </OverlayTrigger>
                        </div>
                    </label>
                    <InputMicelaneo name={ "nombre" } value={ form.nombre } forLabel={ "nombre" } onChange={ handleChange } />
                    <InputMicelaneo name={ "modelo" } value={ form.modelo } forLabel={ "modelo" } onChange={ handleChange } />
                    <InputMicelaneo name={ "costo" } value={ form.costo } forLabel={ "costo" } onChange={ handleChange } />
                    <div className="alert" hidden={ isEmpty( form ) || ! errors } >
                        { errors }
                    </div>
                    
                    <div className="d-flex w-100 justify-content-end">
                        <button className="btn-blue" type="button" disabled={ isEmpty( form ) || errors } onClick={ handleSubmit } > Cargar </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
