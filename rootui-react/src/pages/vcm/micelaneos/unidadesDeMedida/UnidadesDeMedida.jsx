import React from 'react';
import { Micelaneos } from '../Components/micelaneos';

export const UnidadesDeMedida = () => {
    const initialForm = {
        nombre: "",
        codigo: "",
    };
    return (
        <Micelaneos initialForm={ initialForm } title={ "Unidades de medida" } ruta={ 'unidades' } />
    );
};
