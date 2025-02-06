import React, { useEffect, useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { Col, Form, FormGroup, Label, Row } from 'reactstrap';
import { useForm } from '../../../../hooks/useForm';
import { getStorage, setStorage } from '../../helpers/manejoStorage';
import { renderTooltip } from '../../helpers/renderToolTip';
import { TiempoProductivo } from './components/tiempoProductivo/TiempoProductivo';
import alert from '../../../../../common-assets/images/vcm/alert-circle.png';
import './_styles.scss';
import { isEmpty } from '../../crearLDP/utilities';
import { useParams } from 'react-router-dom';
const initialForm = {
    nombre: "",
    criticidad: 0,
    eficiencia: 0,
    posicion: "",
    horas: "",
};
const validarForm = ( form ) => {
    let errors = "";
    if ( form.nombre.length < 3 ) {
        errors = "El nombre debe tener al menos 3 caracteres";
    }
    if ( ! form.posicion ) {
        errors = "Debe seleccionar una posición";
    }
    if ( form.horas === '0:00' ) {
        errors = "Debe seleccionar un horario";
    }
    return errors;
};
 
export const DatosBasicos = ( { currentStep, next, pasos = [] } ) => {
    const { id: idLinea } = useParams();
    const storageHorarioPersonalizado = `${ idLinea } - personalizado datos basicos`;
    const [ form, handleChange, , setForm ] = useForm( getStorage( `${ idLinea } - datos basicos` ) || { ...initialForm } );
    const [ selected, setSelected ] = useState( getStorage( `${ idLinea } - horarios datos basicos` ) || "" );
    const [ horasMensuales, setHorasMensuales ] = useState( 0 );
    const [ error, setError ] = useState( "" );
    useEffect( ()=>{
        setError( validarForm( form ) );
        setStorage( `${ idLinea } - datos basicos`, form );
    }, [ form ] );
    useEffect( () => {
        setStorage( `${ idLinea } - horarios datos basicos`, selected );
    }, [ selected ] );
    useEffect( () => {
        setForm( {
            ...form,
            horas: horasMensuales,
        } );
    }, [ horasMensuales ] );
    if ( currentStep !== 1 ) {
        return null;
    }
    const styleCriticidad = {
        backgroundImage: `linear-gradient(to right, #EE8643  calc(${ form.criticidad }*1%), #0c0c3dcf 0)`,
    };
    const styleEficiencia = {
        backgroundImage: `linear-gradient(to right, #EE8643  calc(${ form.eficiencia }*1%), #0c0c3dcf 0)`,
    };
    return <div className="container-datos-basicos">
        <h1 className="mt-20">1 - Datos Básicos</h1>
        <div className="container-form"> 
            <Form className="" onSubmit={ e => e.preventDefault() } >
                <FormGroup>
                    <Label for="nombre">
                        Nombre
                    </Label>
                    <Row>
                        <Col>
                            <input
                                id="nombre"
                                className="input-hcm-formulario form-control"
                                name="nombre"
                                value={ form.nombre } onChange={ handleChange }
                                placeholder=""
                                type="text"
                            />
                        </Col>
                        <Col sm={ 1 }>
                            <OverlayTrigger
                                placement="right"
                                delay={ { show: 250, hide: 400 } }
                                overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                            >
                                <img alt="informacion" src={ alert } />
                            </OverlayTrigger>
                        </Col>
                    </Row>
                </FormGroup>
                <FormGroup>
                    <label htmlFor={ "posicion" } >Asignar posición</label>
                    <Row>
                        <Col>
                            <select className="form-control input-hcm-formulario " name="posicion" id={ "posicion" } value={ form.posicion } onBlur={ ()=>{ } } onChange={ handleChange } >
                                <option value=""></option>
                                { pasos.map( ( paso )=>{
                                    return <option key={ paso._id } value={ paso._id }>{ paso.nombre }</option>;
                                } ) }
                            </select>
                        </Col>
                        <Col sm={ 1 }>
                            <OverlayTrigger
                                placement="right"
                                delay={ { show: 250, hide: 400 } }
                                overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                            >
                                <img alt="informacion" src={ alert } />
                            </OverlayTrigger>
                        </Col>
                    </Row>
                </FormGroup>
                <FormGroup>
                    <Label for="criticidad">
                        Criticidad
                    </Label>
                    <p className="porcentaje" > { form.criticidad } % </p>
                    <input
                        id="criticidad"
                        className=" form-range "
                        style={ styleCriticidad }
                        name="criticidad"
                        value={ form.criticidad } onChange={ handleChange }
                        placeholder=""
                        type="range"
                    />
                    <div style={ { display: "flex", width: "100%", justifyContent: "space-between" } }>
                        <span>0</span>
                        <span>100</span>
                    </div>
                </FormGroup>
                <FormGroup>
                    <Label for="eficiencia">
                        Eficiencia
                    </Label>
                    <p className="porcentaje" > { form.eficiencia } % </p>
                    <input
                        id="eficiencia"
                        className=" form-range "
                        style={ styleEficiencia }
                        name="eficiencia"
                        value={ form.eficiencia } onChange={ handleChange }
                        placeholder=""
                        type="range"
                    />
                    <div style={ { display: "flex", width: "100%", justifyContent: "space-between" } }>
                        <span>0</span>
                        <span>100</span>
                    </div>
                </FormGroup>
                <div className="alert" hidden={ isEmpty( form ) || ! error } >
                    { error }
                </div>
            </Form>
            
            <div>
                <TiempoProductivo horas={ horasMensuales } setHoras={ setHorasMensuales } selected={ selected } setSelected={ setSelected } storage={ storageHorarioPersonalizado } />
            </div>
        </div>
        <div className="p-20 d-flex w-100 justify-content-end ">
            <button disabled={ error } type="button" onClick={ ()=>{ 
                next();
            } } className=" btn btn-feelrouk-naranja2 ">
                Continuar
            </button>
        </div>
    </div>;
};
