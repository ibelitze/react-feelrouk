import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getByEmpresa } from '../service/vcm/micelaneos/micelaneos';

export const useMicelaneos = ( ) => {
    const [ monedas, setMonedas ] = useState( [] );
    const [ localizaciones, setLocalizaciones ] = useState( [] );
    const [ unidades, setUnidades ] = useState( [] );
    const [ suministros, setSuministros ] = useState( [] );
    useEffect( ()=>{
        getMonedas();
        getLocalizaciones();
        getUnidades();
        getSiministrosTipo();
    }, [] );
    const getMonedas = async()=>{
        const resp = await getByEmpresa( "monedas" );
        if ( resp?.status === 200 ) {
            setMonedas( resp.data.Monedas );
        } else {
            Swal.fire( "", "Error al obtener las monedas", "error" );
        }
    };
    const getLocalizaciones = async()=>{
        const resp = await getByEmpresa( "localizaciones" );
        if ( resp?.status === 200 ) {
            setLocalizaciones( resp.data.Localizaciones );
        } else {
            Swal.fire( "", "Error al obtener las localizaciones", "error" );
        }
    };
    const getUnidades = async()=>{
        const resp = await getByEmpresa( "unidades" );
        if ( resp?.status === 200 ) {
            setUnidades( resp.data.Medidas );
        } else {
            Swal.fire( "", "Error al obtener las unidades", "error" );
        }
    };
    const getSiministrosTipo = async()=>{
        const resp = await getByEmpresa( "suministros" );
        if ( resp?.status === 200 ) {
            setSuministros( resp.data.Suministros );
        } else {
            Swal.fire( "", "Error al obtener los suministros", "error" );
        }
    };
    return {
        monedas,
        localizaciones,
        unidades,
        suministros,
    };
};
