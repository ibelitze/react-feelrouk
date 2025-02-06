import React from 'react';
import '../_styles.scss';
import process from '../../../../../common-assets/images/vcm/process.svg';
import { CargaMasiva } from '../components/CargaMasiva';
export const ProductosYServicios = () => {
    return (
        <div className="container-carga-masiva">
            <h1>
                <img src={ process } alt="icon" />
                Planificación de demanda | Carga Masiva de Productos / Servicios
            </h1>
            <CargaMasiva type="productos" />
        </div>
    );
};
