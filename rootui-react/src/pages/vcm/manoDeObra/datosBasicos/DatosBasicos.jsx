import React, { useEffect, useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { Col, Form, FormGroup, Label, Row } from 'reactstrap';
import { useForm } from '../../../../hooks/useForm';
import { getStorage, setStorage } from '../../helpers/manejoStorage';
import { renderTooltip } from '../../helpers/renderToolTip';
import { TiempoProductivo } from '../../recursos/datosBasicos/components/tiempoProductivo/TiempoProductivo';
import { RelacionMOD } from './components/relacionMOD/RelacionMOD';
import '../../recursos/datosBasicos/_styles.scss';
import alert from '../../../../../common-assets/images/vcm/alert-circle.png';
import { getActivosByPaso } from '../../../../service/vcm/linea/activo/activos';
import Swal from 'sweetalert2';
import { validarFormCrearLinea } from './utilities';
import { isEmpty } from '../../crearLDP/utilities';
import { useParams } from 'react-router-dom';
const initialForm = {
    nombre: "",
    criticidad: 0,
    eficiencia: 0,
    posicion: "",
    horas: "",
    relacion: {
        _id: "",
        tipo: "",
    },
};

export const DatosBasicos = ( { currentStep, next, pasos = [] } ) => {
    const { id: idLinea } = useParams();
    const storageHorarioPersonalizado = `${ idLinea } - personalizado datos basicos mod`;
    const [ form, handleChange, , setForm ] = useForm( getStorage( `${ idLinea } - datos basicos mod` ) || initialForm );
    const [ selected, setSelected ] = useState( getStorage( `${ idLinea } - horarios datos basicos mod` ) || "" );
    const [ horasMensuales, setHorasMensuales ] = useState( "00:00" );
    const [ activos, setActivos ] = useState( [] );
    const [ error, setError ] = useState( "" );
    useEffect( ()=>{
        setStorage( `${ idLinea } - datos basicos mod`, form );
        setError( validarFormCrearLinea( form ) );
    }, [ form ] );
    useEffect( () => {
        setStorage( `${ idLinea } - horarios datos basicos mod`, selected );
    }, [ selected ] );
    useEffect( () => {
        if ( form.relacion.tipo === "No relacionada" ) {
            setForm( {
                ...form,
                horas: horasMensuales,
            } );
        }
    }, [ horasMensuales ] );
    useEffect( () => {
        if ( form.posicion ) {
            updateActivos();
        } else {
            setActivos( [] );
            setForm( {
                ...form,
                relacion: {
                    _id: "",
                    tipo: "",
                },
            } );
        }
    }, [ form.posicion ] );
    const updateActivos = async() => {
        const res = await getActivosByPaso( form.posicion );
        if ( res.status === 200 ) {
            setActivos( res.data.activos );
        } else {
            Swal.fire( "", "No se pudieron obtener los activos", "error" );
        }
    };
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
            <Form onSubmit={ e => e.preventDefault() } >
                <FormGroup>
                    <Label for="nombre">
                        Nombre
                    </Label>
                    <Row>
                        <Col xs={ 12 } >
                            <input
                                id="nombre"
                                className="input-hcm-formulario form-control"
                                name="nombre"
                                value={ form.nombre } onChange={ handleChange }
                                placeholder=""
                                type="text"
                            />
                        </Col>
                        <Col xs={ 12 }>
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
                        <Col xs={ 12 }>
                            <select className="form-control input-hcm-formulario " name="posicion" id={ "posicion" } value={ form.posicion } onBlur={ ()=>{ } } onChange={ handleChange } >
                                <option value=""></option>
                                { pasos.map( ( paso )=>{
                                    return <option key={ paso._id } value={ paso._id }>{ paso.nombre }</option>;
                                } ) }
                            </select>
                        </Col>
                        <Col xs={ 12 }>
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
                    <p className="text-center fs-18" > { form.criticidad }% </p>
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
                    <p className="text-center fs-18" > { form.eficiencia }% </p>
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
                
                <div className="alert" hidden={ isEmpty( {
                    nombre: form.nombre,
                    posicion: form.posicion,
                    tipo: form.relacion.tipo,
                } ) || ! error } >
                    { error }
                </div>
            </Form>
            <div className="ml-50 mr-20">
                <RelacionMOD setSelected={ setSelected } form={ form } activos={ activos } setForm={ setForm } />
            </div>
            {
                form.relacion.tipo === "No relacionada" ? <div>
                    <TiempoProductivo horas={ horasMensuales } setHoras={ setHorasMensuales } selected={ selected } setSelected={ setSelected } storage={ storageHorarioPersonalizado } />
                </div> : <div>
                    <h2 className="mt-20">
                        Tiempo Productivo
                    </h2>
                    <p>
                        Total horas : { form.horas }
                    </p>
                </div>
            }
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
