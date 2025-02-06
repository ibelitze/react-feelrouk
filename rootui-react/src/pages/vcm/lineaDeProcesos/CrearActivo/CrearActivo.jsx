import React, { useState } from 'react';
import Suministros from '../../recursos/suministros/Suministros';
import { CapacidadNominal } from '../../recursos/capacidad/CapacidadNominal';
import { CapacidadEsperada } from '../../recursos/capacidadEsperada/CapacidadEsperada';
import { DatosBasicos } from '../../recursos/datosBasicos/DatosBasicos';
import { ProgresBarActivos } from '../../recursos/stepActivos/ProgresBarActivos';
import { Revision } from '../../recursos/revision/Revision';
import '../../recursos/stepActivos/_progresBarActivos.scss';
import { useLineaData } from '../../../../hooks/useLineaData';
import { useParams } from 'react-router-dom';
export const CrearActivo = () => {
    const [ currentStep, setCurrentStep ] = useState( 1 );
    const { id: idparam } = useParams();
    const [ linea ] = useLineaData( idparam );
    const next = () => {
        if ( currentStep < 5 ) {
            setCurrentStep( e => e + 1 );
        }
    };
    const prev = () => {
        if ( currentStep > 1 ) {
            setCurrentStep( e => e - 1 );
        }
    };
    return (
        <div className="container-progress">
            <ProgresBarActivos currentStep={ currentStep } />
            <DatosBasicos currentStep={ currentStep } next={ next } pasos={ linea.pasos } />
            <Suministros currentStep={ currentStep } next={ next } prev={ prev } medida={ linea._id && linea.rel_unidades } moneda={ linea._id && linea.rel_moneda } ></Suministros>
            <CapacidadNominal title="3 - Capacidad Nominal" currentStep={ currentStep } next={ next } prev={ prev } medida={ linea._id && linea.rel_unidades } />
            <CapacidadEsperada currentStep={ currentStep } prev={ prev } next={ next } medida={ linea._id && linea.rel_unidades } />
            <Revision currentStep={ currentStep } prev={ prev } />
        </div>
    );
};
