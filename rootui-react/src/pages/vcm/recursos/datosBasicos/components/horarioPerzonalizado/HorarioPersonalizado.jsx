import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { aHorasYMinutos, aMinutos } from '../../../capacidadEsperada/detenciones/helpers/convertirMinutosHoras';
import Swal from 'sweetalert2';
import { getStorage, setStorage } from '../../../../helpers/manejoStorage';
import { TablaHorarios } from './TablaHorarios';
import edit from "../../../../../../../common-assets/images/vcm/edit.svg";
import './_style.scss';
const dias = {
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
};
export const HorarioPersonalizado = ( { storage, setHoras } ) => {
    const [ show, setShow ] = useState( false );
    const [ horarios, setHorarios ] = useState( getStorage( storage ) || global.structuredClone( dias ) );
    useEffect( ()=>{
        setStorage( storage, horarios );
        calcularHoras();
    }, [ horarios ] );
    useEffect( ()=>{
        setHorarios( getStorage( storage ) || global.structuredClone( dias ) );
    }, [ show ] );
    const calcularHoras = ()=>{
        let horas = 0;
        const personalizado = getStorage( storage );
        horas = Object.entries( personalizado ).reduce( ( acum, [ , horario ] )=>{
            return acum + ( aMinutos( horario.fin ) - aMinutos( horario.inicio ) );
        }, 0 );
        horas = aHorasYMinutos( horas );
        setHoras( horas );
    };
    const handleChange = ( { target } )=>{
        const [ dia, objetivo ] = target.name.split( " " );
        if ( objetivo === "inicio" ) {
            if ( aMinutos( horarios[ dia ].fin ) >= aMinutos( target.value ) ) {
                setHorarios( {
                    ...horarios,
                    [ dia ]: {
                        ...horarios[ dia ],
                        [ objetivo ]: target.value,
                    },
                } );
            } else {
                Swal.fire( "La hora de inicio no puede ser mayor a la hora de fin" );
            }
        } else if ( aMinutos( target.value ) >= aMinutos( horarios[ dia ].inicio ) ) {
            setHorarios( {
                ...horarios,
                [ dia ]: {
                    ...horarios[ dia ],
                    [ objetivo ]: target.value,
                },
            } );
        } else {
            Swal.fire( "La hora de inicio no puede ser mayor a la hora de fin" );
        }
    };
    return (
        <div className="horario-personalizado mt-30" >
            <div className="horario-editar">
                <h3 className="fs-15 fw-900">Horario personalizado precargado</h3>
                <button className="btn" onClick={ ()=>{
                    setShow( true );
                } }>
                    <img src={ edit } alt="editar" />
                    Editar
                </button>
            </div>
            <TablaHorarios horarios={ horarios } />
            <Modal show={ show } onHide={ ()=>{
                setShow( false );
            } }>
                <Modal.Body>
                    <div className="horario-modal">
                        <h4 className="title-modal">Horario Personalidasado Semanal</h4>
                        <table className="table mt-20">
                            <thead>
                                <tr>
                                    <th scope="col">Día</th>
                                    <th scope="col">Inicio</th>
                                    <th scope="col">Fin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Object.entries( horarios ).map( ( [ dia, horario ] )=>{
                                        return <tr key={ "editar" + dia }>
                                            <td>{ dia }</td>
                                            <td>
                                                <input className="input-horario" onChange={ handleChange } name={ dia + " inicio" } type="time" value={ horario.inicio } />
                                            </td>
                                            <td>
                                                <input className="input-horario" onChange={ handleChange } name={ dia + " fin" } type="time" value={ horario.fin } />
                                            </td>
                                        </tr>;
                                    } )
                                }
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-organge" onClick={ ()=>{
                        setShow( false );
                    } }>
                        Cerrar
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
