import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { postComentario } from '../../../../service/vcm/linea/comentarios';
import './_rangoTolerancia.scss';
export const NuevoComentario = ( { updateComentarios } ) => {
    const { id: idparam } = useParams();
    const [ comentario, setComentario ] = useState( '' );
    const handleSubmit = async()=>{
        if ( comentario.trim().length !== 0 ) {
            const res = await postComentario( comentario, idparam );
            if ( res.status === 200 ) {
                updateComentarios();
                Swal.fire( '', 'Se ha creado el comentario correctamente', 'success' );
                setComentario( '' );
            } else {
                Swal.fire( '', 'Ha ocurrido un error inesperado', 'error' );
            }
        } else {
            Swal.fire( '', 'El comentario no puede estar vacio', 'error' );
        }
    };
    return (
        <div className="new-comment">
            <h3>Nuevo Comentario</h3>
            <textarea value={ comentario } onChange={ ( e )=>{
                setComentario( e.target.value );
            } } id="" cols="30" rows="10"></textarea>
            <button className="btn btn-orange" onClick={ handleSubmit } >Agregar comentario</button>
        </div>
    );
};
