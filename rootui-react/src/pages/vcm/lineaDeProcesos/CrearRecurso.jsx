import React, { useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { renderTooltip } from '../helpers/renderToolTip';
import { CrearActivo } from './CrearActivo/CrearActivo';
import { CrearMOD } from './crearMod/CrearMOD';
import info from '../.././../../common-assets/images/vcm/alert-circle.png';
import process from '../.././../../common-assets/images/vcm/process.svg';
import './_style.scss';
export const CrearRecurso = () => {
    const [ type, setType ] = useState( "activo" );
    const handleChange = ( e ) => {
        setType( e.target.value );
    };
    const renderType = () => {
        if ( type === "activo" ) {
            return <CrearActivo />;
        }
        return <CrearMOD />;
    };
    return (
        <div className="container-crear-recurso">
            <div className="container-title-recurso">
                <img src={ process } alt="proceso" />
                <div>
                    <h1>Línea de Procesos | Agregar Recursos</h1>
                    <p>Estás agregando recursos a la Línea de procesos: MI LINEA DE PROCESOS</p>
                </div>
            </div>
            <div className="container-type-recurso">
                <h2>Seleccione el tipo de recurso</h2>
                <label htmlFor="tipo-recurso">Tipo de recurso</label>
                <div>
                    <select value={ type } onBlur={ ()=>{} } onChange={ handleChange } className="form-select" id="tipo-recurso">
                        <option value="activo">Agregar Activo</option>
                        <option value="mod">Agregar MOD</option>
                    </select>
                    <OverlayTrigger
                        placement="right"
                        delay={ { show: 250, hide: 400 } }
                        overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                    >
                        <img alt="informacion" src={ info } />
                    </OverlayTrigger>
                </div>
            </div>
            <div>
                { renderType() }
            </div>
        </div>
    );
};
