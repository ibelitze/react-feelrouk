import axios from "axios";
import { v4 } from "uuid";

export const createDotacion = async( dotacion, id ) => {
    const turno = {
        _id: v4(),
        rel_mod: id,
        nombre: dotacion.turno.nombre,
        descripcion: dotacion.turno.descripcion,
        costo_cargos: dotacion.turno.costoPersonal,
        tipo_horario: dotacion.turno.tipoHorario,
        horario_personalizado: dotacion.turno.horarioPersonalizado,
        total_horas: dotacion.turno.totalHoras,
    };
    const res = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/mods/turnos`, turno );
    if ( res.status === 200 ) {
        for ( let i = 0; i < dotacion.cargos.length; i++ ) {
            await createCargos( dotacion.cargos[ i ], turno._id, dotacion.turno.costoRecursos, dotacion.recursos );
        }
    }
    return res;
};

export const createCargos = async( cargo, turnoID, costoRecursos, habilitaciones ) => {
    const cargoFormateado = {
        _id: cargo.id,
        rel_cargo: JSON.parse( cargo.cargo )._id,
        rel_turno: turnoID,
        cantidad: cargo.cantidad,
        costo: cargo.costo,
        costo_mod_recurso: costoRecursos,
    };
    const res = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/mods/cargos-mod`, cargoFormateado );
    if ( res.status === 200 ) {
        for ( let i = 0; i < habilitaciones.length; i++ ) {
            await habilitarRecursos( habilitaciones[ i ], cargo.id );
        }
    }
    return res;
};

export const habilitarRecursos = async( recurso, cargoId ) => {
    if ( recurso.cargo.id === cargoId ) {
        const habRecursos = {
            rel_mod_cargo: cargoId,
            rel_recurso: recurso.recurso._id,
            cantidad: recurso.cantidad,
            costo: recurso.recurso.costo,
        };
        const res = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/mods/hab-rec`, habRecursos );
        return res;
    }
    return null;
};
