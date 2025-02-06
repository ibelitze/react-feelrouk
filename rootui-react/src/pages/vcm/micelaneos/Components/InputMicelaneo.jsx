import React from 'react';
import { renderTooltip } from '../../helpers/renderToolTip';
import { OverlayTrigger } from 'react-bootstrap';
import alert from '../../../../../common-assets/images/vcm/alert-circle.png';

export const InputMicelaneo = ( { name = "", value, forLabel, onChange } ) => {
    const capitalize = ( string )=>{
        const splited = string.split( "" );
        splited[ 0 ] = splited[ 0 ].toUpperCase();
        return splited.join( "" );
    };
    return (
        <label className="carga-productos-label" htmlFor={ forLabel + name }>
            { capitalize( name ) }
            <div>
                <input className="form-control" value={ value } id={ forLabel + name } name={ name } onChange={ onChange } type="text" />
                <OverlayTrigger
                    placement="right"
                    delay={ { show: 250, hide: 400 } }
                    overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                >
                    <img alt={ "informacion" } src={ alert } />
                </OverlayTrigger>
            </div>
        </label>
    );
};
