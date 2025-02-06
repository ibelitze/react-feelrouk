
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getAutor } from '../service/vcm/linea/comentarios';
import { getLogsByLinea } from '../service/vcm/linea/lineaDeProcesos';
export const useLogs = ( id ) => {
    const [ logs, setLogs ] = useState( [] );
    useEffect( () => {
        updateLogs();
    }, [] );
    const getLogs = async() => {
        const res = await getLogsByLinea( id );
        if ( res?.status === 200 ) {
            const ids = obtenerIDs( res.data.logs );
            const nombres = await obtenerNombres( ids );
            const logsFormateados = formatearLogs( res.data.logs, nombres );
            setLogs( logsFormateados );
        } else {
            Swal.fire( "", "No se pudieron obtener los Logs de la linea", "error" );
        }
    };
    const updateLogs = () => {
        getLogs();
    };
    const obtenerIDs = ( data ) => {
        const ids = data.map( ( log ) => {
            return log.rel_autor;
        } );
        const idsUnicos = ids.filter( ( ( log, index )=>{
            return ids.indexOf( log ) === index;
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
    const formatearLogs = ( data, nombres ) => {
        return data.map( ( log ) => {
            return {
                id: log._id,
                author: nombres[ log.rel_autor ],
                date: new Date( log.fecha ).toLocaleString(),
                event: log.accion,
            }; 
        } );
    };
    return {
        logs,
        updateLogs,
    };
};
