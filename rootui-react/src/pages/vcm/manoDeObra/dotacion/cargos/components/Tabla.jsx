import React from 'react';
import borrar from '../../../../../../../common-assets/images/vcm/x-circle-blue.svg';
import edit from '../../../../../../../common-assets/images/vcm/edit.svg';
const Tabla = ( { moneda, cargos = [], setForm, setEditar, id, eliminar, setShow, hidden = false } ) => {
    return (
        <>
            <table className="table">
                <thead>
                    <tr className="text-center">
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Costo Mensual</th>
                        <th hidden={ hidden }></th>
                    </tr>
                </thead>
                <tbody className="text-center" >
                    {
                        cargos.map( ( cargo )=>{
                            return (
                                <tr style={ cargo.id === id ? { backgroundColor: "#E0E0E0" } : {} } key={ cargo.id } >
                                    <td >{ cargo.cargo && JSON.parse( cargo.cargo ).nombre }</td>
                                    <td >{ cargo.cantidad }</td>
                                    <td >{ cargo.costo } { moneda }</td>
                                    <td hidden={ hidden } >
                                        <button hidden={ cargo.id === id } onClick={ ()=>{
                                            setShow( {
                                                modal: true,
                                                cargo: cargo,
                                            } );
                                        } } className="btn btn-feelrouk-naranja2 btn-blue" >Recursos</button>
                                        <button hidden={ cargo.id === id } onClick={ ()=>{
                                            setForm( cargo );
                                            setEditar( true );
                                        } } className="btn p-0" >
                                            <img style={ { width: "25px" } } alt="editar" src={ edit } />
                                        </button>
                                        <button hidden={ cargo.id === id } onClick={ ()=>{
                                            eliminar( cargo.id );
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
                                cargos.reduce( ( acum, cargo ) => {
                                    return acum + ( cargo.cantidad * 1 );
                                }, 0 )
                            }
                        </td>
                        <td >
                            {
                                cargos.reduce( ( acum, cargo ) => {
                                    return acum + ( cargo.costo * 1 );
                                }, 0 )
                            } { moneda }
                        </td>
                    </tr>
                </tbody>
            </table>

        </>
    );
};

export default Tabla;
