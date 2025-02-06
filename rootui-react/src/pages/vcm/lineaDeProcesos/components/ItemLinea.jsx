import React from 'react';

export const ItemLinea = ( { event, author, date } ) => {
    return (
        <div className="container-item-linea">
            <span className="circle"></span>
            <div>
                <h4 className="fw-900 m-0">{ event }</h4>
                <span>Ejecutado por: { author }</span>
                <br />
                <span>Fecha: { date }</span>
            </div>
        </div>
    );
};
