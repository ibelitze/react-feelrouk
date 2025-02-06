import React from 'react';
import { Micelaneos } from '../Components/micelaneos';

export const CreacionDeCargos = () => {
    const initialForm = {
        nombre: "",
    };
    return (
        <Micelaneos initialForm={ initialForm } title={ "Creacion de Cargos" } ruta={ 'cargos' } />
    );
};
