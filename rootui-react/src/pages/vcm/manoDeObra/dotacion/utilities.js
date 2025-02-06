import { deleteStorage, getStorage, setStorage } from "../../helpers/manejoStorage";

export const precargarDotacion = ( idLinea )=>{
    const dotaciones = getStorage( `${ idLinea } - dotaciones` ) || [];
    const recursos = getStorage( `${ idLinea } - habilitaciones` ) || [];
    const datos = getStorage( `${ idLinea } - datos dotacion` );
    const tipoHorario = getStorage( `${ idLinea } - horarios dotacion` );
    const horarioPersonalizado = getStorage( `${ idLinea } - personalizado dotacion` );
    const totalHoras = getStorage( `${ idLinea } - total horas dotacion` );
    const cargos = getStorage( `${ idLinea } - cargos` );
    const costoPersonal = cargos.reduce( ( acc, cargo )=>{
        return acc + ( cargo.costo * cargo.cantidad );
    }, 0 );
    const costoRecursos = recursos.reduce( ( acc, recurso )=>{
        return acc + ( recurso.cantidad * recurso.recurso.costo );
    }, 0 );
    const dotacion = {
        _id: datos._id,
        turno: {
            nombre: datos.nombre,
            descripcion: datos.descripcion,
            tipoHorario,
            horarioPersonalizado,
            totalHoras,
            costoPersonal,
            costoRecursos,
        },
        cargos,
        recursos,
    };

    const index = dotaciones.findIndex( dot => dot._id === datos._id );
    if ( index === -1 ) {
        dotaciones.push( dotacion );
    } else {
        dotaciones[ index ] = dotacion;
    }

    setStorage( `${ idLinea } - dotaciones`, dotaciones );
    deleteStorage( `${ idLinea } - nombre dotacion` );
    deleteStorage( `${ idLinea } - descripcion dotacion` );
    deleteStorage( `${ idLinea } - habilitaciones` );
    deleteStorage( `${ idLinea } -horarios dotacion` );
    setStorage( `${ idLinea } - personalizado dotacion`, {
        lunes: {
            inicio: "00:00",
            fin: "00:00",
        },
        martes: {
            inicio: "00:00",
            fin: "00:00",
        },
        miercoles: {
            inicio: "00:00",
            fin: "00:00",
        },
        jueves: {
            inicio: "00:00",
            fin: "00:00",
        },
        viernes: {
            inicio: "00:00",
            fin: "00:00",
        },
        sabado: {
            inicio: "00:00",
            fin: "00:00",
        },
        domingo: {
            inicio: "00:00",
            fin: "00:00",
        },
    } );
    deleteStorage( `${ idLinea } - total horas dotacion` );
    deleteStorage( `${ idLinea } - cargos` );
    deleteStorage( `${ idLinea } - datos dotacion` );
};

export const validarDotacion = ( idLinea )=>{
    const { nombre, descripcion } = getStorage( `${ idLinea } - datos dotacion` ) || { nombre: "", descripcion: "" };
    const totalHoras = getStorage( `${ idLinea } - total horas dotacion` );
    const cargos = getStorage( `${ idLinea } - cargos` ) || [];
    if ( ! nombre ) {
        return "Debe ingresar un nombre para la dotación";
    }
    if ( ! descripcion ) {
        return "Debe ingresar una descripción para la dotación";
    }
    if ( ! totalHoras ) {
        return "Debe ingresar un total de horas para la dotación";
    }
    if ( cargos.length < 1 ) {
        return "Debe ingresar al menos un cargo para la dotación";
    }
    if ( nombre.length < 3 ) {
        return "El nombre debe tener al menos 3 caracteres";
    }
    if ( descripcion.length < 3 ) {
        return "La descripción debe tener al menos 3 caracteres";
    }
    if ( totalHoras === 0 || totalHoras === "00:00" || totalHoras === "0:00" ) {
        return "El total de horas debe ser mayor a 0";
    }
    if ( cargos?.length < 0 ) {
        return "Debe agregar al menos un cargo";
    }
    return "";
};
