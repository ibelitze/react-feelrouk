import axios from "axios";
import { getStorage } from "../../../../pages/vcm/helpers/manejoStorage";

export const createDetenciones = async( id, idLinea )=>{
    const body = getStorage( `${ idLinea } - programadas` )
        .concat( getStorage( `${ idLinea } - relacionadas` ) )
        .map( ( detencion )=>{
            return {
                ...detencion,
                rel_activo: id,
            };
        } );
    try {
        const response = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/activos/detenciones`, body );
        return response;
    } catch ( error ) {
        return error.response;
    }
};
