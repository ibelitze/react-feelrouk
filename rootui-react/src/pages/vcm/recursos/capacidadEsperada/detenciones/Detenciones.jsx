import React, { useState, useEffect } from 'react';
import { Col, Form, FormGroup, Row } from 'reactstrap';
import { v4 as generarId } from 'uuid';
import { useForm } from '../../../../../hooks/useForm';
import { useLocalStorage } from '../../../../../hooks/useLocalStorage';
import Tabla from './components/Tabla';
export const Detenciones = ( { storage, title } ) => {
    const validarForm = ( form )=>{
        let error;
        Object.entries( form ).forEach( ( [ , value ] ) => {
            if ( value.length < 3 ) {
                error = "Todos los campos deben contener al menos 3 caracteres";
            }
        } );
        return error;
    };
    const initialForm = {
        _id: generarId(),
        nombre: "",
        descripcion: "",
        tiempo: "",
        tipo: storage,
    };
    const [ detenciones, setDetenciones ] = useState( JSON.parse( window.localStorage.getItem( storage ) ) || [] );
    const [ editar, setEditar ] = useState( false );
    const [ errors, setErrors ] = useState( "" );
    const [ form, handleChange, resetForm, setForm ] = useForm( initialForm );
    const [ handleSubmit, eliminar ] = useLocalStorage( storage );
    useEffect( ()=>{
        setErrors( validarForm( form ) );
    }, [ form ] );
    return <>
        <div className=" mt-20 row recuadro-info-formulario ml-0">
            <Col>
                <h2>Agregar { title }</h2>
                <Form onSubmit={ e => e.preventDefault() }>
                    <Row>
                        <Col md={ 4 } >
                            <FormGroup>
                                <label htmlFor={ "nombre" + storage } >Nombre</label>
                                <input id={ "nombre" + storage } value={ form.nombre } onChange={ handleChange } name="nombre" type="text" className="input-hcm-formulario form-control" />
                            </FormGroup>
                        </Col>
                        <Col md={ 4 } >
                            <FormGroup>
                                <label htmlFor={ "tiempo" + storage } >Tiempo</label>
                                <input id={ "tiempo" + storage } value={ form.tiempo } onChange={ handleChange } name="tiempo" type="time" className="form-control" />
                            </FormGroup>
                        </Col>
                        <Col md={ 4 } >
                            <FormGroup>
                                <label htmlFor={ "descripcion" + storage } >Descripcion</label>
                                <input id={ "descripcion" + storage } value={ form.descripcion } onChange={ handleChange } name="descripcion" type="text" className="input-hcm-formulario form-control" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className="d-flex w-100 justify-content-end pr-20 align-center">
                        <button disabled={ errors } hidden={ editar } onClick={ ()=>{
                            resetForm();
                            handleSubmit( detenciones, setDetenciones, form, resetForm );
                        } } type="button" className="btn btn-feelrouk-naranja2">Agregar</button>
                        <button type="button" disabled={ errors } hidden={ ! editar } onClick={ ()=>{ 
                            handleSubmit( detenciones, setDetenciones, form, resetForm );
                            setEditar( false );
                        } } className=" btn btn-feelrouk-naranja2 ">
                            Guardar
                        </button>
                        <button type="button" hidden={ ! editar } onClick={ ()=>{ 
                            resetForm();
                            setEditar( false );
                        } } className="btn btn-feelrouk-naranja2" style={ { backgroundColor: "grey" } }>
                            Cancelar
                        </button>
                    </Row>
                </Form>
                <div hidden={ ! errors || ! ( form.nombre || form.descripcion || form.tiempo ) } className=" alert alert-danger w-100 ">
                    { errors }
                </div>
            </Col>
        </div>
        <div className="container-tabla" hidden={ ! detenciones.length } >
            <Tabla className="mt-2" id={ form._id } detenciones={ detenciones } setForm={ setForm } setEditar={ setEditar } eliminar={ eliminar } setDetenciones={ setDetenciones } title={ title } ></Tabla>
        </div>
    </>;
};
