import axios from "axios";
import { v4 } from "uuid";
import { deleteStorage, getStorage } from "../../../../pages/vcm/helpers/manejoStorage";
import { aHorasYMinutos, aMinutos } from "../../../../pages/vcm/recursos/capacidadEsperada/detenciones/helpers/convertirMinutosHoras";
import { createLog } from "../lineaDeProcesos";
import { createCapacidadEsperada } from "./capacidadEsperada";
import { createCapacidadNominal } from "./capacidadNominal";
import { createDetenciones } from "./detenciones";
import { createSuministros } from "./suministros";

export const createActivo = async( idLinea )=>{
    const sesion = getStorage( 'props' ).info;
    const empresaID = sesion.empresa.id;
    const empleadoID = sesion.cliente.id;
    const body = getStorage( `${ idLinea } - datos basicos` );
    const tipoHorario = getStorage( `${ idLinea } - horarios datos basicos` );
    const totalDetenciones = aHorasYMinutos(
        getStorage( `${ idLinea } - programadas` )
            .concat( getStorage( `${ idLinea } - relacionadas` ) )
            .reduce( ( acum, detencion )=>{
                return acum + aMinutos( detencion.tiempo );
            }, 0 )
    );
    const totalCostos = getStorage( `${ idLinea } - suministros` ).reduce( ( acum, suministro )=>{
        return acum + ( suministro.costo * suministro.consumo );
    }, 0 );
    const requestBody = {
        _id: v4(),
        nombre: body.nombre,
        criticidad: body.criticidad,
        eficiencia: body.eficiencia,
        tipo_horario: tipoHorario,
        total_horas: body.horas,
        total_costos: totalCostos,
        total_detenciones: totalDetenciones,
        rel_paso: body.posicion,
        rel_empresa: empresaID,
        rel_empleado: empleadoID,
    };
    let horarioPersonalizado;
    let response;
    try {
        if ( tipoHorario === "personalizado" ) {
            horarioPersonalizado = getStorage( `${ idLinea } - personalizado datos basicos` );
            response = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/activos/datos`, { ...requestBody,
                horario_personalizado: horarioPersonalizado,
            } );
        } else {
            response = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/activos/datos`, requestBody );
        }
        if ( response.status === 200 ) {
            await createSuministros( requestBody._id, idLinea );
            await createCapacidadNominal( requestBody._id, idLinea );
            await createCapacidadEsperada( requestBody._id, idLinea );
            await createDetenciones( requestBody._id, idLinea );
            createLog( `Creo el activo ${ requestBody.nombre }`, idLinea );
            deleteStorage( `${ idLinea } - datos basicos` );
            deleteStorage( `${ idLinea } - horarios datos basicos` );
            deleteStorage( `${ idLinea } - personalizado datos basicos` );
            deleteStorage( `${ idLinea } - capacidad esperada` );
            deleteStorage( `${ idLinea } - suministros` );
            deleteStorage( `${ idLinea } - programadas` );
            deleteStorage( `${ idLinea } - capacidad nominal` );
            deleteStorage( `${ idLinea } - relacionadas` );
        }
        return response;
    } catch ( error ) {
        return error.response;
    }
};

export const updateActivo = async( id, body )=>{
    try {
        const response = await axios.patch( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/activos/datos`, { ...body, _id: id } );
        return response;
    } catch ( error ) {
        return error.response;
    }
};

export const updateMods = async( id, body )=>{
    try {
        const response = await axios.patch( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/mods/datos`, { ...body, _id: id } );
        return response;
    } catch ( error ) {
        return error.response;
    }
};

export const getActivosByPaso = async( idPaso )=>{
    try {
        const response = await axios.get( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/activos/datos/${ idPaso }` );
        return response;
    } catch ( error ) {
        return error.response;
    }
};
