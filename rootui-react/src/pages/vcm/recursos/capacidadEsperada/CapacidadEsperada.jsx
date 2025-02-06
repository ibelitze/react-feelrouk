import React, { useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { Form } from 'reactstrap';
import { renderTooltip } from '../../helpers/renderToolTip';
import { FormCapacidad } from '../capacidad/components/FormCapacidad';
import { Detenciones } from './detenciones/Detenciones';
import alert from '../../../../../common-assets/images/vcm/alert-circle.png';
import './_styles.scss';
import { useParams } from 'react-router-dom';
export const CapacidadEsperada = ( { currentStep, prev, next, medida } ) => {
    const [ errors, setErrors ] = useState( "" );
    const { id: idLinea } = useParams();
    const storageCapacidadEsperada = `${ idLinea } - capacidad esperada`;
    if ( currentStep !== 4 ) {
        return null;
    }
    if ( ! medida?._id ) {
        return null;
    }
    return <div className="container-cap-esp">
        <h1 className="mt-20" >4 - Capacidad Esperada</h1> 
        <h3>4.1 - Detenciones Programadas</h3>
        <Detenciones storage={ `${ idLinea } - programadas` } title="Detenciones Programadas" ></Detenciones>
        <h3 className="mt-15">4.2 - Detenciones Relacionadas</h3>
        <Detenciones storage={ `${ idLinea } - relacionadas` } title="Detenciones Relacionas" ></Detenciones>
        <h1 className="mt-30">4.3 - Capacidad Esperada - Datos Generales</h1>
        <Form onSubmit={ e => e.preventDefault() }>
            <FormCapacidad medida={ medida } storage={ storageCapacidadEsperada } title="4.3 - Capacidad Esperada - Datos Generales" setErrors={ setErrors } errors={ errors } />
        </Form>
        
        <h2 className="mt-20"> 4.4 - Es necesario el cálculo de velocidad nominal </h2>
        <div className="row pl-40">
            <input className="form-check-input" type="checkbox" value="" id="calcular" />
            <label className="form-check-label" htmlFor="calcular" >
                Calcular Velocidad Nominal  
                <OverlayTrigger
                    placement="right"
                    delay={ { show: 250, hide: 400 } }
                    overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                >
                    <img alt="informacion" src={ alert } />
                </OverlayTrigger>
            </label>
        </div>
        <div className="p-20 d-flex w-100 justify-content-between ">
            <button onClick={ ()=>{
                prev();
            } } type="button" className="btn btn-feelrouk-naranja2 btn-blue">Volver</button>
            <button disabled={ errors } type="button" onClick={ ()=>{ 
                next();
            } } className=" btn btn-feelrouk-naranja2 ">
                Continuar
            </button>
        </div>
    </div>;
};
