import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createMod } from '../../../../service/vcm/linea/mod/mod';
import { getStorage } from '../../helpers/manejoStorage';
import { DotacionesPrecargadas } from '../dotacion/dotacionesPrecargadas/DotacionesPrecargadas';
import './_styles.scss';
export const Revision = ( { currentStep, prev, moneda } ) => {
    const { id: idparam } = useParams();
    const [ datos, setDatos ] = useState( getStorage( `${ idparam } - datos basicos mod` ) );
    const [ dotaciones, setDotaciones ] = useState( getStorage( `${ idparam } - dotaciones` ) );
    const [ eficiencia, setEficiencia ] = useState( getStorage( `${ idparam } - eficiencia` ) );
    const history = useHistory();
    const handleCreateMod = async() => {
        const resp = await createMod( idparam );
        if ( resp?.status === 200 ) {
            Swal.fire( '', 'Se ha creado el MOD correctamente', 'success' );
            history.push( `/vcm/ldp/${ idparam }` );
        }
        if ( resp?.status === 500 ) {
            Swal.fire( '', 'Ha ocurrido un error inesperado', 'error' );
        }
    };
    useEffect( ()=>{
        setDotaciones( getStorage( `${ idparam } - dotaciones` ) );
        setDatos( getStorage( `${ idparam } - datos basicos mod` ) );
        setEficiencia( getStorage( `${ idparam } - eficiencia` ) );
    }, [ currentStep ] );
    if ( currentStep !== 4 ) {
        return null;
    }
    return (
        <div className="container-revision">
            <h2>5 - Revisar MOD</h2>
            <p>
                Nombre: { datos.nombre }
                <br />
                Criticidad: { datos.criticidad }
                <br />
                Rendimiento: { datos.eficiencia }
            </p>
            <h4 className="horario" >Horario semanal</h4>
            <p className="horario" >Total Horas Semanales: { datos.horas }Horas</p>
            <div className="recuadro-info-formulario m-0">
                <DotacionesPrecargadas moneda={ moneda } hidden={ true } dotaciones={ dotaciones } tipo={ datos.relacion.tipo } />
            </div>
            <h3 className="mt-30">Rendimiento</h3>
            <p className="rendimiento">
                Funcionamiento: { eficiencia.funcionamiento }
                <br />
                Ciclo productivo: { eficiencia.ciclo }
                <br />
                Capacidad: { eficiencia.capacidad }
            </p>
            <div className="d-flex w-100 justify-content-between pl-20 pr-20 align-center">
                <button onClick={ ()=>{
                    prev();
                } } type="button" className="btn btn-feelrouk-naranja2">Volver</button>
                <button type="button" disabled={ false } onClick={ ()=>{
                    handleCreateMod();
                } } className=" btn btn-feelrouk-naranja2 ">
                    Continuar
                </button>
            </div>
        </div>
    );
};
