import React, { useState } from 'react';
import { TablaProductos } from './TablaProductos';
import search from '../../../../../common-assets/images/vcm/zoom-in.svg';
import { productSearch } from '../../../../service/vcm/micelaneos/micelaneos';
import Swal from 'sweetalert2';
export const AsociarProducto = ( { setProductosPropuestos } ) => {
    const [ payload, setPayload ] = useState( "" );
    const [ products, setProducts ] = useState( [ ] );
    const searchProduct = async() => {
        const res = await productSearch( payload );
        console.log( res );
        if ( res?.status !== 200 ) {
            Swal.fire( "", "Ocurrio un error al buscar los productos", "error" );
            setProducts( [] );
            return;
        }
        setProducts( res.data.data );
    };
    return (
        <>
            <h2 className="fw-400">Buscador de productos </h2>
            <div className="productos-asociados-search">
                <input value={ payload } onChange={
                    ( e ) => setPayload( e.target.value )
                } type="text" className="productos-asociados-search__input" />
                <button className="btn" onClick={ searchProduct } ><img className="header-icon" alt="button" src={ search } /></button>
            </div>
            <h4 className="fw-900 mt-25">Resultados</h4>
            <div className="buscador-tabla">
                <TablaProductos products={ products } type="busqueda" setProductosPropuestos={ setProductosPropuestos } />
                { /* <div>
                    <button className="btn btn-orange" >Agregar</button>
                </div> */ }
            </div>
        </>
    );
};
