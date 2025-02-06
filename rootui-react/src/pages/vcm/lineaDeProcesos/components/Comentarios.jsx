import React from 'react';
import { Comentario } from './Comentario';
export const Comentarios = ( { comentarios } ) => {
    return (
        <div className="comments-container" >
            {
                comentarios.map( ( { id, name, date, comment, autor } )=>{
                    return <Comentario key={ id } autor={ autor } name={ name } date={ date } comment={ comment } />;
                } )
            }
        </div>
    );
};
