export const validarFormCrearLinea = ( form )=> {
    const { nombre,
        posicion,
        relacion, horas } = form;
    const error = "";
    if ( nombre.lenght < 3 ) {
        return "El nombre debe tener al menos 3 caracteres";
    }
    if ( ! posicion ) {
        return "Debe seleccionar una posición";
    }
    if ( ! relacion.tipo ) {
        return "Debe seleccionar un tipo de relación";
    }
    if ( relacion.tipo !== 'No relacionada' && ! relacion._id ) {
        return "Debe seleccionar un activo";
    }
    if ( horas === '0:00' ) {
        return "Debe seleccionar un horario";
    }
    return error;
};
