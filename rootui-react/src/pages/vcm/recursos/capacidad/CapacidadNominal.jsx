import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Row } from 'reactstrap';
import { FormCapacidad } from './components/FormCapacidad';
import './_styles.scss';
export const CapacidadNominal = ( { title, currentStep, next, prev, medida } ) => {
    if ( ! medida?._id ) {
        return null;
    }
    const [ errors, setErrors ] = useState( "" );
    const { id: idLinea } = useParams();
    const storageCapacidadNominal = `${ idLinea } - capacidad nominal`;
    if ( currentStep !== 3 ) {
        return null;
    }
    return <div className="container-cap-nom">
        <h1>{ title }</h1>
        <Form onSubmit={ e => e.preventDefault() }>
            <FormCapacidad medida={ { ...medida } }storage={ storageCapacidadNominal } title={ title } setErrors={ setErrors } errors={ errors } />
            <Row className="d-flex w-100 justify-content-between pl-20 pr-20 align-center">
                <button onClick={ ()=>{
                    prev();
                } } type="button" className="btn btn-feelrouk-naranja2 btn-blue">Volver</button>
                <button type="button" disabled={ errors } onClick={ ()=>{ 
                    next();
                } } className=" btn btn-feelrouk-naranja2 ">
                    Continuar
                </button>
            </Row>
        </Form>
    </div>;
};
