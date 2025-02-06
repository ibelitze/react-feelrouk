import axios from "axios";
import { getStorage } from "../../../../pages/vcm/helpers/manejoStorage";

export const createEficiencia = async( id, idLinea )=>{
    const body = getStorage( `${ idLinea } - eficiencia` );
    const requestBody = {
        funcionamiento: body.funcionamiento,
        unidad_tiempo: body.tiempo.codigo,
        ciclo_productivo: body.ciclo,
        unidad_medida: body.medida._id,
        capacidad: body.capacidad,
        rel_mod: id,
    };
    const response = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/mods/eficiencia`, requestBody );
    return response;
};
