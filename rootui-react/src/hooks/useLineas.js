import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getAllLinea } from '../service/vcm/linea/lineaDeProcesos';

export const useLineas = ( ) => {
    const [ lineas, setLineas ] = useState( [] );
    useEffect( ()=>{
        updateLineas();
    }, [] );
    const getLineas = async()=>{
        const resp = await getAllLinea( );
        if ( resp?.status === 200 ) {
            setLineas( resp.data.Lineas );
        } else {
            Swal.fire( "", "Error al obtener los datos de las lineas", "error" );
        }
    };
    const updateLineas = ()=>{
        getLineas();
    };
    return [ lineas, updateLineas ];
};
