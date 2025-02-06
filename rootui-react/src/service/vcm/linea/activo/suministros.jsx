import axios from "axios";
import { getStorage } from "../../../../pages/vcm/helpers/manejoStorage";
export const createSuministros = async( id, idLinea )=>{
    const body = getStorage( `${ idLinea } - suministros` ).map( ( suministro )=>{
        return {
            rel_activo: id,
            rel_tipo: JSON.parse( suministro.tipo )._id,
            suministro: suministro.suministro,
            rel_unidad: suministro.unidad._id,
            consumo: suministro.consumo,
            costo: suministro.costo,
            rel_moneda: suministro.moneda._id,
        };
    } );
    try {
        const response = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/activos/suministros`, body );
        return response;
    } catch ( error ) {
        return error.response;
    }
};
