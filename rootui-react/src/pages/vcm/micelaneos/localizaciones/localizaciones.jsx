import React from 'react';
import { Micelaneos } from '../Components/micelaneos';

export const Localizaciones = () => {
    const initialForm = {
        nombre: "",
    };
    return (
        <Micelaneos initialForm={ initialForm } title={ "Localizaciones" } ruta={ 'localizaciones' } />
    );
};
