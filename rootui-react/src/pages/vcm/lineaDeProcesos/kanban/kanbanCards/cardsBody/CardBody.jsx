import React from 'react';
import "./_style.scss";

export const CardBody = ( { description } ) => {
    return (
        <div className="kanban-card-body">
            <small>Dependencia: { description.dependencias }</small>
            <p className="kanban-card-body__description">
                <b>Detenciones Totales:</b> { description.detenciones } hs<br />
                <b>Costo Suministros:</b> { description.costo + " " + description.moneda }<br />
                <b>Capacidad Nominal:</b> { description.nominal }<br />
                <b>Capacidad Esperada:</b> { description.esperada }
            </p>
            <div className="kanban-card-body__type text-white">{ description.tipo }</div>
        </div>
    );
};
