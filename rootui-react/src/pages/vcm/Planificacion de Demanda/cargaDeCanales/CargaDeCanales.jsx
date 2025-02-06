import React from 'react';
import '../_styles.scss';
import process from '../../../../../common-assets/images/vcm/process.svg';
import alert from '../../../../../common-assets/images/vcm/alert-circle.png';
import { AsociarProducto } from '../../lineaDeProcesos/components/AsociarProducto';
import { TablaProductos } from '../../lineaDeProcesos/components/TablaProductos';
import { renderTooltip } from '../../helpers/renderToolTip';

import { OverlayTrigger } from 'react-bootstrap';
export const CargaDeCanales = () => {
    return (
        <div className="container-carga-masiva">
            <h1>
                <img src={ process } alt="icon" />
                Planificación de demanda | Carga Masiva de Canales
            </h1>
            <label htmlFor="nombre" >
                Nombre
            </label>
            <div>
                <input className="input-hcm-formulario" type="text" id="nombre" />
                <OverlayTrigger
                    placement="right"
                    delay={ { show: 250, hide: 400 } }
                    overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                >
                    <img alt={ "informacion" } src={ alert } />
                </OverlayTrigger>
            </div>
            <div className="container-tablas">
                <h4 className="fw-900 mt-25">Proponer productos asociados</h4>
                <AsociarProducto />
                <h4 className="fw-900 mt-25">Productos propuestos</h4>
                <div className="buscador-tabla">
                    <TablaProductos type="agregados" />
                </div>
            </div>
        </div>
    );
};
