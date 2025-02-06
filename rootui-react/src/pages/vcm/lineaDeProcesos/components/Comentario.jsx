import React from 'react';
import { getStorage } from '../../helpers/manejoStorage';
import "./_rangoTolerancia.scss";
export const Comentario = ( { name, date, comment, autor } ) => {
    const sesion = getStorage( 'props' ).info;
    const empleadoID = sesion.cliente.id;
    const ubicacion = autor === empleadoID ? "right" : "left";
    return (
        <div className={ `comment-container color-${ ubicacion }` }>
            <div className={ `comment position-${ ubicacion }` }>
                <h5 className="comment-title">
                    { name }
                    <br />
                    <span>comment at { date }</span>
                </h5>
                <p className="comment-content">
                    { comment }
                </p>
            </div>
        </div>
    );
};
