import React, { useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import alert from '../../../../../common-assets/images/vcm/alert-circle.png';
import { renderTooltip } from '../../helpers/renderToolTip';
export const CargaMasiva = ( { type } ) => {
    const [ file, setFile ] = useState( "" );
    const handleChange = ( { target } )=>{
        const archivo = target.value.split( "\\" );
        setFile( archivo[ archivo.length - 1 ] );
    };
    return (
        <form>
            <div>
                <h2>
                    Seleccione la clase
                </h2>
                <label className="carga-masiva-label" htmlFor={ `clase ${ type }` }>
                    Clase
                    <div>
                        <select id={ `clase ${ type }` } className="form-select input-hcm-formulario">
                            <option selected>Open this select menu</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>  
                        </select>
                        <OverlayTrigger
                            placement="right"
                            delay={ { show: 250, hide: 400 } }
                            overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                        >
                            <img alt={ "informacion" } src={ alert } />
                        </OverlayTrigger>
                    </div>
                </label>
            </div>
            <div>
                <label className="carga-masiva-label" htmlFor={ `preview ${ type }` } >
                    Subir archivo
                    <div>
                        <input value={ file } className="input-hcm-formulario" type="text" id={ `preview ${ type }` } />
                        <input hidden type="file" name="" id={ `file ${ type }` } onChange={ handleChange } />
                        <label className="btn btn-orange ml-10" htmlFor={ `file ${ type }` }>
                            Agregar
                        </label>
                        <OverlayTrigger
                            placement="right"
                            delay={ { show: 250, hide: 400 } }
                            overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                        >
                            <img alt={ "informacion" } src={ alert } />
                        </OverlayTrigger>
                    </div>
                </label>
            </div>
            <div className="d-flex w-25 justify-content-end">
                <button type="button" className="btn-blue btn mt-50" >
                    Enviar
                </button>
            </div>
        </form>
    );
};
