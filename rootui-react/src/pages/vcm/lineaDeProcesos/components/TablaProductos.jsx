import React from 'react';
import borrar from '../../../../../common-assets/images/vcm/x-circle.svg';
import add from '../../../../../common-assets/images/vcm/plus-circle.svg';
export const TablaProductos = ( { type = "", products = [], setProductosPropuestos } ) => {
    const addProduct = ( product ) => {
        setProductosPropuestos( ( prev ) => {
            const index = prev.findIndex( ( p ) => p.sku === product.sku );
            if ( index !== -1 ) {
                return prev;
            }
            return [ ...prev, product ];
        } );
    };
    const deleteProduct = ( product )=>{
        setProductosPropuestos( ( prev )=>{
            return prev.filter( ( p )=>p.sku !== product.sku );
        } );
    };
    return (
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">SKU</th>
                    <th scope="col">Descripcion</th>
                </tr>
            </thead>
            <tbody>
                {
                    products.map( ( product ) => {
                        return ( <tr key={ product._id }>
                            <td>{ product.nombre }</td>
                            <td>{ product.sku }</td>
                            <td>{ product.descripcion }</td>
                            <td>
                                <button hidden={ type === "busqueda" } onClick={
                                    () => deleteProduct( product )
                                } className="btn" >
                                    <img style={ { width: "25px" } } alt="eliminar" src={ borrar } />
                                </button>
                                <button hidden={ type === "agregados" } onClick={ ()=>{
                                    addProduct( product );
                                } }className="btn" >
                                    <img style={ { width: "25px" } } alt="eliminar" src={ add } />
                                </button>
                            </td>
                        </tr> );
                    } )
                }
            </tbody>
        </table>
    );
};
