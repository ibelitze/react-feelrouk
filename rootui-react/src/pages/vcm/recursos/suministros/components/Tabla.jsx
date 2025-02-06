import React from 'react';
import { Subtotal } from './Subtotal';
import borrar from '../../../../../../common-assets/images/vcm/x-circle.svg';
import edit from '../../../../../../common-assets/images/vcm/edit.svg';
const Tabla = ( { suministros = [], setForm, eliminar, setEditar, id, hide = false } ) => {
    return (
        <>
            <h2 hidden={ hide } className="mt-50 mb-35 txt-orange" >Suministros Precargados</h2>
            <div className="table-responsive">
                <table className="table">
                    <thead className="text-center" >
                        <tr>
                            <th>Tipo</th>
                            <th>Suministro</th>
                            <th>Unidad</th>
                            <th>Consumo</th>
                            <th>Costo</th>
                            <th>Moneda</th>
                        </tr>
                    </thead>
                    <tbody className="text-center" >
                        {
                            suministros.map( ( suministro )=>{
                                return ( 
                                    <tr style={ suministro._id === id ? { backgroundColor: "#E0E0E0" } : {} } key={ suministro._id } >
                                        <td>{ JSON.parse( suministro.tipo ).nombre }</td>
                                        <td>{ suministro.suministro }</td>
                                        <td>{ suministro.unidad.codigo }</td>
                                        <td>{ suministro.consumo }</td>
                                        <td>{ suministro.costo }</td>
                                        <td>{ suministro.moneda.codigo }</td>
                                        <td hidden={ hide }>
                                            <button hidden={ suministro._id === id } onClick={ ()=>{ 
                                                setForm( suministro );
                                                setEditar( true );
                                            } } className="btn" >
                                                <img style={ { width: "25px" } } alt="editar" src={ edit } /> 
                                            </button>
                                            <button hidden={ suministro._id === id } onClick={ ()=>{ 
                                                eliminar( suministro );
                                            } } className="btn" >
                                                <img style={ { width: "25px" } } alt="eliminar" src={
                                                    borrar
                                                } />
                                            </button>
                                        </td>
                                    </tr> 
                                );
                            } )
                        }
                    </tbody>
                </table>
            </div>
            <Subtotal suministros={ suministros } />
        </>
    );
};

export default Tabla;
