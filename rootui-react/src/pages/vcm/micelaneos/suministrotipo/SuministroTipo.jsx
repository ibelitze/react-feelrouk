import React from 'react';
import { Micelaneos } from '../Components/micelaneos';

export const SuministroTipo = () => {
    const initialForm = {
        nombre: "",
    };
    return (
        <Micelaneos initialForm={ initialForm } title={ "Tipo de Suministro" } ruta={ 'suministros' } />
    );
};
