import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import Swal from 'sweetalert2';
import { v4 } from 'uuid';
import { getStorage, setStorage } from '../../helpers/manejoStorage';
import { aMinutos } from '../../recursos/capacidadEsperada/detenciones/helpers/convertirMinutosHoras';
import { TiempoProductivo } from '../../recursos/datosBasicos/components/tiempoProductivo/TiempoProductivo';
import Cargos from './cargos/Cargos';
import { DotacionesPrecargadas  } from './dotacionesPrecargadas/DotacionesPrecargadas';
import { MediosPrecargados } from './medios/MediosPrecargados';
import { precargarDotacion, validarDotacion } from './utilities';

const mockDatos={
    nombre: "",
    descripcion: "",
    _id:v4()
}

export const Dotaciones = ( { currentStep, next, prev, moneda } ) => {

    const calcularTiempo = ()=>{
        let totalHoras = 0;
        dotacionesPrecargadas.forEach( dotacion => {
            totalHoras += aMinutos( dotacion.turno.totalHoras );
        } );
        return totalHoras;
    };
    const calcularPorcentaje = ()=>{
        const tiempoEnMinutos = calcularTiempo();
        const tiempoObjetivo = aMinutos( horas );
        return ( tiempoEnMinutos * 100 ) / tiempoObjetivo;
    };
    const { id: idLinea } = useParams();
    const horas = getStorage( `${ idLinea } - datos basicos mod` )?.horas || "0";
    const storageHorarioPersonalizado = `${ idLinea } - personalizado dotacion`;
    const [ selected, setSelected ] = useState( getStorage( `${ idLinea } - horarios dotacion` ) || "" );
    const [ horasSemanales, setHorasMensuales ] = useState( 0 );
    const [datosDotacion, setDatosDotacion] = useState( getStorage(`${idLinea} - datos dotacion`) || global.structuredClone(mockDatos) );
    const [ habilitaciones, setHabilitaciones ] = useState( getStorage( `${ idLinea } - habilitaciones` ) || [ ] );
    const [ cargos, setCargos ] = useState( getStorage( `${ idLinea } - cargos` ) || [] );
    const [ dotacionesPrecargadas, setDotacionesPrecargadas ] = useState( getStorage( `${ idLinea } - dotaciones` ) || [] );
    const [ tipoDotacion, setTipoDotacion ] = useState( getStorage(`${ idLinea } - datos basicos mod`)?.relacion?.tipo || "" );
    const [porcentaje,setPorcentaje]=useState( calcularPorcentaje() );
    useEffect( () => {
        setPorcentaje( calcularPorcentaje() );
    }, [ dotacionesPrecargadas ] );
    useEffect( () => {
        setTipoDotacion( getStorage( `${ idLinea } - datos basicos mod` )?.relacion?.tipo );
        setDotacionesPrecargadas( getStorage( `${ idLinea } - dotaciones` ) || [] );
    }, [ currentStep ] );
    useEffect( () => {
        setStorage( `${ idLinea } - horarios dotacion`, selected );
    }, [ selected ] );
    useEffect( () => {
        setStorage( `${ idLinea } - total horas dotacion`, horasSemanales );
    }, [ horasSemanales ] );
    const handleChange = ( e )=>{
        const newDatos={
            ...datosDotacion,
            [e.target.name]:e.target.value
        }
        setDatosDotacion(newDatos);
        setStorage(`${idLinea} - datos dotacion`, newDatos);
    };
    const resetDotacion = ()=>{
        setSelected( "" );
        setHorasMensuales( 0 );
        setHabilitaciones( [] );
        setDatosDotacion({
            nombre: "",
            descripcion: "",
            _id:v4()
        })
        setCargos( [] );
    };
    const cargarDotacion = ()=>{
        const err = validarDotacion(idLinea);
        if(!err){
            precargarDotacion( idLinea );
            resetDotacion();
            setDotacionesPrecargadas( getStorage( `${ idLinea } - dotaciones` ) );
        }else{
            Swal.fire( "", err, "error" );
        }
    };
    const deleteRecurso=(idCargo,idRecurso)=>{
        let newHabilitaciones;
        if( idRecurso ){
            newHabilitaciones = habilitaciones.filter( habilitacion => habilitacion.recurso._id !== idRecurso || habilitacion.cargo.id !== idCargo );
        }else{
            newHabilitaciones = habilitaciones.filter( habilitacion => habilitacion.cargo.id !== idCargo );
        }
        setHabilitaciones( newHabilitaciones );
        setStorage( `${ idLinea } - habilitaciones`, newHabilitaciones );
    };
    const deleteDotacion=(id)=>{
        let newDotaciones = dotacionesPrecargadas.filter( dotacion => dotacion._id !== id );
        setDotacionesPrecargadas( newDotaciones );
        setStorage( `${ idLinea } - dotaciones`, newDotaciones );
    };
    const editarDotacion = ( dotacion )=>{
        const datosDotacion={
            nombre: dotacion.turno.nombre,
            descripcion: dotacion.turno.descripcion,
            _id: dotacion._id
        }
        setStorage(storageHorarioPersonalizado, dotacion.turno.horarioPersonalizado);
        setSelected( dotacion.turno.tipoHorario );
        setStorage( `${ idLinea } - horarios dotacion`, dotacion.turno.tipoHorario );
        setHabilitaciones( dotacion.recursos );
        setStorage( `${ idLinea } - habilitaciones`, dotacion.recursos );
        setDatosDotacion(datosDotacion)
        setStorage(`${idLinea} - datos dotacion`, datosDotacion);
        setCargos( dotacion.cargos );
        setStorage( `${ idLinea } - cargos`, dotacion.cargos );
    };
    if ( currentStep !== 2 ) {
        return null;
    }
    return (
        <div className="container-dotaciones">
            <h1>2 - Dotación</h1>
            <h2>Agregar Dotación</h2>
            <div className="recuadro-info-formulario">
                <h2 className="txt-orange">Datos de Dotacion</h2>
                <div className='d-flex justify-content-between w-50'>
                    <div>
                        <label htmlFor="nombre-dotacion">Nombre de la dotacion</label>
                        <br />
                        <input className="input-hcm-formulario " name="nombre" value={ datosDotacion.nombre } id="nombre-dotacion" onChange={ handleChange } type="text" />
                    </div>
                    <div>
                        <label htmlFor="descripcion-dotacion">Descripcion de la dotacion</label>
                        <br />
                        <textarea className="input-hcm-formulario " name='descripcion' value={ datosDotacion.descripcion } id="descripcion-dotacion" onChange={ handleChange }/>
                    </div>
                </div>
                <Cargos moneda={moneda} setHabilitaciones={ setHabilitaciones } cargos={ cargos } setCargos={ setCargos } deleteRecurso={ deleteRecurso } />
                <Row>
                    <Col sm={ 10 } md={ 10 } xl={ 6 } >
                        <div hidden={ habilitaciones.length === 0 }>
                            <h2 className="txt-orange mt-25">Medios Precargaos</h2>
                            <MediosPrecargados moneda={moneda} deleteRecurso={ deleteRecurso } habilitaciones={ habilitaciones } />
                        </div>
                    </Col>
                </Row>
                <TiempoProductivo selected={ selected } setSelected={ setSelected } storage={ storageHorarioPersonalizado } horas={ horasSemanales } setHoras={ setHorasMensuales } />
                <div className="d-flex w-100 justify-content-center pl-20 pr-20 align-center">
                    <button type="button" className=" btn-feelrouk-naranja2  btn-blue" onClick={ ()=>{
                        cargarDotacion();
                    } }>Precargar Dotacion</button>
                    <button type="button" className="btn-feelrouk-naranja2  btn-grey" onClick={ ()=>{
                        resetDotacion();
                    }}>
                        Cancelar
                    </button>
                </div>
            </div>
            <div className="recuadro-info-formulario mt-50">
                <DotacionesPrecargadas moneda={ moneda } horas={horas} completado={ porcentaje } editarDotacion={editarDotacion} deleteDotacion={ deleteDotacion } dotaciones={ dotacionesPrecargadas } tipo={ tipoDotacion } />
                <div className="alert" hidden={ porcentaje ===100 }>
                    <p>Para poder continuar debe completar el 100% de la dotación</p>
                </div>
                <div className="d-flex w-100 justify-content-between pl-20 pr-20 mt-20 align-center">
                    <button onClick={ ()=>{
                        prev();
                    } } type="button" className="btn btn-feelrouk-naranja2">Volver</button>
                    <button type="button" disabled={ porcentaje != 100 } onClick={ ()=>{
                        next();
                    } } className=" btn btn-feelrouk-naranja2 ">
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};
