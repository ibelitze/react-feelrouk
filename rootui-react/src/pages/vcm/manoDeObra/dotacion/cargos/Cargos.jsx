import React, { useState, useEffect } from 'react';
import { Col, Form, FormGroup, Row } from 'reactstrap';
import { Modal } from 'react-bootstrap';
import { v4 as generarId } from 'uuid';
import { useForm } from '../../../../../hooks/useForm';
import Tabla from './components/Tabla';
import { HeaderHabilitacionMOD } from './components/HeaderHabilitacionMOD';
import { BodyHabilitacion } from './components/BodyHabilitacion';
import './components/_styles.scss';
import { getByEmpresa } from '../../../../../service/vcm/micelaneos/micelaneos';
import { setStorage } from '../../../helpers/manejoStorage';
import { useParams } from 'react-router-dom';
const Cargos = ( { moneda, setHabilitaciones, cargos, setCargos, deleteRecurso } ) => {
    const { id: idLinea } = useParams();
    const [ show, setShow ] = useState( {
        modal: false,
        cargo: {},
    } );
    const validarForm = ( form )=>{
        let error;
        Object.entries( form ).forEach( ( [ , value ] ) => {
            if ( value.length < 1 ) {
                error = "Todos los campos deben contener al menos 1 caracteres";
            }
        } );
        return error;
    };
    const initialForm = {
        id: generarId(),
        cargo: "",
        cantidad: "",
        costo: "",
    };

    const [ editar, setEditar ] = useState( false );
    const [ errors, setErrors ] = useState( "" );
    const [ form, handleChange, resetForm, setForm ] = useForm( initialForm );
    const [ filters, setFilters ] = useState( {
        seccion: "",
        categoria: "",
        subcategoria: "",
    } );

    const [ listaCargos, setListaCargos ] = useState( [] );
    useEffect( () => {
        getCargos();
    }, [ ] );
    const getCargos = async()=>{
        const response = await getByEmpresa( 'cargos' );
        if ( response.status === 200 ) {
            setListaCargos( response.data.Cargos );
        }
    };
    useEffect( ()=>{
        setErrors( validarForm( form ) );
    }, [ form ] );
    const eliminar = ( id )=>{
        deleteRecurso( id );
        setStorage( `${ idLinea } - cargos`, cargos.filter( ( cargo ) => cargo.id !== id ) );
        setCargos( cargos.filter( ( cargo )=>cargo.id !== id ) );
    };
    const crearCargo = ()=>{
        const cargoExistente = cargos.find( ( cargo )=>JSON.parse( cargo.cargo )._id === JSON.parse( form.cargo )._id );
        if ( cargoExistente ) {
            const cargosActualizados = cargos.map( ( cargo )=>{
                if ( JSON.parse( cargo.cargo )._id === JSON.parse( form.cargo )._id ) {
                    return {
                        ...cargo,
                        cantidad: form.cantidad,
                        costo: form.costo,
                    };
                }
                return cargo;
            } );
            setStorage( `${ idLinea } - cargos`, cargosActualizados );
            setCargos( cargosActualizados );
        } else {
            setStorage( `${ idLinea } - cargos`, [ ...cargos, form ] );
            setCargos( [ ...cargos, form ] );
        }
    };
    const editarCargo = ( )=>{
        const cargosActualizados = cargos.map( ( cargo )=>{
            if ( cargo.id === form.id ) {
                return form;
            }
            return cargo;
        } );
        const ids = cargosActualizados.map( ( cargo )=>JSON.parse( cargo.cargo )._id );
        const cargosFiltrados = cargosActualizados.filter( ( cargo, index )=>{
            return ids.indexOf( JSON.parse( cargo.cargo )._id ) === index;
        } );
        setStorage( `${ idLinea } - cargos`, cargosFiltrados );
        setCargos( cargosFiltrados );
    };
    return <>
        <Row>
            <Col md={ 11 } xl={ 9 } >
                <h2>2.1 - Configurar Cargos</h2>
                <Form className="recuadro-info-formulario" onSubmit={ e => e.preventDefault() }>
                    <Row>
                        <Col md={ 3 } >
                            <FormGroup>
                                <select className="form-control input-hcm-formulario " name="cargo" id={ "posicion" } value={ form.cargo } onBlur={ ()=>{ } } onChange={ handleChange } >
                                    <option value=""></option>
                                    { listaCargos.map( ( cargo )=>{
                                        return <option key={ cargo._id } value={ JSON.stringify( { ...cargo } ) }>{ cargo.nombre }</option>;
                                    } ) }
                                </select>
                            </FormGroup>
                        </Col>
                        <Col md={ 3 } >
                            <FormGroup>
                                <input value={ form.cantidad } onChange={ handleChange } name="cantidad" type="number" className="input-hcm-formulario" placeholder="Cantidad" />
                            </FormGroup>
                        </Col>
                        <Col md={ 3 } >
                            <FormGroup>
                                <input value={ form.costo } onChange={ handleChange } name="costo" type="number" className="input-hcm-formulario" placeholder="Costo Mensual" />
                            </FormGroup>
                        </Col>
                        <Col md={ 3 } >
                            <button disabled={ errors } hidden={ editar } onClick={ ()=>{
                                crearCargo();
                                resetForm();
                            } } type="button" className=" btn btn-feelrouk-naranja2">Agregar</button>
                            <button type="button" disabled={ errors } hidden={ ! editar } onClick={ ()=>{
                                editarCargo();
                                setEditar( false );
                                resetForm();
                            } } className=" btn btn-feelrouk-naranja2">Guardar</button>
                            <button type="button" hidden={ ! editar } onClick={ ()=>{
                                resetForm();
                                setEditar( false );
                            } } className=" btn btn-secondary ">Descartar</button>
                        </Col>
                    </Row>
                </Form>
                <div hidden={ ! errors || ! ( form.cargo || form.cantidad || form.costo ) } className=" alert alert-danger ">
                    { errors }
                </div>
            </Col>
        </Row>
        <Row>
            <Col hidden={ ! cargos.length } sm={ 8 } md={ 6 } >
                <h2 className="txt-orange">Cargos Precargados</h2>
                <Tabla moneda={ moneda } setShow={ setShow } className="mt-2" id={ form.id } cargos={ cargos } setForm={ setForm } setEditar={ setEditar } eliminar={ eliminar } ></Tabla>
            </Col>
        </Row>
        <Modal size={ "xl" } show={ show.modal } onHide={ ()=>{
            setShow( {
                modal: false,
                cargo: {},
            } );
        } }>
            <Modal.Header>
                <HeaderHabilitacionMOD filters={ filters } setFilters={ setFilters } />
            </Modal.Header>
            <Modal.Body>
                <BodyHabilitacion filters={ filters } cargo={ show.cargo } setHabilitaciones={ setHabilitaciones } />
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={ ()=>{
                    setShow( {
                        modal: false,
                        cargo: {},
                    } );
                } }>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    </>;
};

export default Cargos;
