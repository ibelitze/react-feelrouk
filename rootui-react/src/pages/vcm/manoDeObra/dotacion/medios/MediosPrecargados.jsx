import React from 'react';
import borrar from '../../../../../../common-assets/images/vcm/x-circle-blue.svg';
export const MediosPrecargados = ( { moneda, habilitaciones = [], hidden = false, deleteRecurso } ) => {
    return (
        <>
            <table className="table">
                <thead>
                    <tr className="text-center">
                        <th>Cargo</th>
                        <th>Nombre</th>
                        <th>Modelo</th>
                        <th>Cantidad</th>
                        <th>Costo Mensual</th>
                        <th hidden={ hidden }></th>
                    </tr>
                </thead>
                <tbody className="text-center" >
                    {
                        habilitaciones.map( ( habilitacion )=>{
                            return (
                                <tr key={ habilitacion.recurso._id + JSON.parse( habilitacion.cargo.cargo )._id } >
                                    <td >{ JSON.parse( habilitacion.cargo.cargo ).nombre }</td>
                                    <td >{ habilitacion.recurso.nombre }</td>
                                    <td >{ habilitacion.recurso.modelo }</td>
                                    <td >{ habilitacion.cantidad }</td>
                                    <td >{ habilitacion.recurso.costo } { moneda }</td>
                                    <td hidden={ hidden } >
                                        <button onClick={ ()=>{
                                            deleteRecurso( habilitacion.cargo.id, habilitacion.recurso._id );
                                        } } className="btn p-0" >
                                            <img style={ { width: "25px" } } alt="eliminar" src={ borrar } />
                                        </button>
                                    </td>
                                </tr>
                            );
                        } )
                    }

                    <tr >
                        <td >Totales: </td>
                        <td >
                            {
                                habilitaciones.reduce( ( acum, recurso ) => {
                                    return acum + ( recurso.recurso.costo * 1 );
                                }, 0 )
                            } { moneda }
                        </td>
                    </tr>
                </tbody>
            </table>

        </>
    );
};
