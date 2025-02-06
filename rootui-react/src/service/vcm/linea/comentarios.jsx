import axios from "axios";
import { getStorage } from "../../../pages/vcm/helpers/manejoStorage";

export const getComentarios = async( id )=>{
    try {
        const response = await axios.get( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/${ id }/comentarios` );
        return response;
    } catch ( error ) {
        return error.response;
    }
};
export const getAutor = async( id )=>{
    try {
        const response = await axios.get( `https://testing-nodefeelrouk.herokuapp.com/api/clientes/getById/${ id }` );
        return response;
    } catch ( error ) {
        return error.response;
    }
};

export const postComentario = async( comentario, id )=>{
    const sesion = getStorage( 'props' ).info;
    const empleadoID = sesion.cliente.id;
    const body = { 
        rel_empleado: empleadoID,
        rel_linea: id,
        fecha: new Date(),
        contenido: comentario, 
    };
    try {
        const response = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/comentarios`, body );
        return response;
    } catch ( error ) {
        return error.response;
    }
};
