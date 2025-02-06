import axios from "axios";
import { getStorage } from "../../../../pages/vcm/helpers/manejoStorage";

export const createCapacidadNominal = async( id, idLinea )=>{
    const body = getStorage( `${ idLinea } - capacidad nominal` );
    const requestBody = {
        funcionamiento: body.funcionamiento,
        unidad_tiempo: body.tiempo.codigo,
        ciclo_productivo: body.ciclo,
        unidad_medida: body.medida._id,
        capacidad: body.capacidad,
        rel_activo: id,
    };
    try {
        const response = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/activos/capacidad/nominal`, requestBody );
        return response;
    } catch ( error ) {
        return error.response;
    }
};
