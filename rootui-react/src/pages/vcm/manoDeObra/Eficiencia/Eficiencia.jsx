import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormCapacidad } from '../../recursos/capacidad/components/FormCapacidad';

export const Eficiencia = ( { currentStep, next, prev, medida } ) => {
    const [ errors, setErrors ] = useState( "" );
    const { id: idLinea } = useParams();
    const storageCapacidadNominal = `${ idLinea } - eficiencia`;
    if ( currentStep !== 3 ) {
        return null;
    }
    return (
        <div className="mt-50">
            <h2>3 - Rendimiento</h2>
            <FormCapacidad medida={ medida } storage={ storageCapacidadNominal } title={ "Eficiencia" } setErrors={ setErrors } errors={ errors } />
            <div className="d-flex w-100 justify-content-between pl-20 pr-20 align-center">
                <button onClick={ ()=>{
                    prev();
                } } type="button" className="btn btn-feelrouk-naranja2">Volver</button>
                <button type="button" disabled={ false } onClick={ ()=>{ 
                    next();
                } } className=" btn btn-feelrouk-naranja2 ">
                    Continuar
                </button>
            </div>
        </div>
    );
};
