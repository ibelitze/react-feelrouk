import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLineaData } from '../../../../hooks/useLineaData';
import { DatosBasicos } from '../../manoDeObra/datosBasicos/DatosBasicos';
import { Dotaciones } from '../../manoDeObra/dotacion/Dotaciones';
import { Eficiencia } from '../../manoDeObra/Eficiencia/Eficiencia';
import { Revision } from '../../manoDeObra/revision/Revision';
import { ProgresBarMOD } from '../../manoDeObra/stepMOD/ProgresBarMod';

export const CrearMOD = () => {
    const [ currentStep, setCurrentStep ] = useState( 1 );
    const { id: idparam } = useParams();
    const [ linea ] = useLineaData( idparam );
    const next = () => {
        if ( currentStep < 4 ) {
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
            <ProgresBarMOD currentStep={ currentStep } />
            <DatosBasicos currentStep={ currentStep } next={ next } pasos={ linea.pasos } />
            <Dotaciones moneda={ linea._id && linea.rel_moneda.codigo } currentStep={ currentStep } prev={ prev } next={ next } />
            <Eficiencia currentStep={ currentStep } prev={ prev } next={ next } medida={ linea._id && linea.rel_unidades } />
            <Revision currentStep={ currentStep } prev={ prev } moneda={ linea._id && linea.rel_moneda.codigo } />
        </div>
    );
};
