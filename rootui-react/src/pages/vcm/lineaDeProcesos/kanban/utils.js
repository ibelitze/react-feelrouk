import Swal from "sweetalert2";

export const verificarDependencias = async( _card, info, source ) => {
    const modsVinculados = _card.description.props.description.mods ?? [];
    const activoVinculado = _card.description.props.description.dependencias ?? [];
    const tipo = _card.description.props.description.tipo;
    let msg;
    let text;
    const vinculos = [];
    if ( tipo === "activo" ) {
        msg = "El siguiente activo tiene MODs vinculados";
        modsVinculados.forEach( ( mod )=>{
            vinculos.push( mod.nombre );
        } );
        text = `Al moverlo se moverán también los siguientes MODs: ${ vinculos.join( ", " ) }
        ¿Desea continuar? `;
    }
    if ( tipo === "mod" ) {
        if ( _card.description.props.description.relacion !== "" ) {
            msg = "El siguiente MOD tiene un activo vinculado";
            vinculos.push( activoVinculado );
            text = `Al moverlo se moverán se perdera el vinculo con el Activo: ${ vinculos.join( ", " ) }
            ¿Desea continuar? `;
        }
    }
    if ( vinculos.length === 0 ) {
        return true;
    }
    const events = tipo === "activo" ? getIds( info, source, _card.id ) : [];
    const respuesta = await Swal.fire( {
        title: msg,
        text: text,
        showDenyButton: true,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancelar',
        denyButtonText: 'No',
    } );
    return {
        ...respuesta,
        events,
    };
};

const getIds = ( board, source, cardId )=>{
    const columnSource = board.columns.find( ( col ) => col.id === source.fromColumnId );
    const cards = columnSource.cards.filter( ( card ) => card.description.relacion === cardId );
    return cards.map( ( card ) => card.id );
};

export const moveMods = ( board, source, destination, cardId, moveCard )=>{
    const columnSource = board.columns.find( ( col ) => col.id === source.fromColumnId );
    const cardSelected = columnSource.cards.find( ( card ) => card.description.id === cardId );
    const event = {
        from: {
            fromColumnId: source.fromColumnId,
            fromPosition: columnSource.cards.findIndex( ( c ) => cardSelected.description.id === c.description.id ),
        },
        to: {
            toColumnId: destination.toColumnId,
            toPosition: 0,
        },
    };

    return moveCard( board, event.from, event.to );
};
