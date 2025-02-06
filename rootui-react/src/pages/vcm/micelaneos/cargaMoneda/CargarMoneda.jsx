import React from 'react';
import { Micelaneos } from '../Components/micelaneos';

export const CargarMoneda = () => {
    const initialForm = {
        nombre: "",
        codigo: "",
    };
    return (
        <Micelaneos initialForm={ initialForm } title={ "Carga de monedas" } ruta={ 'monedas' } />
    );
};
