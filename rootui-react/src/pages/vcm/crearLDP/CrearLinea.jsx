import React, { useState, useEffect } from 'react';
import { v4 } from 'uuid';
import { Form, FormGroup, Label, Row } from 'reactstrap';
import { OverlayTrigger } from 'react-bootstrap';
import { useForm } from '../../../hooks/useForm';
import { renderTooltip } from '../helpers/renderToolTip';
import { getStorage, setStorage } from '../helpers/manejoStorage';
import { TiempoProductivo } from '../recursos/datosBasicos/components/tiempoProductivo/TiempoProductivo';
import process from '../../../../common-assets/images/vcm/process.svg';
import info from '../../../../common-assets/images/vcm/alert-circle.png';
import agregar from '../../../../common-assets/images/vcm/plus-circle.svg';
// import editar from '../../../../common-assets/images/vcm/edit.svg';
import eliminar from '../../../../common-assets/images/vcm/x-circle.svg';
import './_styles.scss';
import { createLinea } from '../../../service/vcm/linea/lineaDeProcesos';
import { useMicelaneos } from '../../../hooks/useMicelaneos';
import Swal from 'sweetalert2';
import { validarFormCrearLinea } from './utilities';

const initialForm = {
    _id: v4(),
    nombre: "",
    rel_localizacion: "",
    jerarquia_min: "",
    jerarquia_max: "",
    pasos: [],
    total_horas: "",
    descripcion: "",
    rel_moneda: "",
    rel_unidades: "",
    tipo_horario: "",
    horario_personalizado: {},
};

export const CrearLinea = () => {
    const storageHorarioPersonalizado = "creacion ldp";
    const [ selected, setSelected ] = useState( getStorage( "horarios creacion ldp" ) || "" );
    const [ horasMensuales, setHorasMensuales ] = useState( "" );
    const [ nuevoPaso, setNuevoPaso ] = useState( "" );
    const [ errors, setErrors ] = useState( "" );
    const { monedas, localizaciones, unidades } = useMicelaneos( );
    const [ form, handleChange, , setForm ] = useForm( getStorage( "datos" ) || { ...initialForm } );
    useEffect( () => {
        if ( selected !== "personalizado" ) {
            setForm( {
                ...form,
                total_horas: horasMensuales,
                horario_personalizado: {},
            } );
        } else {
            setForm( {
                ...form,
                total_horas: horasMensuales,
                horario_personalizado: getStorage( "creacion ldp" ),
            } );
        }
    }, [ horasMensuales ] );
    useEffect( () => {
        setStorage( "horarios creacion ldp", selected );
        setForm( {
            ...form,
            tipo_horario: selected,
        } );
    }, [ selected ] );
    const handleAdd = ()=>{
        const { pasos, _id } = form;
        const paso = {
            posicion: form.pasos.length + 1,
            nombre: nuevoPaso,
            rel_linea: _id,
        };
        if ( nuevoPaso.length < 3 ) {
            setErrors( "el nuevo paso debe contener al menos 3 caracteres" );
            return;
        }
        pasos.push( paso );
        setNuevoPaso( "" );
        setForm( { ...form, pasos } );
    };
    const handleEliminar = ( paso )=>{
        const filtrado = form.pasos.filter( p => p.nombre !== paso );
        setForm( { ...form, pasos: filtrado } );
    };
    const handleSubmit = async()=>{
        const { pasos, ...linea } = form;
        const res = await createLinea( linea, pasos );
        console.log( res );
        if ( res.status === 200 ) {
            setForm( { ...initialForm, pasos: [], horario_personalizado: {}, _id: v4() } );
            setSelected( "" );
            setStorage( storageHorarioPersonalizado, {
                lunes: {
                    inicio: "00:00",
                    fin: "00:00",
                },
                martes: {
                    inicio: "00:00",
                    fin: "00:00",
                },
                miercoles: {
                    inicio: "00:00",
                    fin: "00:00",
                },
                jueves: {
                    inicio: "00:00",
                    fin: "00:00",
                },
                viernes: {
                    inicio: "00:00",
                    fin: "00:00",
                },
                sabado: {
                    inicio: "00:00",
                    fin: "00:00",
                },
                domingo: {
                    inicio: "00:00",
                    fin: "00:00",
                },
            } );
            Swal.fire( "", "Linea de proceso creada con exito", "success" );
        }
        if ( res.status === 400 ) {
            Swal.fire( "", "Esta linea de proceso ya existe", "error" );
        }
        if ( res.status === 500 ) {
            Swal.fire( "", "Error en el servidor", "error" );
        }
    };
    useEffect( ()=>{
        setErrors( validarFormCrearLinea( form ) );
        setStorage( "datos", form );
    }, [ form ] );
    return <div className="nueva-ldp">
        <h1 className="font-weight-bold">
            <img src={ process } alt="recursos" />
            Línea de Procesos | Crear Nueva
        </h1>
        <h2 className="font-weight-bold"> Carga la información inicial de la línea de procesos</h2>
        <Form onSubmit={ e => e.preventDefault() }>
            <Row>
                <div className="col-md-4 cols">
                    <h4 className="font-weight-bold d-flex align-items-center" >
                        Ubicación
                        <OverlayTrigger
                            placement="right"
                            delay={ { show: 250, hide: 400 } }
                            overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                        >
                            <img alt="informacion" src={ info } />
                        </OverlayTrigger>
                    </h4>
                    <FormGroup>
                        <Label for="nombre">
                            Nombre
                        </Label>
                        <div className="d-flex align-items-center">
                            <input
                                id="nombre"
                                className="input-hcm-formulario form-control"
                                name="nombre"
                                value={ form.nombre } onChange={ handleChange }
                                placeholder=""
                                type="text"
                            />
                            <OverlayTrigger
                                placement="right"
                                delay={ { show: 250, hide: 400 } }
                                overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                            >
                                <img alt="informacion" src={ info } />
                            </OverlayTrigger>
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label for="rel_localizacion">
                            Localización
                        </Label>
                        <div className="d-flex align-items-center">
                            { /* <input
                                id="rel_localizacion"
                                className="input-hcm-formulario form-control"
                                name="rel_localizacion"
                                value={ form.rel_localizacion } onChange={ handleChange }
                                placeholder=""
                                type="text"
                            /> */ }
                            <select value={ form.rel_localizacion } onChange={ handleChange } name="rel_localizacion" className="input-hcm-formulario form-control" id="rel_localizacion">
                                <option value="">Seleccione una opción</option>
                                {
                                    localizaciones.map( ( l )=>{
                                        return <option key={ l._id } value={ l._id }> { l.nombre } </option>;
                                    } )
                                }
                            </select>
                            <OverlayTrigger
                                placement="right"
                                delay={ { show: 250, hide: 400 } }
                                overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                            >
                                <img alt="informacion" src={ info } />
                            </OverlayTrigger>
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label for="rel_moneda">
                            Moneda
                        </Label>
                        <div className="d-flex align-items-center">
                            { /* <input
                                id="rel_moneda"
                                className="input-hcm-formulario form-control"
                                name="rel_moneda"
                                value={ form.rel_moneda } onChange={ handleChange }
                                placeholder=""
                                type="text"
                            /> */ }
                            <select value={ form.rel_moneda } onChange={ handleChange } name="rel_moneda" className="input-hcm-formulario form-control" id="rel_moneda">
                                <option value="">Seleccione una opción</option>
                                {
                                    monedas.map( ( m )=>{
                                        return <option key={ m._id } value={ m._id }> { m.nombre } </option>;
                                    } )
                                }
                            </select>
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label for="rel_unidades">
                            Unidad de Medida
                        </Label>
                        <div className="d-flex align-items-center">
                            { /* <input
                                id="rel_unidades"
                                className="input-hcm-formulario form-control"
                                name="rel_unidades"
                                value={ form.rel_unidades } onChange={ handleChange }
                                placeholder=""
                                type="text"
                            /> */ }
                            <select value={ form.rel_unidades } onChange={ handleChange } name="rel_unidades" className="input-hcm-formulario form-control" id="rel_unidades">
                                <option value="">Seleccione una opción</option>
                                {
                                    unidades.map( ( m )=>{
                                        return <option key={ m._id } value={ m._id }> { m.nombre } </option>;
                                    } )
                                }
                            </select>
                        </div>
                    </FormGroup>
                    <h4 className="font-weight-bold d-flex align-items-center" >
                        Jerarquía
                        <OverlayTrigger
                            placement="right"
                            delay={ { show: 250, hide: 400 } }
                            overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                        >
                            <img alt="informacion" src={ info } />
                        </OverlayTrigger>
                    </h4>
                    <div className="d-flex justify-content-btween" >
                        <FormGroup className="pr-5">
                            <Label for="jerarquia_min">
                                Min
                            </Label>
                            <input
                                id="jerarquia_min"
                                className="input-hcm-formulario form-control"
                                name="jerarquia_min"
                                value={ form.jerarquia_min } onChange={ handleChange }
                                placeholder=""
                                type="number"
                            />
                        </FormGroup>
                        <FormGroup className="pl-5">
                            <Label for="jerarquia_max">
                                Max
                            </Label>
                            <input
                                id="jerarquia_max"
                                className="input-hcm-formulario form-control"
                                name="jerarquia_max"
                                value={ form.jerarquia_max } onChange={ handleChange }
                                placeholder=""
                                type="number"
                            />
                        </FormGroup>
                    </div>
                    <FormGroup>
                        <h4>Descripcion</h4>
                        <div className="d-flex align-items-start">
                            <textarea name="descripcion" onChange={ handleChange } value={ form.descripcion } id="" cols="40" rows="2"></textarea>
                            <OverlayTrigger
                                placement="right"
                                delay={ { show: 250, hide: 400 } }
                                overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                            >
                                <img alt="informacion" src={ info } />
                            </OverlayTrigger>
                        </div>
                    </FormGroup>
                </div>
                <div className="col-md-4 col-xl-3 cols">
                    <h4 className="font-weight-bold d-flex align-items-center">
                        Secuencia
                        <OverlayTrigger
                            placement="right"
                            delay={ { show: 250, hide: 400 } }
                            overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                        >
                            <img alt="informacion" src={ info } />
                        </OverlayTrigger>
                    </h4>
                    <FormGroup>
                        <Label for="pasos">
                            Agregar Pasos
                        </Label>
                        <div className="agregar-pasos">
                            <input
                                id="pasos"
                                className="input-hcm-formulario form-control"
                                name="pasos"
                                value={ nuevoPaso }
                                onChange={ ( { target: { value } } )=>{
                                    setNuevoPaso( value );
                                } }
                                placeholder=""
                                type="text"
                            />
                            <button className="btn" type="button" onClick={ handleAdd } >
                                <img src={ agregar } alt="agregar" />
                            </button>
                        </div>
                    </FormGroup>
                    <h4>Pasos Precargados</h4>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Paso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                form.pasos.map( ( p )=>{
                                    return <tr key={ p.nombre }>
                                        <td className="pasos-tabla" >
                                            <span>
                                                { p.nombre }
                                            </span>
                                            <div>
                                                { /* <button type="button" className="btn" onClick={ ()=>{
                                                } } >
                                                    <img src={ editar } alt="eliminar" />
                                                </button> */ }
                                                <button type="button" className="btn" onClick={ ()=>{
                                                    handleEliminar( p.nombre );
                                                } } >
                                                    <img src={ eliminar } alt="eliminar" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>;
                                } )
                            }
                        </tbody>
                    </table>
                </div>
                <div className="col-md-4 col-xl-5 cols">
                    <TiempoProductivo horas={ horasMensuales } setHoras={ setHorasMensuales } selected={ selected } setSelected={ setSelected } storage={ storageHorarioPersonalizado } />
                </div>
            </Row>

            <div hidden={ ! errors || ! ( form.nombre || form.localizacion || form.max || form.min || form.pasos.length || form.descripcion ) } className=" alert alert-danger ">
                { errors }
            </div>
            <div className="p-20 d-flex w-100 justify-content-end ">
                <button onClick={ handleSubmit } disabled={ errors } type="button" className=" btn btn-feelrouk-naranja2 float-right ">
                    Continuar
                </button>
            </div>
        </Form>
    </div>;
};
