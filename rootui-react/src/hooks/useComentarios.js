
import { useState, useEffect } from 'react';
import { getAutor, getComentarios } from '../service/vcm/linea/comentarios';
export const useComentarios = ( id ) => {
    const [ comentarios, setComentarios ] = useState( [] );
    useEffect( () => {
        updateComentarios();
    }, [] );
    const obtenerComentarios = async() => {
        const res = await getComentarios( id );
        if ( res?.status === 200 ) {
            const ids = obtenerIDs( res.data.comentarios );
            const nombres = await obtenerNombres( ids );
            const comentariosFormateados = formatearComentarios( res.data.comentarios, nombres );
            setComentarios( comentariosFormateados );
        }
    };
    const updateComentarios = () => {
        obtenerComentarios();
    };
    const obtenerIDs = ( data ) => {
        const ids = data.map( ( comentario ) => {
            return comentario.rel_empleado;
        } );
        const idsUnicos = ids.filter( ( ( comentario, index )=>{
            return ids.indexOf( comentario ) === index;
        } ) );
        return idsUnicos;
    };
    const obtenerNombres = async( ids ) => {
        const nombres = [];
        for ( let i = 0; i < ids.length; i++ ) {
            const res = await getAutor( ids[ i ] );
            if ( res?.status === 200 ) {
                nombres.push( [
                    ids[ i ],
                    res.data.data.cliente.nombre,
                ] );
            }
        }
        return Object.fromEntries( nombres );
    };
    const formatearComentarios = ( data, nombres ) => {
        return data.map( ( comentario ) => {
            return {
                id: comentario._id,
                autor: comentario.rel_empleado,
                name: nombres[ comentario.rel_empleado ],
                date: new Date( comentario.fecha ).toLocaleString(),
                comment: comentario.contenido,
            }; 
        } );
    };
    return {
        comentarios,
        updateComentarios,
    };
};
