import React from 'react';
import { Micelaneos } from '../Components/micelaneos';

export const Secciones = () => {
    const initialForm = {
        nombre: "",
    };
    return (
        <Micelaneos initialForm={ initialForm } title={ "Secciones" } ruta={ 'secciones' } />
    );
};
