import React, { useEffect, useState } from 'react';
import { v4 as generarId } from 'uuid';
import { Form, FormGroup, Row, Col } from 'reactstrap';
import Tabla from './components/Tabla';
import './_styles.scss';
import { getStorage, setStorage } from '../../helpers/manejoStorage';
import { useMicelaneos } from '../../../../hooks/useMicelaneos';
import { useParams } from 'react-router-dom';
const Suministros = ( { currentStep, next, prev, medida, moneda } ) => {
    const validarForm = ( { costo, consumo, ...form } )=>{
        let error;
        Object.entries( form ).forEach( ( [ , value ] ) => {
            if ( value?.length < 3 ) {
                error = "Todos los campos deben contener al menos 3 caracteres";
            }
        } );
        if ( costo < 1 || consumo < 1 ) {
            error = "Los campos numericos deben ser igual o mayor a 1";
        }
        return error;
    };
    const initialForm = {
        _id: generarId( ),
        tipo: "",
        suministro: "",
        unidad: { ...medida },
        costo: "",
        consumo: "",
        moneda: { ...moneda },
    };
    if ( ! moneda?._id && ! medida?._id ) {
        return "...loading";
    }
    const { id: idLinea } = useParams();
    const [ suministros, setSuministros ] = useState( getStorage( `${ idLinea } - suministros` ) || [] );
    const [ form, setForm ] = useState( { ...initialForm } );
    const [ errors, setErrors ] = useState( "" );
    const [ editar, setEditar ] = useState( false );
    const { suministros: sumTipos } = useMicelaneos();
    useEffect( ()=>{
        setErrors( validarForm( form ) );
    }, [ form ] );
    const handleChange = ( { target } )=>{
        if ( target.name === "moneda" ) {
            setForm( { ...form, [ target.name ]: target.value.toUpperCase() } );
        } else {
            setForm( { ...form, [ target.name ]: target.value } );
        }
    };
    const handleSubmit = ()=>{
        const existe = suministros.find( e => e._id === form._id );
        if ( existe ) {
            const existentes = getStorage( `${ idLinea } - suministros` );
            const nuevo = existentes.map( ( e )=>{
                return e._id === form._id ? form : e;
            } );
            setStorage( `${ idLinea } - suministros`, nuevo );
            setSuministros( getStorage( `${ idLinea } - suministros` ) );
            setForm( { ...initialForm } );
        } else {
            setSuministros( [ ...suministros, form ] );
            setForm( { ...initialForm } );
            setStorage( `${ idLinea } - suministros`, [ ...suministros, form ] );
        }
    };
    const eliminar = ( { id } )=>{
        const existentes = getStorage( `${ idLinea } - suministros` );
        const nuevo = existentes.filter( e => e._id !== id );
        setStorage( `${ idLinea } - suministros`, nuevo );
        setSuministros( getStorage( `${ idLinea } - suministros` ) );
    };
    if ( currentStep !== 2 ) {
        return null;
    }
    return (
        <div className="container-sum">
            <h1 className="mt-20" >2 - Suministros</h1>
            <h3>Agregar Suministro</h3>
            <Form className="recuadro-info-formulario row" onSubmit={ e => e.preventDefault() } >
                <Row form>
                    <Col md={ 4 }>
                        <FormGroup>
                            <select onChange={ handleChange } name="tipo" value={ form.tipo } type="text" className="input-hcm-formulario" placeholder="Tipo" >
                                <option value="">Seleccione un tipo</option>
                                {
                                    sumTipos.map( ( tipo )=>{
                                        return <option key={ tipo._id } value={ JSON.stringify( { ...tipo } ) }>{ tipo.nombre }</option>;
                                    } )
                                }
                            </select>
                        </FormGroup>
                    </Col>
                    <Col md={ 4 }>
                        <FormGroup>
                            <input onChange={ handleChange } name="suministro" value={ form.suministro } type="text" className="input-hcm-formulario" placeholder="Suministro" />
                        </FormGroup>
                    </Col>
                    <Col md={ 4 }>
                        <FormGroup>
                            <input disabled name="unidad" type="text" value={ form.unidad.nombre } className="input-hcm-formulario" placeholder="Unidad de Medida" />
                        </FormGroup>
                    </Col>
                    <Col md={ 4 }>
                        <FormGroup>
                            <input onChange={ handleChange } name="consumo" type="number" value={ form.consumo } className="input-hcm-formulario" placeholder="Consumo" />
                        </FormGroup>
                    </Col>
                    <Col md={ 4 }>
                        <FormGroup>
                            <input onChange={ handleChange } name="costo" type="number" value={ form.costo } className="input-hcm-formulario" placeholder="Costo" />
                        </FormGroup>
                    </Col>
                    <Col md={ 4 }>
                        <FormGroup>
                            <input disabled name="moneda" type="text" value={ form.moneda.nombre } className="input-hcm-formulario" placeholder="Moneda" />
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="w-100 justify-content-end">
                    <Col md="6" className="align-elements-right">
                        <button hidden={ editar } disabled={ errors } onClick={ handleSubmit } className=" btn btn-feelrouk-naranja2">Agregar</button>
                        <button hidden={ ! editar } disabled={ errors } onClick={ ()=>{ 
                            handleSubmit();
                            setEditar( false );
                        } } className=" btn btn-feelrouk-naranja2">Guardar</button>
                        <button hidden={ ! editar } onClick={ ()=>{ 
                            setForm( { ...initialForm } );
                            setEditar( false );
                        } } className=" btn btn-feelrouk-naranja2 " style={ { backgroundColor: "grey" } } >Descartar</button>
                    </Col>  
                </Row>
                <div hidden={ ! errors || ! ( form.tipo || form.suministro || form.costo || form.consumo ) } className=" w-100 alert alert-danger ">
                    { errors }
                </div>
            </Form>
            <div className="mb-50">
                <Tabla className="mt-2" hide={ false } id={ form._id } suministros={ suministros } setForm={ setForm } eliminar={ eliminar } setEditar={ setEditar }></Tabla>
                <div className="d-flex w-100 justify-content-between pl-20 pr-20 align-center">
                    <button onClick={ ()=>{
                        prev();
                    } } type="button" className="btn btn-feelrouk-naranja2 btn-blue">Volver</button>
                    <button disabled={ suministros.length < 1 } type="button" onClick={ ()=>{ 
                        next();
                    } } className=" btn btn-feelrouk-naranja2 ">
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Suministros;
