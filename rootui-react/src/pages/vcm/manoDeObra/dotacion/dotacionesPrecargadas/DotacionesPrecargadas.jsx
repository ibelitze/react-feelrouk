import React from 'react';
import { Accordion } from 'react-bootstrap';
import { AcordionDotacion } from './components/AcordionDotacion';
import "./_styles.scss";
export const DotacionesPrecargadas = ( { moneda, horas, completado, dotaciones = [], tipo, deleteDotacion, editarDotacion, hidden = false } ) => {
    return (
        <>
            <div className="mb-20" >
                <h2>Dotaciones Precargadas: { dotaciones.length }</h2>
                <span>Detalles generales:</span>
                <div className="dotaciones-precargadas-resumen">
                    <div hidden={ hidden }>
                        <p className="fw-600">Tiempo medido por: Semana</p>
                        <p className="fw-600">Objetivo Temporal: { horas } Horas</p>
                        <p className={ `fw-600 ${ completado !== 100 ? 'txt-red' : 'txt-green' }` }>Tiempo completado: { completado }%</p>
                    </div>
                    <div>
                        <p className="fw-600">Gastos Personal: {
                            dotaciones.reduce( ( total, dotacion ) => total + dotacion.turno.costoPersonal, 0 )
                        } { moneda }</p>
                        <p className="fw-600">Gastos Insumos: {
                            dotaciones.reduce( ( total, dotacion ) => total + dotacion.turno.costoRecursos, 0 )
                        } { moneda }</p>
                    </div>
                </div>
                <span>Listado de dotaciones por cargar:</span>
            </div>
            <Accordion defaultActiveKey="0">
                {
                    dotaciones.map( ( dotacion, index ) => {
                        return (
                            <Accordion.Item eventKey={ index - 1 } key={ index + "dotacion" }>
                                <Accordion.Header>{ dotacion.turno.nombre } ({ dotacion.cargos.reduce( ( cantidad, c )=>{
                                    return cantidad += ( c.cantidad * 1 );
                                }, 0 ) })  time: { dotacion.turno.totalHoras }Hs</Accordion.Header>
                                <Accordion.Body>
                                    <AcordionDotacion hidden={ hidden } moneda={ moneda } editarDotacion={ editarDotacion } deleteDotacion={ deleteDotacion } dotacion={ dotacion } tipo={ tipo } />
                                </Accordion.Body>
                            </Accordion.Item>
                        );
                    } )
                }
            </Accordion>
        </>
    );
};
