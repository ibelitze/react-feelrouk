export const canUseDOM = !! (
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);

/**
 * Check if email is valid.
 *
 * @param {string} email email string.
 *
 * @return {boolean} is valid.
 */
export function isValidEmail( email ) {
    // eslint-disable-next-line
    const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test( email );
}

/**
 * Get unique ID.
 *
 * @return {string} uid.
 */
export function getUID() {
    return (
        Number( String( Math.random() ).slice( 2 ) ) +
        Date.now() +
        Math.round( window.performance.now() )
    ).toString( 36 );
}

/**
 * Convert file size to human readable string.
 *
 * @param {number} size file size.
 *
 * @return {string} human readable size.
 */
export function fileSizeToHumanReadable( size ) {
    const i = Math.floor( Math.log( size ) / Math.log( 1024 ) );
    return ( ( size / Math.pow( 1024, i ) ).toFixed( 2 ) * 1 ) + ' ' + [ 'B', 'kB', 'MB', 'GB', 'TB' ][ i ];
}

// listo
export function chequearDatosBasicos( candidato, porcentaje ) {
    let total = 0;
    const miniPorcentaje = parseFloat( porcentaje / 3 );

    if ( candidato.nombre && candidato.apellido ) {
        total += miniPorcentaje;
    }
    if ( candidato.correo ) {
        total += miniPorcentaje;
    }
    if ( candidato.direccion ) {
        total += miniPorcentaje;
    }

    // si el total más 1 se acerca o es superior al porcentaje, devolvemos el porcentaje total
    if ( ( total + 1 ) >= porcentaje ) {
        return porcentaje;
    } 

    // si no: devolvemos solamente la sumatoria que alcanzó el candidato
    return total;
}

// listo
export function chequearCV( candidato, porcentaje ) {
    if ( candidato.cv.includes( "https://storage.googleapis.com/" ) ) {
        return parseFloat( porcentaje );
    }
    return 0;
}

// listo
export function chequearRegistro( candidato, porcentaje ) {
    if ( candidato.registrado ) {
        return parseFloat( porcentaje );
    }
    return 0;
}

export function chequearDocumentos( documentosCandidato, documentosPublicacion, porcentaje ) {
    const numeroDocumentosPubli = documentosPublicacion.length;
    const numeroDcoumentosCandi = documentosCandidato.length;

    // regla de tres
    const porcentajeLocal = ( numeroDcoumentosCandi * 100 ) / numeroDocumentosPubli;

    // ejemplo: si el usuario solamente subió 3 de 4 archivos que pedía la publicación:
    // solamente va a tener un 75% del porcentaje mayor que debe cumplir 
    // este porcentaje mayor puede ser 20% o 30%
    // entonces sería: 75% de 20%
    const total = porcentaje * ( porcentajeLocal / 100 );
    return parseFloat( total );
}

export function chequearTags( candidatoTags, publicacionTags, porcentaje ) {
    const cantidadTags = publicacionTags.length;
    const miniPorciento = 100 / cantidadTags; // esto da el porcentaje que va a tener cada tag por match
    let porcentajeLocal = 0;

    for ( const tag of publicacionTags ) {
        for ( const canditags of candidatoTags ) {
            if ( canditags.rel_tag === tag.id ) {
                porcentajeLocal += miniPorciento;
            }
        }
    }

    const total = porcentaje * ( porcentajeLocal / 100 );
    return parseFloat( total );
}
