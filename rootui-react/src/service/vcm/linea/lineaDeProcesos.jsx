import axios from "axios";
import { getStorage } from "../../../pages/vcm/helpers/manejoStorage";

export const createLinea = async( linea, pasos ) =>{
    console.log( 'linea', linea );
    console.log( 'pasos', pasos );
    const sesion = getStorage( 'props' ).info;
    const empresaID = sesion.empresa.id;
    const empleadoID = sesion.cliente.id;
    const defaultConfig = {
        tolerancia_min: "0",
        tolerancia_max: "0",
        isrango: false,
        rel_linea: linea._id,
    };
    const log = "Creó la linea de procesos.";
    try {
        const response = await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/lineas`, { linea: { ... linea,
            rel_empresa: empresaID,
            rel_empleado: empleadoID,
        }, pasos } );
        if ( response.status === 200 ) {
            await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/config`, defaultConfig );
            createLog( log, linea._id );
        }
        return response;
    } catch ( error ) {
        return error.response;
    }
};
export const getLDPData = async( id )=>{
    try {
        const response = await axios.get( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/${ id }` );
        return response;
    } catch ( error ) {
        return error.response;
    }
};
export const getLinea = async( id )=>{
    try {
        const response = await axios.get( `${ process.env.REACT_APP_API_URL }/api/vcm/lineas/get/${ id }` );
        return response;
    } catch ( error ) {
        return error.response;
    }
};
export const getAllLinea = async( )=>{
    const sesion = getStorage( 'props' ).info;
    const empresaID = sesion.empresa.id;
    try {
        const response = await axios.get( `${ process.env.REACT_APP_API_URL }/api/vcm/lineas/${ empresaID }` );
        return response;
    } catch ( error ) {
        return error.response;
    }
};

export const deleteLineaById = async( id )=>{
    try {
        const response = await axios.delete( `${ process.env.REACT_APP_API_URL }/api/vcm/lineas/${ id }` );
        return response;
    } catch ( error ) {
        return error.response;
    }
};
export const getLineaData = async( id )=>{
    try {
        const response = await axios.get( `${ process.env.REACT_APP_API_URL }/api/vcm/lineas/get/${ id }/data` );
        return response;
    } catch ( error ) {
        return error.response;
    }
};

export const updatePaso = async( id, paso )=>{
    try {
        const response = await axios.patch( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/pasos`, { ...paso, _id: id } );
        return response;
    } catch ( error ) {
        return error.response;
    }
};
export const getConfig = async( id )=>{
    try {
        const response = await axios.get( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/${ id }/config` );
        return response;
    } catch ( error ) {
        return error.response;
    }
};
export const updateConfig = async( body )=>{
    try {
        const response = await axios.patch( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/config`, body );
        return response;
    } catch ( error ) {
        return error.response;
    }
};
export const createLog = async( mensaje, id )=>{
    const sesion = getStorage( 'props' ).info;
    const empleadoID = sesion.cliente.id;
    try {
        const log = {
            accion: mensaje,
            rel_autor: empleadoID,
            fecha: new Date(),
            rel_linea: id,
        };
        await axios.post( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/logs`, log );
    } catch ( error ) {
        return error.response;
    }
};
export const getLogsByLinea = async( id )=>{
    try {
        const response = await axios.get( `${ process.env.REACT_APP_API_URL }/api/vcm/ldp/${ id }/logs` );
        return response;
    } catch ( error ) {
        return error.response;
    }
};
