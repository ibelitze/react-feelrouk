import React from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { renderTooltip } from '../../../../helpers/renderToolTip';
import { TablaHorarios } from '../../../../recursos/datosBasicos/components/horarioPerzonalizado/TablaHorarios';
import Tabla from '../../cargos/components/Tabla';
import { MediosPrecargados } from '../../medios/MediosPrecargados';

export const AcordionDotacion = ( { moneda, dotacion, tipo, deleteDotacion, editarDotacion, hidden = false } ) => {
    return (
        <div>
            <div className="container-title-acordion">
                <h3>
                    { dotacion.turno.nombre }
                </h3>

                <div hidden={ hidden }>
                    <buttton className="btn btn-blue" onClick={ ()=>{
                        editarDotacion( dotacion );
                    } }>Editar</buttton>
                    <buttton className="btn btn-orange" onClick={ ()=>{
                        deleteDotacion( dotacion._id );
                    } }>Eliminar</buttton>
                </div>
            </div>
            <div className="dotaciones-precargadas-resumen">
                <div>
                    <p>Tipo: { tipo }</p>
                    <p>Cantidad: { dotacion.cargos.reduce( ( cantidad, c )=>{
                        return cantidad += ( c.cantidad * 1 );
                    }, 0 ) }</p>
                    <p>Total Personal: { dotacion.turno.costoPersonal } { moneda }</p>
                    <p>Total Equipos: { dotacion.turno.costoRecursos } { moneda }</p>
                    <p>General: { dotacion.turno.costoPersonal + dotacion.turno.costoRecursos } { moneda }</p>
                    <p>Total Horas: { dotacion.turno.totalHoras }</p>
                </div>
                <div>
                    <h4>Descripcion</h4>
                    <p>
                        { dotacion.turno.descripcion }
                    </p>
                </div>
            </div>
            <div>
                <h2 className="txt-orange">Cargos</h2>
                <div className="col-md-6">
                    <Tabla moneda={ moneda } cargos={ dotacion.cargos } hidden={ true } />
                </div>
            </div>
            <div hidden={ dotacion.recursos.length < 1 }>
                <h2 className="txt-orange">Medios Precargados</h2>
                <div className="col-md-6" >
                    <MediosPrecargados moneda={ moneda } habilitaciones={ dotacion.recursos } hidden={ true } />
                </div>
            </div>
            <div>
                <h3 className="mt-20">
                    Tiempo Productivo
                    <OverlayTrigger
                        placement="right"
                        delay={ { show: 250, hide: 400 } }
                        overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                    >
                        <img alt="informacion" src="https://img.icons8.com/material-outlined/24/000000/info--v1.png" />
                    </OverlayTrigger>
                    <div className="col-md-6">
                        <TablaHorarios horarios={ dotacion.turno.horarioPersonalizado } />
                    </div>
                </h3>
            </div>
        </div>
    );
};
