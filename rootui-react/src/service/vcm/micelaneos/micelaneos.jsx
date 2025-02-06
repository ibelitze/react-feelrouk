import axios from "axios";
import { getStorage } from "../../../pages/vcm/helpers/manejoStorage";
const sesion = getStorage( 'props' ).info;
const empresaID = sesion.empresa.id;
export const createMicelaneo = async( ruta, body ) =>{
    try {
        const response = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/micelaneos/${ ruta }`, { ...body, rel_empresa: empresaID } );
        return response;
    } catch ( err ) {
        return err.response;
    }
};
export const cargaMasivaMicelaneo = async( ruta, body ) =>{
    body.set( "empresa", empresaID );
    try {
        const response = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/micelaneos/${ ruta }/csv`, body );
        return response;
    } catch ( err ) {
        return err.response;
    }
};
export const getByEmpresa = async( ruta ) =>{
    try {
        const response = await axios.get( `${ process.env.REACT_APP_API_URL }/api/vcm/micelaneos/${ ruta }/${ empresaID }` );
        return response;
    } catch ( err ) {
        return err.response;
    }
};
export const getByMicelaneoByID = async( ruta, id ) =>{
    try {
        const response = await axios.get( `${ process.env.REACT_APP_API_URL }/api/vcm/micelaneos/${ ruta }/${ id }` );
        return response;
    } catch ( err ) {
        return err.response;
    }
};
export const getCategoriasBySeccion = async( id ) =>{
    try {
        const response = await axios.get( `${ process.env.REACT_APP_API_URL }/api/vcm/micelaneos/categorias/${ id }` );
        return response;
    } catch ( err ) {
        return err.response;
    }
};

export const getSubcategoriasByCategoria = async( id ) =>{
    try {
        const response = await axios.get( `${ process.env.REACT_APP_API_URL }/api/vcm/micelaneos/subcategorias/${ id }` );
        return response;
    } catch ( err ) {
        return err.response;
    }
};
export const getRecursos = async( tipo, id ) =>{
    try {
        const response = await axios.get( `${ process.env.REACT_APP_API_URL }/api/vcm/micelaneos/recursos/${ tipo }/${ id }` );
        return response;
    } catch ( err ) {
        return err.response;
    }
};

export const productSearch = async( payload ) =>{
    try {
        const response = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/micelaneos/productos/search`, {
            payload,
        } );
        return response;
    } catch ( err ) {
        return err.response;
    }
};
