import React from 'react';
import { aHorasYMinutos, aMinutos } from '../helpers/convertirMinutosHoras';
import edit from '../../../../../../../common-assets/images/vcm/edit.svg';
import borrar from '../../../../../../../common-assets/images/vcm/x-circle.svg';

const Tabla = ( { detenciones = [], setForm, setEditar, id, eliminar, setDetenciones, title = "", hide = false } ) => {
    const styles = { };
    return (
        <>
            <h2 className="txt-orange" hidden={ hide }> { title + " Precargadas" } </h2>
            <div className="table-responsive w-100">
                <table className="table" style={ { width: "540px" } } >

                    <thead className="" >
                        <tr className="">
                            <th className="" >Nombre</th>
                            <th className="" >Tiempo ( hs )</th>
                            <th className="" >Descripcion</th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            detenciones?.map( ( detencion )=>{
                                return (
                                    <tr className="row" style={ detencion._id === id ? { backgroundColor: "#E0E0E0" } : {} } key={ detencion._id } >
                                        <td className="" style={ styles } >{ detencion.nombre }</td>
                                        <td className="" style={ styles } >{ detencion.tiempo }</td>
                                        <td className="" style={ styles } >{ detencion.descripcion }</td>
                                        <td hidden={ hide } className="" >
                                            <button className="btn" href="#" hidden={ detencion._id === id } onClick={ ()=>{
                                                setForm( detencion );
                                                setEditar( true );
                                            } } >
                                                <img style={ { width: "25px" } } alt="editar" src={ edit } />
                                            </button>
                                            <button hidden={ detencion._id === id } onClick={ ()=>{
                                                eliminar( detencion, setDetenciones );
                                            } } className="btn" >
                                                <img style={ { width: "25px" } } alt="eliminar" src={ borrar } />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            } )
                        }
                        <tr className="text-center" >
                            <td className="">Total :</td>
                            <td className="">
                                {
                                    aHorasYMinutos( detenciones?.reduce( ( acum, detencion )=>{
                                        return acum + aMinutos( detencion.tiempo );
                                    }, 0 ) )
                                }
                            </td>
                            <td className=""></td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </>
    );
};

export default Tabla;
