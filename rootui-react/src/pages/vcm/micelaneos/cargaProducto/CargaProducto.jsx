// import React, { useState, useEffect } from 'react';
import React from 'react';
import { Micelaneos } from '../Components/micelaneos';
import "./_cargaProducto.scss";
export const CargaProducto = () => {
    const initialForm = {
        nombre: "",
        descripcion: "",
        sku: "",
    };
    return (
        <Micelaneos initialForm={ initialForm } title={ "Carga de Productos" } ruta={ "productos" } />
    );
};
