import axios from "axios";
import { v4 } from "uuid";
import { deleteStorage, getStorage } from "../../../../pages/vcm/helpers/manejoStorage";
import { createLog } from "../lineaDeProcesos";
import { createDotacion } from "./dotaciones";
import { createEficiencia } from "./eficiencia";

export const createMod = async( idLinea )=>{
    const sesion = getStorage( 'props' ).info;
    const empresaID = sesion.empresa.id;
    const empleadoID = sesion.cliente.id;
    const body = getStorage( `${ idLinea } - datos basicos mod` );
    const dotaciones = getStorage( `${ idLinea } - dotaciones` );
    const tipoHorario = getStorage( `${ idLinea } - horarios datos basicos mod` );
    const costos = dotaciones.reduce( ( total, dotacion ) => total + dotacion.turno.costoPersonal, 0 ) + dotaciones.reduce( ( total, dotacion ) => total + dotacion.turno.costoRecursos, 0 );
    const requestBody = {
        _id: v4(),
        nombre: body.nombre,
        criticidad: body.criticidad,
        eficiencia: body.eficiencia,
        tipo_horario: tipoHorario,
        total_horas: body.horas,
        tipo_relacion: body.relacion,
        total_costos: costos,
        rel_paso: body.posicion,
        rel_empresa: empresaID,
        rel_empleado: empleadoID,
    };
    let horarioPersonalizado;
    let response;
    if ( tipoHorario === "personalizado" ) {
        horarioPersonalizado = getStorage( `${ idLinea } - personalizado datos basicos` );
        response = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/mods/datos`, { ...requestBody,
            horario_personalizado: horarioPersonalizado,
        } );
    } else {
        response = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/mods/datos`, requestBody );
    }
    if ( response.status === 200 ) {
        for ( let i = 0; i < dotaciones.length; i++ ) {
            await createDotacion( dotaciones[ i ], requestBody._id );
        }
        await createEficiencia( requestBody._id, idLinea );
        await createLog( `Creo el mod ${ requestBody.nombre }`, idLinea );
        deleteStorage( `${ idLinea } - datos basicos mod` );
        deleteStorage( `${ idLinea } - horarios datos basicos mod` );
        deleteStorage( `${ idLinea } - personalizado datos basicos mod` );
        deleteStorage( `${ idLinea } - eficiencia` );
        deleteStorage( `${ idLinea } - dotaciones` );
    }
    return response;
};
