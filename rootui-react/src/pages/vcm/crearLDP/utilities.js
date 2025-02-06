export const validarFormCrearLinea = ( { nombre,
    rel_localizacion: localizacion,
    rel_moneda: moneda,
    rel_unidades: unidades,
    jerarquia_min: min,
    jerarquia_max: max,
    pasos,
    descripcion,
    tipo_horario: horario } )=>{
    let error;
    if ( nombre.length < 3 ) {
        error = 'El nombre debe tener al menos 3 caracteres';
    }
    if ( ! localizacion ) {
        error = 'Debe seleccionar una localización';
    }
    if ( ! moneda ) {
        error = 'Debe seleccionar una moneda';
    }
    if ( ! unidades ) {
        error = 'Debe seleccionar una unidad';
    }
    if ( min < 0 || min === "" || min > max ) {
        error = "El minimo debe estar entre 0 y el maximo";
    }
    if ( max < 1 ) {
        error = "El maximo debe ser al menos 1";
    }
    if ( pasos.length < 1 ) {
        error = "Debe definir al menos 1 paso";
    }
    if ( descripcion.length < 3 ) {
        error = "La descripción debe tener al menos 3 caracteres";
    }
    if ( ! horario ) {
        error = "Debe seleccionar un horario";
    }
    return error;
};
    
export const isEmpty = ( data = [] )=>{
    let empty = true; 
    Object.entries( data ).forEach( ( [ , value ] )=>{
        if ( typeof value !== 'number' && value !== "0:00" ) {
            if ( value !== "" ) {
                empty = false;
            }
        }
    } );
    return empty;
};
