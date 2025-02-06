import React from 'react';
import './_style.scss';
export const TablaHorarios = ( { horarios = [] } ) => {
    return (
        <table className="table mt-20">
            <thead>
                <tr>
                    <th scope="col">Día</th>
                    <th scope="col">Inicio</th>
                    <th scope="col">Fin</th>
                </tr>
            </thead>
            <tbody>
                {
                    Object.entries( horarios ).map( ( [ dia, horario ] )=>{
                        return <tr key={ dia }> 
                            <td>{ dia }</td>
                            <td>{ horario.inicio }</td>
                            <td>{ horario.fin }</td>
                        </tr>;
                    } )
                }
            </tbody>
        </table>
    );
};
