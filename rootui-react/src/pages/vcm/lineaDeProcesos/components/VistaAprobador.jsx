import React from 'react';

export const VistaAprobador = () => {
    return (
        <div className="new-comment">
            <div>
                <button className="btn btn-red text-white">Rechazar</button>
                <button className="btn btn-yellow text-white">Por Revisar</button>
                <button className="btn btn-green text-white">Aprobar</button>
            </div>
            <textarea name="" id="" cols="30" rows="10"></textarea>
            <button className="btn btn-blue" >Enviar</button>
        </div>
    );
};
