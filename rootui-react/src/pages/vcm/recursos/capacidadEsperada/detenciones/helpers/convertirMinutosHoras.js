export const aMinutos = ( tiempo = "" )=>{
    tiempo = tiempo.split( ":" );
    const horas = tiempo[ 0 ] * 60;
    return horas + ( tiempo[ 1 ] * 1 );
};

export const aHorasYMinutos = ( tiempo ) => {
    const horas = Math.trunc( tiempo / 60 );
    let minutos = ( tiempo % 60 ).toFixed( 0 );
    if ( minutos < 10 ) {
        minutos = `0${ minutos }`;
    }
    return `${ horas }:${ minutos }`;
};
