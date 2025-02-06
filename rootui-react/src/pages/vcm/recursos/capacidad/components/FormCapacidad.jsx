import React, { useEffect } from 'react';
import { Col, FormGroup, Row } from 'reactstrap';
import { useForm } from '../../../../../hooks/useForm';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getStorage, setStorage } from '../../../helpers/manejoStorage';
import alert from '../../../../../../common-assets/images/vcm/alert-circle.png';
export const FormCapacidad = ( { title, setErrors, errors, storage, medida } ) => {
    const validarForm = ( form )=>{
        let error;
        Object.entries( form ).forEach( ( [ , value ] ) => {
            if ( value.length < 3 ) {
                error = "Todos los campos deben contener al menos 3 caracteres";
            }
        } );
        return error;
    };
    if ( ! medida?._id ) {
        return "...loading";
    }
    const initialForm = {
        funcionamiento: "",
        tiempo: {
            codigo: "hs",
            nombre: "Horas",
        },
        medida: { ...medida },
        capacidad: "",
        ciclo: "",
    };
    const [ form, handleChange ] = useForm( getStorage( storage ) || { ...initialForm } );
    useEffect( ()=>{
        setErrors( validarForm( form ) );
        setStorage( storage, form );
    }, [ form ] );
    const renderTooltip = ( { props, texto } ) => (
        <Tooltip id="button-tooltip" { ...props }>
            { texto }
        </Tooltip>
    );
    return (
        <>
            <Row>
                <Col md={ 6 } >
                    <FormGroup>
                        <label htmlFor={ "funcionamiento" + title } >Funcionamiento</label>
                        <input id={ "funcionamiento" + title } value={ form.funcionamiento } onChange={ handleChange } name="funcionamiento" type="text" className="input-hcm-formulario form-control" />
                    </FormGroup>
                </Col>
                <Col md={ 6 } >
                    <FormGroup>4
                        <label htmlFor={ "tiempo" + title } >Unidad de tiempo</label>
                        <Row>
                            <Col>
                                <input disabled value={ form.tiempo.nombre } type="text" className="input-hcm-formulario form-control" />
                            </Col>
                            <Col sm={ 2 }>
                                <OverlayTrigger
                                    placement="right"
                                    delay={ { show: 250, hide: 400 } }
                                    overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                                >
                                    <img alt="informacion" src={ alert } />
                                </OverlayTrigger>
                            </Col>
                        </Row>
                    </FormGroup>
                </Col>
                <Col md={ 6 } >
                    <FormGroup>
                        <label htmlFor={ "ciclo" + title } >Ciclo Productivo</label>
                        <input id={ "ciclo" + title } value={ form.ciclo } onChange={ handleChange } name="ciclo" type="text" className="input-hcm-formulario form-control" />
                    </FormGroup>
                </Col>
                <Col md={ 6 } >
                    <FormGroup>
                        <label htmlFor={ "medida" + title } >Unidad de medida</label>
                        <Row>
                            <Col>
                                <input disabled value={ form.medida.nombre } type="text" className="input-hcm-formulario form-control" />
                            </Col>
                            <Col sm={ 2 }>
                                <OverlayTrigger
                                    placement="right"
                                    delay={ { show: 250, hide: 400 } }
                                    overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                                >
                                    <img alt="informacion" src={ alert } />
                                </OverlayTrigger>
                            </Col>
                        </Row>
                    </FormGroup>
                </Col>
                <Col md={ 6 } >
                    <FormGroup>
                        <label htmlFor={ "capacidad" + title } >Capacidad</label>
                        <Row>
                            <Col>
                                <input id={ "capacidad" + title } value={ form.capacidad } onChange={ handleChange } name="capacidad" type="text" className="input-hcm-formulario form-control" />
                            </Col>
                            <Col sm={ 2 }>
                                <OverlayTrigger
                                    placement="right"
                                    delay={ { show: 250, hide: 400 } }
                                    overlay={ props => renderTooltip( { props, texto: "Tooltip" } ) }
                                >
                                    <img alt="informacion" src={ alert } />
                                </OverlayTrigger>
                            </Col>
                        </Row>
                    </FormGroup>
                </Col>
                <div hidden={ ! errors || ! ( form.capacidad || form.ciclo || form.funcionamiento ) } className=" alert alert-danger w-100 ">
                    { errors }
                </div>
            </Row>
        </>
    );
};
