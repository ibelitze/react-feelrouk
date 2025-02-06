import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getLineaData } from '../service/vcm/linea/lineaDeProcesos';

export const useLineaData = ( id ) => {
    const [ linea, setLinea ] = useState( [] );
    useEffect( ()=>{
        updateLineas();
    }, [] );
    const getLineas = async()=>{
        const resp = await getLineaData( id );
        if ( resp?.status === 200 ) {
            setLinea( resp.data.Lineas[ 0 ] );
        } else {
            Swal.fire( "", "Error al obtener los datos de la linea", "error" );
        }
    };
    const updateLineas = ()=>{
        getLineas();
    };
    return [ linea, updateLineas ];
};
