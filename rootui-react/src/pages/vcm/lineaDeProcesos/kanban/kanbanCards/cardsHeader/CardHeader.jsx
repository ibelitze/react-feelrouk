import React from 'react';

import arrows from '../../../../../../../common-assets/images/vcm/arrows.svg';
import settings from '../../../../../../../common-assets/images/vcm/settings.svg';
import './_style.scss';
export const CardHeader = ( { title, length, checkedColor } ) => {
    const color = ( )=>{
        if ( ! checkedColor ) {
            return "blue";
        }
        if ( length < 2 ) {
            return "red";
        }
        if ( length >= 3 ) {
            return "green";
        }
        if ( length === 2 ) {
            return "yellow";
        }
    };
    return (
        <span className={ `${ color() }` }>
            <button className="header-button"><img className="header-icon" alt="button" src={ arrows } /></button>
            <h4 className="m-0 p-0">{ title }</h4>
            <button className="header-button"><img className="header-icon" alt="button" src={ settings } /></button>
        </span>
    );
};
