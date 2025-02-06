import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getLineaData } from '../service/vcm/linea/lineaDeProcesos';

export const useDataKanban = ( id ) => {
    const [ data, setData ] = useState( [] );
    useEffect( ()=>{
        updateLineas();
    }, [] );
    const getLinea = async()=>{
        const resp = await getLineaData( id );
        if ( resp?.status === 200 ) {
            const dataConverted = convertData( resp.data.Lineas[ 0 ] );
            setData( dataConverted );
        } else {
            Swal.fire( "", "Error al obtener los datos de la linea", "error" );
        }
    };
    const updateLineas = ()=>{
        getLinea();
    };
    const convertData = ( lineaData )=>{
        const formatedData = lineaData.pasos
            .map( ( paso )=>{
                return {
                    id: paso._id,
                    posicion: paso.posicion,
                    title: paso.nombre,
                    activos: paso.activos.map( ( activo )=>{
                        return {
                            id: activo._id,
                            nombre: activo.nombre,
                            rel_paso: activo.rel_paso,
                            tipo: "activo",
                            dependencias: "ejemplo",
                            detenciones: activo.total_detenciones,
                            costo: activo.total_costos,
                            moneda: lineaData.rel_moneda.codigo,
                            nominal: "500 kg/h",
                            esperada: "500 kg/h",
                            mods: activo.mods || [],
                        };
                    } ),
                    mods: paso.mods.map( ( mod )=>{
                        console.log( paso.activos );
                        return {
                            id: mod._id,
                            nombre: mod.nombre,
                            rel_paso: mod.rel_paso,
                            tipo: "mod",
                            dependencias: paso.activos.find( ( activo )=> activo._id === mod.tipo_relacion._id )?.nombre || "No relacionada",
                            costo: mod.total_costos,
                            moneda: lineaData.rel_moneda.codigo,
                            relacion: mod.tipo_relacion._id || "",
                            detenciones: "",
                            nominal: "500 kg/h",
                            esperada: "500 kg/h",
                        };
                    } ),
                };
            } )
            .sort( ( a, b )=>{
                return a.posicion - b.posicion;
            } );
        return convertir( formatedData );
    };
    const convertir = ( datos )=>{
        const info = datos.map( ( dato )=>{
            const cards = [];
            dato.activos.forEach( ( activo )=>{
                cards.push( {
                    id: activo.id,
                    title: activo.nombre,
                    description: activo,
                } );
            } );
            dato.mods.forEach( ( mod )=>{
                cards.push( {
                    id: mod.id,
                    title: mod.nombre,
                    description: mod,
                } );
            } );
            return {
                ...dato,
                cards,
            };
        } );
        return { columns: info, moved: false };
    };
    return [ data, updateLineas ];
};
